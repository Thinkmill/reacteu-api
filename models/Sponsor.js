var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var modelToJSON = require('../lib/modelToJSON');
var Types = keystone.Field.Types;

/**
 * Sponsor Model
 * ==============
 */

var Sponsor = new keystone.List('Sponsor', {
	sortable: true
});

Sponsor.add({
	name: { type: String, required: true, index: true },
	tier: { type: Types.Select, options: 'diamond, platinum, gold, silver, bronze, startup, supporter', default: 'supporter' },
	image: { type: String, note: 'Path to image, can be ./img... if bundled in app, or http://' },
	website: { type: Types.Url, note: 'Full website URL, including http://' },
	summary: { type: String, size: 'full' },
	description: { type: Types.Markdown }
});

modelToJSON(Sponsor, function (doc, rtn) {
	rtn.description = doc.description.html;
});

bindLastModified(Sponsor, 'sponsor');

/**
 * Registration
 */

Sponsor.defaultColumns = 'name, tier';
Sponsor.register();
