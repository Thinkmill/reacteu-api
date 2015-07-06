var keystone = require('keystone');

function bindLastModified (list, key) {
	list.schema.post('save', function (next) {
		var LastModified = keystone.list('LastModified');
		LastModified.model.findOne(function (err, lastModified) {
			if (err) return next(err);
			if (!lastModified) {
				lastModified = new LastModified.model();
			}
			lastModified[key] = Date.now();
			lastModified.save(next);
		});
	});
}

module.exports = bindLastModified;
