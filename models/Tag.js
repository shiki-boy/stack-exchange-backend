const mongoose = require('mongoose');

const {
    stack_exchangeConn
} = require('../db/mongoose.js');

var ObjectId = mongoose.Schema.Types.ObjectId;

var tagSchema = new mongoose.Schema({
    tag: String,
    _qid: [{
        type: ObjectId,
        ref:'Question'
    }],
    countQ: {
        type: Number,
        default: 0
    }
})

var Tag = stack_exchangeConn.model('Tag', tagSchema);

module.exports = {Tag}