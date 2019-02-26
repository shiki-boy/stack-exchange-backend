const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const {
  stack_exchangeConn
} = require('../db/mongoose.js');

var ObjectId = (id) => mongoose.Types.ObjectId(id);

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required:true,
    trim:true
  },
  username: {
    type: String,
    unique: true,
    trim:true,
    required:true
  },
  password: {
    type: String,
    trim:true,
    required:true
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
  }],
  tokens: [{
    token: {
      type: String,
      required: true
    },
    access: {
      type: String,
      required: true
    }
  }]
})

// ? method override 
userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['username'])
}


userSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  var SignOptions = {
    // issuer: i,
    // subject: s,
    // audience: a,
    expiresIn: "1h",
    // algorithm: "RS256"
  };
  let token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, 'MYSECRET',
  SignOptions).toString();

  user.tokens = user.tokens.concat([{
    token,
    access
  }]);

  return user.save().then(() => token);

}

// ? statics -> model method 
userSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;
  var VerifyOptions = {
    // issuer: i,
    // subject: s,
    // audience: a,
    expiresIn: "1h",
    // algorithm: "RS256"
  };

  try {
    decoded = jwt.verify(token, "MYSECRET",VerifyOptions); // ? err if failed -> catch
  } catch (error) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': ObjectId(decoded._id),
    'tokens.token': token,
    'tokens.access': decoded.access
  })
}

var User = stack_exchangeConn.model('User', userSchema);

module.exports = {
  User
}