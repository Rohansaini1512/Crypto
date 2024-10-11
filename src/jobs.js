const axios = require('axios');
const cron = require('node-cron');
const Cryptocurrency = require('./models');


const fetchCryptoData = async () => {
  const coins = ['bitcoin', 'matic-network', 'ethereum'];
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';

  for (const coin of coins) {
    try {
      const response = await axios.get(apiUrl, {
        params: {
          vs_currency: 'usd',
          ids: coin,
        },
      });

      const data = response.data[0];
      await Cryptocurrency.create({
        name: coin,
        price: data.current_price,
        marketCap: data.market_cap,
        change24h: data.price_change_percentage_24h,
      });

      console.log(`Data fetched and stored for ${coin}`);
    } catch (error) {
      console.error(`Error fetching data for ${coin}:`, error.message);
    }
  }
};

const startBackgroundJob = () => {
  cron.schedule('0 */2 * * *', async () => {
    try {
      await fetchCryptoData();
    } catch (error) {
      console.error('Error in background job:', error);
    }
  });
  console.log('Background job scheduled to run every 2 hours');
};

module.exports = { fetchCryptoData, startBackgroundJob };
