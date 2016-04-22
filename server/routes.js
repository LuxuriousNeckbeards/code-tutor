var userController = require('./user/userController.js');
var messageController = require('./message/messageController.js');
var helpers = require('./helpers.js'); // our custom middleware
var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var keys = require('./apiKeys.js');

var rootPath = path.join(__dirname, '..');

module.exports = function (app, express, opentok) {
  app.use(express.static(__dirname + '/../client'));

  // temporary path for testing: get all tutors in db
  app.get('/api/users/all', userController.getAllTutors);
  app.get('/api/users/search', userController.search);
  // app.get('/api/users/:username', userController.findTutor);

  app.post('/api/users/signup', userController.signup);
  app.post('/api/users/signin', userController.signin);

  app.get('/api/users/:username', userController.findTutor);
  app.get('/api/users/img/:objectId', userController.getImg);

  app.post('/api/users/profile', helpers.decode, multipartMiddleware, userController.saveProfile);
  app.put('/api/users/addLike', helpers.decode, userController.addLike);

  app.get('/api/tutorlist', helpers.decode, userController.getTutorList);
  app.get('/api/studentlist', helpers.decode, userController.getStudentList);

  app.put('/api/tutorlist', helpers.decode, userController.addTutorToList);
  app.put('/api/studentlist', helpers.decode, userController.addStudentToList);

  app.put('/api/messages', messageController.addMessage);
  app.get('/api/messages/:username/:clickedName/:isTutor', messageController.getAllMessages);

  app.get('/api/videochat', function(req, res) {
    var sessionId = app.get('sessionId'),
        token = opentok.generateToken(sessionId);

    res.send({ 
      apiKey: keys.apiKey, 
      sessionId: sessionId, 
      token: token 
    });
  });

  app.get('/*', function(req, res) {
    res.sendFile(rootPath + '/client/index.html');
  });

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
