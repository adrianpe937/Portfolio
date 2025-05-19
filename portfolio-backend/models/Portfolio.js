const mongoose = require('mongoose');
const { Schema } = mongoose;

const portfolioSchema = new Schema({
  section: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: false },
  imageUrl: { type: String, required: false }, // Cambiado a imageUrl
});

module.exports = mongoose.model('Portfolio', portfolioSchema, 'portfolios');
