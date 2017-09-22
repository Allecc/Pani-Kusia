"use strict";

var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');

var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');

/* Session storage */
const Sequelize = require('sequelize');
const sequelize = new Sequelize('kusia', 'root', '', {
  dialect: 'mysql',
  host: 'localhost', // nazwa hosta
  port: 3306
});
// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(logger('dev', {
  // Skip non error
  skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

let sessionStorage = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
  expiration: 7 * 24 * 60 * 60 * 1000  // The maximum age (in milliseconds) of a valid session.
});

app.use(session({
  secret: 'keyboard cat',
  store: sessionStorage,
  resave: false,
  saveUninitialized: false
}));
sessionStorage.sync();

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/angular/'));
app.use('/js', express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist/'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function(){
  console.log('Server started!');
});
module.exports = app;
