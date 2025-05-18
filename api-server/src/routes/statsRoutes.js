const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/statsController.js');

router.get('/deviation', StatsController.calculateDeviation);


module.exports = router;