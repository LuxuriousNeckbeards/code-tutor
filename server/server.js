/* Express */
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('express-error-handler'),
    morgan = require('morgan');

/* OpenTok Dependencies */
var OpenTok = require('opentok'),
    keys = require('./apiKeys.js');

/* Mongoose */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codeLlama');

var app = express();

/* Init OpenTok */
var opentok = new OpenTok(keys.apiKey, keys.apiSecret);
opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  init();
});

/* Express Middleware */
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '5mb'}));
app.use(methodOverride()); 

//set up routes here from routes file
require('./routes')(app, express, opentok);

const port = process.env.PORT || 8080;

/* Wait to start the app until OpenTok is done setting up session */
function init() {
  app.listen(port);
  module.exports = app;
}
