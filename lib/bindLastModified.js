var keystone = require('keystone');

function bindLastModified (list, key) {
	list.schema.post('save', function (next) {
		keystone.list('LastModified').model.findOne(function (err, lastModified) {
			if (err) return next(err);
			if (!lastModified) return next(new Error('No lastModified found!'))

			lastModified[key] = Date.now();
			lastModified.save(next);
		});
	});
}

module.exports = bindLastModified;
