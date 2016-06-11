// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
try { require('dotenv').load(); }
catch(e) { console.log("No .env file found; using process.env for configuration."); }

// Require keystone
var keystone = require('keystone');

keystone.init({

	'name': 'ReactEU API',
	'brand': 'ReactEU API',
	
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',
	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': '(your secret here)'

});

keystone.import('models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'people': ['people', 'users'],
	'schedule': ['schedule-items', 'schedule-item-feedbacks'],
	'sponsors': 'sponsors',
	'settings': ['settings', 'last-modifieds']
});

keystone.start();
