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