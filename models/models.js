const mongoose = require('mongoose');

function createObjectId() {
    let id = new mongoose.Types.ObjectId();
    return id;
}

module.exports = {
    createObjectId,
}