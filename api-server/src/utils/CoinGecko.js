const axios = require('axios');
require('dotenv').config();

const fetchCryptoStats = async () => {
  try {
    const response = await axios.get(`${process.env.COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin, ethereum, matic-network',
        price_change_percentage: '24h'
      },
      headers: {
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY
      }
    });

    /*
    SAMPLE RESPONSE - from this url - {https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,matic-network&price_change_percentage=24h}
    {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    "current_price": 116576,
    "market_cap": 2320272491951,
    "market_cap_rank": 1,
    "fully_diluted_valuation": 2320273657712,
    "total_volume": 39380796350,
    "high_24h": 117596,
    "low_24h": 114550,
    "price_change_24h": 2025.94,
    "price_change_percentage_24h": 1.76861,
    "market_cap_change_24h": 40686558597,
    "market_cap_change_percentage_24h": 1.78482,
    "circulating_supply": 19903496,
    "total_supply": 19903506,
    "max_supply": 21000000,
    "ath": 122838,
    "ath_change_percentage": -5.08224,
    "ath_date": "2025-07-14T07:56:01.937Z",
    "atl": 67.81,
    "atl_change_percentage": 171846.29957,
    "atl_date": "2013-07-06T00:00:00.000Z",
    "roi": null,
    "last_updated": "2025-08-08T05:54:26.279Z",
    "price_change_percentage_24h_in_currency": 1.76861048553207
  },
    */

    
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