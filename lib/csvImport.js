var async = require('async');
var baby = require('babyparse');
var fs = require('fs');
var keystone = require('keystone');
var plural = keystone.utils.plural;
var Person = keystone.list('Person');

module.exports = function(csv) {
	return function(done) {
		var addedCount = 0;
		var updatedCount = 0;
		var people = baby.parse(fs.readFileSync('./updates/' + csv + '.csv', 'utf-8'), { header: true });
		console.log('importing ' + people.data.length + ' people');
		async.eachLimit(people.data, 1, function(data, next) {
			if (!data.ticketCode) return next();
			['firstName', 'lastName'].map(function(path) {
				if (/^[A-Z]+$/.test(data[path]) || /^[a-z]+$/.test(data[path])) {
					data[path] = data[path].slice(0,1).toUpperCase() + data[path].slice(1).toLowerCase();
				}
			});
			var name = data.firstName + ' ' + data.lastName;
			Person.model.findOne().where('ticketCode', data.ticketCode).exec(function(err, person) {
				if (err) {
					console.log('error finding ' + name, err)
					return next(err);
				}
				if (person) {
					updatedCount++;
					console.log('updating ' + name);
				} else {
					addedCount++;
					console.log('adding ' + name);
					person = new Person.model();
				}
				person.name = name;
				person.email = data.email;
				person.company = data.company;
				person.ticketCode = data.ticketCode;
				person.save(function(err) {
					if (err) {
						console.log('error saving ' + name + ':', err);
					} else {
						console.log('saved ' + name);
					}
					next(err);
				});
			});
		}, function(err) {
			console.log('imported ' + plural(addedCount, + '* new person', '* new people') + ', and updated ' + plural(updatedCount, '* person', '* people'));
			done(err);
		});
	};
};
