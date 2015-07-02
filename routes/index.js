var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

var cors = require('cors');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var api = importRoutes('./api');
var views = importRoutes('./views');

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', views.index);

	// cross origin requests
	app.use(cors())

	// custom callback style
	app.use('/api', function (req, res, next) {
		res.jfin = function (err, data) {
			res.status(err ? 400 : 200)
			res.json({
				error: (err && err.message) || undefined,
				success: err ? undefined : true,
				data: data
			});
		};

		next();
	});

	app.post('/api/me/activate', api.activate);
	app.post('/api/me/feedback', api.feedback);
	app.post('/api/me/update', api.update);
	app.post('/api/synchronize', api.synchronize);
};
