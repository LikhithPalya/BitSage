const CryptoStat = require('../models/CryptoStatModels.js');
const { fetchCryptoStats } = require('../utils/CoinGecko.js');

const storeCryptoStats = async () => {
  try {
    // Fetch data from CoinGecko
    const stats = await fetchCryptoStats();
    
    // Save to MongoDB
    const result = await CryptoStat.insertMany(stats);
    
    return {
      success: true,
      message: 'Successfully stored crypto stats',
      count: result.length
    };
    
  } catch (error) {
    console.error('Error storing crypto stats:', error);
    return {
      success: false,
      message: 'Failed to store crypto stats'
    };
  }
};

module.exports = { storeCryptoStats };