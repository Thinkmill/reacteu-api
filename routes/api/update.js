var typeforce = require('typeforce');
var keystone = require('keystone');

var auth = require('../../lib/auth');
var Person = keystone.list('Person');

module.exports = function (req, res) {
	try {
		typeforce({
			authToken: 'String',
			me: {
				bio: '?String',
				github: '?String',
				isPublic: 'Boolean',
				name: 'String',
				picture: '?String',
				twitter: '?String'
			}
		}, req.body, true);
	} catch (e) {
		return res.jfin(e);
	}

	var authHash = auth.hash(req.body.authToken);

	Person.model.findOne({ authHash: authHash }, function (err, person) {
		if (err) return res.jfin(err);
		if (!person) return res.jfin(new Error('Invalid authToken'));

		for (var key in req.body.me) {
			person[key] = req.body.me[key];
		}

		person.save(function () {
			res.jfin();
		});
	});
};
