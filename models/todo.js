const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = new Schema({
    title: String,
    description: String,
    status: String,
    date: String,
});

module.exports = mongoose.model('Todo', todoSchema, 'todo');