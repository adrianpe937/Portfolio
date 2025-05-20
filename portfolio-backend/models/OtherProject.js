const mongoose = require('mongoose');
const { Schema } = mongoose;

const otherProjectSchema = new Schema({
  content: { type: Schema.Types.Mixed, required: true },
  imageUrl: { type: String, required: false }
});

module.exports = mongoose.model('OtherProject', otherProjectSchema, 'otherprojects');
