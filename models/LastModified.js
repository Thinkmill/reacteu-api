var keystone = require('keystone');

var LastModified = new keystone.List('LastModified', {
	nocreate: true,
	nodelete: true
});

LastModified.add({
	name: { type: String, noedit: true },
	people: { type: Date, default: Date.now },
	schedule: { type: Date, default: Date.now },
	settings: { type: Date, default: Date.now },
	sponsors: { type: Date, default: Date.now }
});

LastModified.defaultColumns = 'name';
LastModified.register();
