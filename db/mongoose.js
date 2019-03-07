const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var stack_exchangeConn = mongoose.createConnection('mongodb://localhost:27017/stack_exchangeDB', {
  useCreateIndex: true,
  useNewUrlParser: true
}); // will itself create a database if is not there

module.exports = {
  stack_exchangeConn
  // mongoose
};