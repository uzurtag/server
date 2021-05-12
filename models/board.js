const mongoose = require('mongoose');
const { Schema } = mongoose;

const boardSchema = new Schema({
    key: String,
    value: String,
});

module.exports = mongoose.model('Board', boardSchema, 'status');