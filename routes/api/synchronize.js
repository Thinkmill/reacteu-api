var async = require('async');
var typeforce = require('typeforce')
var keystone = require('keystone');

var Person = keystone.list('Person');
var ScheduleItem = keystone.list('ScheduleItem');
var Settings = keystone.list('Settings');
var Sponsor = keystone.list('Sponsor');
var LastModified = keystone.list('LastModified');

var auth = require('../../lib/auth')

module.exports = function (req, res) {
	var body = req.body || {}

	try {
		typeforce({
			authToken: '?String',
			timestamp: 'String'
		}, body, true)
	} catch (e) {
		return res.jfin(e);
	}

	var authHash = body.authToken && auth.hash(body.authToken)

	async.series({
		authenticated: function (callback) {
			if (!authHash) return callback(null, {})

			Person.model.findOne({ authHash: authHash }, callback)
		},
		lastModifieds: function (callback) { LastModified.model.findOne(callback) }
	}, function (err, results) {
		if (err) return res.jfin(err);

		var authenticated = results.authenticated || {};
		var lastModifieds = results.lastModifieds;

		var queries = {
			people: function (callback) {
				var conditions

				// authenticated API users receive everything
				if (authenticated.ticketCode) {
					conditions = { $or: [{ isOrganiser: true }, { isSpeaker: true }, { isPublic: true }] }

				// unauthenticated API users should only receive *public* organisers/speakers
				} else {
					conditions = {
						isPublic: true,
						$or: [{ isOrganiser: true }, { isSpeaker: true }]
					}
				}

				Person.model.find(conditions).sort('sortPriority name').exec(callback);
			},
			schedule: function (callback) { ScheduleItem.model.find(callback) },
			settings: function (callback) { Settings.model.findOne(callback) },
			sponsors: function (callback) { Sponsor.model.find().sort('sortOrder').exec(callback) }
		}

		// only query for things that updated since the users last request
		var requestTimestamp = new Date(body.timestamp) || new Date(0)

		for (var key in lastModifieds) {
			var lastModifiedDate = new Date(lastModifieds[key]).getTime()

			if (lastModifiedDate < requestTimestamp) {
				delete queries[key]
			}
		}

		async.parallel(queries, function (err, results) {
			if (err) return res.jfin(new Error('Error'))

			// omit undefined/null results
			for (var key in results) {
				if (!results[key]) {
					delete results[key]
				}
			}

			if (authenticated.ticketCode) {
				results.ticketCode = authenticated.ticketCode || undefined
				results.me = {
					bio: authenticated.bio || undefined,
					github: authenticated.github || undefined,
					isPublic: authenticated.isPublic || undefined,
					name: authenticated.name,
					picture: authenticated.customPicture || authenticated.gravatar,
					twitter: authenticated.twitter || undefined
				};
			}

			// add the timestamp to the response
			results.timestamp = new Date()

			res.jfin(null, results)
		})
	});
}
