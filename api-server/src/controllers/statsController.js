const { standardDeviation } = require('simple-statistics');
const CryptoStat = require('../models/CryptoStatModels.js');

exports.calculateDeviation = async (req, res) => {
  try {
    const { coin } = req.query;
    
    
    // Validate input
    if (!['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin' });
    }

    // Get last 100 records
    const records = await CryptoStat.find({ coinId: coin })
      .sort({ timestamp: -1 })
      .limit(100)
      .select('price -_id');

    // Need at least 2 data points
    if (records.length < 2) {
      return res.status(400).json({
        error: 'Insufficient data points for calculation'
      });
    }

    // Extract prices and calculate
    const prices = records.map(r => r.price);
    const dev = standardDeviation(prices);

    res.json({
      coin,
      deviation: Number(dev.toFixed(2)),
      dataPoints: prices.length
    });

  } catch (error) {
    console.error('Deviation calculation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { coin, limit = 50 } = req.query;

    if (!coin) {
      return res.status(400).json({ error: 'Coin is required' });
    }

    const allowedCoins = ['bitcoin', 'ethereum', 'matic-network'];
    if (!allowedCoins.includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin' });
    }

    const records = await CryptoStat.find({ coinId: coin })
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .lean();

    res.json(records.reverse()); // oldest → newest
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};