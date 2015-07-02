var keystone = require('keystone');
var modelToJSON = require('../lib/modelToJSON');
var Types = keystone.Field.Types;

/**
 * ScheduleItemFeedback Model
 * ==================
 */

var ScheduleItemFeedback = new keystone.List('ScheduleItemFeedback');

ScheduleItemFeedback.add({
	talk: { type: Types.Relationship, ref: 'ScheduleItem', index: true },
	author: { type: Types.Relationship, ref: 'Person', index: true },
	type: { type: Types.Select, options: 'positive, negative', index: true },
	feedback: { type: Types.Textarea }
});

modelToJSON(ScheduleItemFeedback, function(doc, rtn) {
	rtn.description = doc.description.html;
});

/**
 * Registration
 */

ScheduleItemFeedback.defaultSort = 'type';
ScheduleItemFeedback.defaultColumns = 'talk, author, type, feedback';
ScheduleItemFeedback.register();
