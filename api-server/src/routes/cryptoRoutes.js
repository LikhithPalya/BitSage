const express = require('express');
const { storeCryptoStats } = require('../controllers/cryptoController.js');
const CryptoStat = require('../models/CryptoStatModels.js');
const router = express.Router();

// POST /api/store-stats - Store crypto stats (from task)
router.post('/store-stats', async (req, res, next) => {
    try {
        const result = await storeCryptoStats();
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

// Get latest stats for a specific coin
router.get('/stats', async (req, res) => {
  try {
    const { coin } = req.query;
    
    // Validate coin parameter
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coin parameter. Must be one of: bitcoin, ethereum, matic-network'
      });
    }

    // Find the most recent entry for this coin as many entries are being made
    const latestStat = await CryptoStat.findOne({ coinId: coin })
      .sort({ timestamp: -1 })
      .lean();

    if (!latestStat) {
      return res.status(404).json({
        success: false,
        message: 'No data available for this coin'
      });
    }

    const response = {
      coin : coin,
      price: latestStat.price,
      marketCap: latestStat.marketCap,
      "24hChange": latestStat.priceChange24h
    };

    res.json({
      success: true,
      data: response
    });
    
  } catch (error) {
    console.error('Error fetching coin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


// DELETE /api/stats - Clear all stats (optional)
router.delete('/delete-stats', async (req, res, next) => {
    try {
        const result = await CryptoStat.deleteMany({});
        res.json({ 
            success: true, 
            message: `Deleted ${result.deletedCount} records` 
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;