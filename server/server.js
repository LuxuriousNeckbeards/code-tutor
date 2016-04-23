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
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var editorState;

io.on('connection', function(socket) {
    console.log('Client connected...');

    socket.on('join', function(data) {
        socket.emit('messages', data);
    });

    socket.on('updateEditor', function(state) {
      editorState = state.newState;
    });

    socket.on('joinChat', function(data) {
        console.log('Chat client connected: ', data);
        //socket.emit('messages', data);
    });

    socket.on('chat', function(data) {
      socket.broadcast.emit('updatedChat', {username: data.username, messageBody: data.messageBody});
    });
});


// var socketConfig = function(req, res, next) {
//     //io.emit only if it requires to display to all users
//     //io.emit('this', { will: 'be received by everyone'});
//   var messageBody = req.body;
//   console.log('reqBody in socketConfig>>', req.body);
//   io.on('connection', function (socket) {
//     socket.emit('addMessage', messageBody);



//   });

//   // catch (error) {
//   //     return next(error);
//   next();
// };

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
  server.listen(port);
  module.exports = app;
}
