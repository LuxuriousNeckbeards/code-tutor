var Q = require('q');
var Message = require('./messageModel.js');
var mongoose = require('mongoose');

var findMessages = Q.nbind(Message.find, Message);
var updateMessage = Q.nbind(Message.findOneAndUpdate, Message);
var createMessage = Q.nbind(Message.create, Message);

module.exports.getAllMessages = function(req, res, next) {
  var studentName;
  var tutorName;
  if(req.body.isTutor) {
    tutorName = req.body.username;
    studentName = req.body.clickedname;
  } else {
    studentName = req.body.username;
    tutorName = req.body.clickedname;
  }

  findMessages({
    tutorName: tutorName, 
    studentName: studentName
  })
  .then(function(messages){
    res.status(200).send(messages);
  })
  .catch(function(err) {
    res.status(500);
  });
};

module.exports.addMessages = function(req, res, next) {
  var messageBody = req.body.messageBody;
  var timeStamp = req.body.timeStamp;
  var studentName;
  var tutorName;

  if(req.body.isTutor) {
    tutorName = req.body.username;
    studentName = req.body.clickedname;
  } else {
    studentName = req.body.username;
    tutorName = req.body.clickedname;
  }

  findMessages({
    tutorName: tutorName, 
    studentName: studentName
  })
  .then(function (messageRecord) {
    if (messageRecord) {
      var newMessage = {
        username: req.body.username, 
        messageBody: messageBody, 
        timeStamp: timeStamp 
      };

      messageRecord.update({
        tutorName: tutorName,
        studentName: studentName
      }, 
      { $push: { messages: newMessage }}, {new: true}, function(err, messageRecord) {
        if(err) {
          console.log("Error updating the messages property");
        } else {
          res.status(201).send(messageRecord);
        }
      });
    } else {
      return createMessage({
        studentName: studentName,
        tutorName: tutorName,
        messages: [
          {
            username: req.body.username,
            messageBody: messageBody,
            timeStamp: timeStamp,
          }
        ], 
      });
    }
  })
  .then(function (messageRecord) {
    res.status(201).send(messageRecord);
  })
  .catch(function (err) {
    res.status(500);
  });
  
};