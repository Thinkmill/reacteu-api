var createHash = require('create-hash');
var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var Types = keystone.Field.Types;

/**
 * Person Model
 * ==============
 */

var Person = new keystone.List('Person');

Person.add({
	name: { type: String, required: true, initial: true, index: true },
	email: { type: Types.Email, initial: true, index: true },
	company: { type: String },
	website: { type: Types.Url, note: 'Full website URL, including http://' },
	customPicture: { type: String, note: 'Optional custom image to use in place of Gravatar' },
	isOrganiser: { type: Boolean, default: false, index: true },
	isSpeaker: { type: Boolean, default: false, index: true },
	isPublic: { type: Boolean, default: false, index: true },

	// used in authentication
	ticketCode: { type: String, size: 'small', initial: true, index: true },
	activatedOn: { type: Types.Datetime },
	authHash: { type: String, default: '', index: true },

	// editable via API
	bio: { type: Types.Textarea },
	twitter: { type: String, size: 'small' },
	github: { type: String, size: 'small' },
	sortPriority: { type: Number, size: 'small', default: 10 }
});

Person.schema.index({ isPublic: 1, isOrganiser: 1, isSpeaker: 1 });
Person.schema.index({ isPublic: 1, isOrganiser: 1, isSpeaker: 1, sortPriority: 1 });

// Gravatar
Person.schema.virtual('gravatar').get(function () {
	var md5sum = createHash('md5').update(this.email || '').digest();
	var gravatar = 'https://gravatar.com/avatar/' + md5sum.toString('hex');
	return gravatar;
});

bindLastModified(Person, 'people');

Person.schema.set('toJSON', { transform: function (doc, rtn) {
	return {
		id: doc._id,
		name: doc.name,
		bio: doc.bio || undefined,
		github: doc.github || undefined,
		isOrganiser: doc.isOrganiser || undefined,
		isSpeaker: doc.isSpeaker || undefined,
		picture: doc.customPicture || doc.gravatar,
		twitter: doc.twitter || undefined,
		website: doc.website || undefined
	}
}});

/**
 * Registration
 */

Person.defaultColumns = 'name, twitter, github, ticketCode, activatedOn';
Person.register();
