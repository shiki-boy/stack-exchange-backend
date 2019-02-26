const mongoose = require('mongoose');

const {
  stack_exchangeConn
} = require('../db/mongoose.js');

var ObjectId = mongoose.Schema.Types.ObjectId;

var answerSchema = new mongoose.Schema({
  answer: String,
  votes: Number,
  _qid: {
    type: ObjectId,
    required:true,
    ref: 'Question' // ? for populating
  },
  _creator: {
    type: ObjectId,
    required:true,
    refPath: "onModel",
  },
  onModel: {
    type: String,
    required: true,
    enum: ["User", "UserAP"]
  },
  isAnswer:{
    type:Boolean,
    default:false
  }
})

var Answer = stack_exchangeConn.model('Answer', answerSchema);

module.exports = {
  Answer
}