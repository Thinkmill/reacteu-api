var bindLastModified = require('../lib/bindLastModified');
var keystone = require('keystone');
var modelToJSON = require('../lib/modelToJSON');
var Types = keystone.Field.Types;

var Settings = new keystone.List('Settings', {
	nocreate: true,
	nodelete: true
});

Settings.add({
	name: { type: String, noedit: true },

	showAboutView: { type: Boolean, default: false },
	aboutButtonLink: { type: String, default: '' },
	aboutButtonLabel: { type: String, default: '' },
	aboutContent: { type: Types.Code, default: '' },

	refreshInterval: { type: Number, default: 30000 },

	eventPlaceName: { type: String },
	eventAddress: { type: String },
	eventMapsAddress: { type: String, note: 'Address for Maps, appended to http://maps.apple.com/?daddr=' },
	eventTwitter: { type: String, size: 'small', note: 'Twitter Username (without @)' },
	eventFacebook: { type: String, size: 'small', note: 'Facebook Username' },
	eventFacebookPageId: { type: String, size: 'small', note: 'Derived PageID for Facebook, via https://app.urlgeni.us' },
	registrationsOpen: { type: Boolean, default: true },

	showResendEmail: { type: Boolean, default: false }
});

modelToJSON(Settings);

bindLastModified(Settings, 'settings');

Settings.defaultColumns = 'name';
Settings.register();
