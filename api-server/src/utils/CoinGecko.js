const axios = require('axios');
require('dotenv').config();

const fetchCryptoStats = async () => {
  try {
    const response = await axios.get(`${process.env.COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin,ethereum,matic-network',
        price_change_percentage: '24h'
      },
      headers: {
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
      }
    });
    
    return response.data.map(coin => ({
      coinId: coin.id,
      price: coin.current_price,
      marketCap: coin.market_cap,
      priceChange24h: coin.price_change_percentage_24h
    }));
    
  } catch (error) {
    console.error('CoinGecko API Error:', error.message);
    throw error;
  }
};

module.exports = { fetchCryptoStats };