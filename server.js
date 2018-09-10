// require('marko/node-require'); // Allow Node.js to require and load `.marko` files
var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var passport = require('passport');

// Load environment variables from .env file
dotenv.load();

// Controllers
var HomeController = require('./controllers/home');
var userController = require('./controllers/user');
var itemController = require('./controllers/item');
var publicItemController = require('./controllers/publicItem');
var contactController = require('./controllers/contact');

// Passport OAuth strategies
require('./config/passport');

var app = express();


var hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
});
// var markoExpress = require('marko/express');
// app.use(markoExpress());
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 7777);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user ? req.user.toJSON() : null;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', HomeController.index);
app.get('/theme', HomeController.themeGet);
app.get('/contact', contactController.contactGet);
app.post('/contact', contactController.contactPost);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);


// items 
app.post('/admin/item/create', userController.ensureAuthenticated, itemController.itemPost);
app.post('/admin/item/update/:id', userController.ensureAuthenticated, itemController.itemUpdatePut);
// app.get('/api/admin/item/read/:id', userController.ensureAuthenticated, itemController.itemGet);
// app.delete('/admin/item/delete/:id', userController.ensureAuthenticated, itemController.itemDelete);

// items page
app.get('/admin/item/create', userController.ensureAuthenticated, itemController.itemCreatePage);
app.get('/admin/item/update/:id', userController.ensureAuthenticated, itemController.itemPutPage);
app.get('/admin/item/read', userController.ensureAuthenticated, itemController.itemsReadPage);
app.get('/admin/item/read/:id', userController.ensureAuthenticated, itemController.itemReadPage);

// public items 
app.get('/i', publicItemController.itemsGet);
app.get('/i/:id', publicItemController.itemGet);
app.get('/i/:id/:slug', publicItemController.itemGet);





// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
