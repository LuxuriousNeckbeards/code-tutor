var Q = require('q');
var Message = require('./messageModel.js');
var mongoose = require('mongoose');

var findMessages = Q.nbind(Message.find, Message);
var updateMessage = Q.nbind(Message.findOneAndUpdate, Message);
var createMessage = Q.nbind(Message.create, Message);

module.exports.getAllMessages = function(req, res, next) {
  var studentName;
  var tutorName;

  if(req.params.isTutor === 'true') {
    tutorName = req.params.username;
    studentName = req.params.clickedName;
  } else {
    studentName = req.params.username;
    tutorName = req.params.clickedName;
  }

  findMessages({
    tutorName: tutorName,
    studentName: studentName
  })
  .then(function(messages){
    console.log('MESSAGES on GET: ', messages);
    res.status(200).send(messages);
  })
  .fail(function(err) {
    res.status(500);
  });
};

module.exports.addMessage = function(req, res, next) {
  var messageBody = req.body.messageBody;
  var studentName;
  var tutorName;
  var isTutor = req.body.isTutor;

  if(isTutor === 'true') {
    tutorName = req.body.username;
    studentName = req.body.clickedName;
  } else {
    studentName = req.body.username;
    tutorName = req.body.clickedName;
  }

  /* Find Message List for requested username & clicked name: */
  findMessages({
    tutorName: tutorName, 
    studentName: studentName
  })
  .then(function (messageRecord) {

    /* If username/clicked name pairing does not yet exist, create new message record: */
    if (JSON.stringify(messageRecord) === "[]") {
      return createMessage({
        studentName: studentName,
        tutorName: tutorName,
        messages: [
          {
            username: req.body.username,
            messageBody: messageBody,
            timestamp: Date.now(),
          }
        ], 
      });

    /* Otherwise, push new message to message list record: */
    } else {
        var newMessage = {
          username: req.body.username, 
          messageBody: messageBody, 
          timestamp: Date.now() 
        };

        return updateMessage({
          tutorName: tutorName,
          studentName: studentName
        }, { $push: { messages: newMessage }}, {new: true});
    }
  })
  .then(function (messageRecord) {
    res.status(201).send(messageRecord);
  })
  .fail(function (err) {
    console.log('Error! ', err);
    res.status(500);
  });
};
