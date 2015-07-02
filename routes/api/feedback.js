var keystone = require('keystone');
var typeforce = require('typeforce');

var auth = require('../../lib/auth');
var Person = keystone.list('Person');
var ScheduleItemFeedback = keystone.list('ScheduleItemFeedback');

module.exports = function (req, res) {
	try {
		typeforce({
			authToken: 'String',
			id: 'String',
			type: 'String',
			text: 'String'
		}, req.body, true);
	} catch (e) {
		return res.jfin(e);
	}

	var authHash = auth.hash(req.body.authToken);

	Person.model.findOne({ authHash: authHash }, function (err, person) {
		if (err) return res.jfin(err)
		if (!person) return res.jfin(new Error('Invalid authToken'));

		new ScheduleItemFeedback.model({
			talk: req.body.id,
			author: person.id,
			type: req.body.type,
			feedback: req.body.text
		}).save(function (err) {
			res.jfin(err);
		});
	});
};
