var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function(){
    console.log("Connected correctly to the database server");
});


//Importing Routes
var index = require('./routes/index');
var users = require('./routes/users');
var moduleRouter = require('./routes/moduleRouter');
var topicRouter = require('./routes/topicRouter');
var lpRouter = require('./routes/lpRouter');

var app = express();

app.use(favicon(__dirname + '/dist/assets/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next(); 
});

/**
 * Development Settings
 */
if (app.get('env') === 'development') {
    // This will change in production since we'll be using the dist folder
    app.use(express.static(path.join(__dirname, '../client')));
    // This covers serving up the index page
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));
}

/**
 * Production Settings
 */
if (app.get('env') === 'production') {
    // changes it to use the optimized version for production
    app.use(express.static(path.join(__dirname, '/dist')));
}

//Setting up routes
app.use('/modules', moduleRouter);
app.use('/topics', topicRouter);
app.use('/learningPoints', lpRouter);

 // Error Handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
  });
});

module.exports = app;
