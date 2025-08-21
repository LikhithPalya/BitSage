const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/statsController.js');

router.get('/deviation', StatsController.calculateDeviation);
router.get('/history', StatsController.getHistory);

module.exports = router;