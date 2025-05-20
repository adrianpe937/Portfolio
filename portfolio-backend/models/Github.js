const mongoose = require('mongoose');
const { Schema } = mongoose;

const githubSchema = new Schema({
  repo: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Github', githubSchema, 'github');
