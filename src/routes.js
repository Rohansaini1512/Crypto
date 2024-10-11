const express = require('express');
const router = express.Router();
const { getStats, getDeviation } = require('./controllers');

console.log('Routes file loaded');

// Middleware to check for valid coin parameter
const validateCoin = (req, res, next) => {
  console.log('validateCoin middleware called');
  const validCoins = ['bitcoin', 'matic-network', 'ethereum'];
  if (!validCoins.includes(req.query.coin)) {
    return res.status(400).json({ error: 'Invalid coin parameter' });
  }
  next();
};

router.get('/stats', (req, res, next) => {
  console.log('Stats route accessed');
  validateCoin(req, res, next);
}, getStats);

router.get('/deviation', (req, res, next) => {
  console.log('Deviation route accessed');
  validateCoin(req, res, next);
}, getDeviation);

module.exports = router;