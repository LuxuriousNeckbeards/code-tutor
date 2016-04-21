var mongoose = require('mongoose');
var Q = require('q');

var messageSchema = new mongoose.Schema({
  studentName: {type:String, required:true},
  tutorName: {type:String, required:true},
  messages: Array,// contains object with username,timestamp,isTutor and messageBody,
});
module.exports = mongoose.model('Message', messageSchema);
