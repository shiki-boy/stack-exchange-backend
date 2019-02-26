const mongoose = require('mongoose')

const {
  stack_exchangeConn
} = require('../db/mongoose.js');

var ObjectId = (id) => mongoose.Types.ObjectId(id);

var userAPschema = new mongoose.Schema({
  Auth_Provider: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  questions_created: [{
    type: ObjectId,
    ref: 'Question'
  }],
  answers_created: [{
    type: ObjectId,
    ref: 'Answer'
  }],
  upvotes: [{
    type: ObjectId,
  }],
  downvotes: [{
    type: ObjectId,
  }]
})

var UserAP = stack_exchangeConn.model('UserAP', userAPschema);

module.exports = {
  UserAP
}