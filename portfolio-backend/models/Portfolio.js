const mongoose = require('mongoose');
const { Schema } = mongoose;

const portfolioSchema = new Schema({
  section: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: false }, // <- acepta cualquier cosa
});

module.exports = mongoose.model('Portfolio', portfolioSchema, 'portfolios');
