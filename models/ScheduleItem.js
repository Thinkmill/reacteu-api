var keystone = require('keystone');
var bindLastModified = require('../lib/bindLastModified');
var modelToJSON = require('../lib/modelToJSON');
var Types = keystone.Field.Types;

/**
 * ScheduleItem Model
 * ==================
 */

var ScheduleItem = new keystone.List('ScheduleItem', {
	map: { name: 'title' },
	autokey: { from: 'title', path: 'key' }
});

ScheduleItem.add({
	title: { type: String, required: true, index: true },
	type: { type: Types.Select, options: 'talk, break, other', index: true },
	startTime: { type: Types.Datetime, utc: true, required: true, initial: true, index: true },
	endTime: { type: Types.Datetime, utc: true, required: true, initial: true, index: true },
	duration: { type: Number, index: true }, // FIXME: could be determined from startTime/endTime
	speakers: { type: Types.Relationship, ref: 'Person', many: true, index: true },
	description: { type: Types.Markdown }
});

modelToJSON(ScheduleItem, function (doc, rtn) {
	rtn.description = doc.description.html;
});

bindLastModified(ScheduleItem, 'schedule');

/**
 * Registration
 */

ScheduleItem.defaultSort = 'time';
ScheduleItem.defaultColumns = 'name, type, time, speakers';
ScheduleItem.register();
