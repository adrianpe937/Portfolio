const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  section: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model('Portfolio', portfolioSchema, 'portfolios');

