var typeforce = require('typeforce');
var keystone = require('keystone');

var auth = require('../../lib/auth');
var Person = keystone.list('Person');

var serverSecret = 'VgkZgH6xL7IFVrM6x8kl3';

module.exports = function (req, res) {
	var body = req.body || {};

	try {
		typeforce({
			ticketCode: 'String'
		}, body, true);

	} catch (e) {
		return res.jfin(e);
	}

	Person.model.findOne({
		ticketCode: (body.ticketCode || '!!invalid').toUpperCase()
	}, function (err, person) {
		if (err) return res.jfin(err);
		if (!person) return res.jfin(new Error('Invalid ticketCode'));

		// we're going to let people re-register, they're getting confused.
		// if (person.authHash) return res.jfin(new Error('Already registered'));

		var authToken = auth.hmac(body.ticketCode, serverSecret);
		person.authHash = auth.hash(authToken);
		person.activatedOn = new Date();

		person.save(function () {
			res.jfin(null, {
				authToken: authToken,
				me: {
					bio: person.bio || undefined,
					github: person.github || undefined,
					isPublic: person.isPublic || undefined,
					name: person.name,
					picture: person.customPicture || person.gravatar,
					twitter: person.twitter || undefined
				}
			});
		});
	});
};
