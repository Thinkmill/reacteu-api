module.exports = function (list, transform) {
	list.schema.set('toJSON', { transform: function (doc, rtn, options) {
		rtn.id = rtn._id;
		delete rtn._id;
		delete rtn.__v;

		if (transform) {
			var result = transform(doc, rtn, options);
			if (result) rtn = result;
		}

		return rtn;
	}});
}
