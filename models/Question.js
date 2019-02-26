const mongoose = require('mongoose');

const {
  stack_exchangeConn
} = require('../db/mongoose.js');

var ObjectId = mongoose.Schema.Types.ObjectId;

var questionSchema = new mongoose.Schema({
  q_h: {
    type: String,
    alias: "question_heading",
    required:true
  },
  q: {
    type: String,
    alias: 'question',
    required:true
  },
  votes: {
    type: Number,
    default: 0,
  },
  answers: [{
    type: ObjectId,
    ref: 'Answer',
    default:null
  }],
  tags: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  _creator: {
    type: ObjectId,
    required: true,
    refPath: "onModel"
  },
  onModel: {
    type: String,
    required: true,
    enum: ["User", "UserAP"]
  }
})

questionSchema.index({
  q_h: 'text',
  tags: 'text'
})

var Question = stack_exchangeConn.model('Question', questionSchema);

module.exports = {
  Question
}