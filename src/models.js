const mongoose = require('mongoose');

const cryptocurrencySchema = new mongoose.Schema({
  name: String,
  price: Number,
  marketCap: Number,
  change24h: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cryptocurrency', cryptocurrencySchema);