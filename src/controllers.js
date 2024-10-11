const Cryptocurrency = require('./models');

console.log('Controllers file loaded');

exports.getStats = async (req, res, next) => {
    console.log('getStats controller called');
    try {
      const { coin } = req.query;
      console.log(`Fetching stats for coin: ${coin}`);
      
      const allData = await Cryptocurrency.find({ name: coin });
      console.log(`Found ${allData.length} records for ${coin}`);
      
      const latestData = await Cryptocurrency.findOne({ name: coin }).sort({ timestamp: -1 });
      console.log('Latest data:', latestData);
  
      if (!latestData) {
        console.log('No data found for coin');
        return res.status(404).json({ error: 'Cryptocurrency data not found' });
      }
  
      console.log('Sending stats response');
      res.json({
        price: latestData.price,
        marketCap: latestData.marketCap,
        "24hChange": latestData.change24h
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      next(error);
    }
  };
exports.getDeviation = async (req, res, next) => {
    console.log('getDeviation controller called');
    try {
      const { coin } = req.query;
      console.log(`Calculating deviation for coin: ${coin}`);
  
      const records = await Cryptocurrency.find({ name: coin })
        .sort({ timestamp: -1 })
        .limit(100);
  
      if (records.length === 0) {
        return res.status(404).json({ error: 'No data found for the specified coin' });
      }
  
  
      const prices = records.map(record => record.price);
      const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
      const squaredDifferences = prices.map(price => Math.pow(price - mean, 2));
  
     
      const variance = squaredDifferences.reduce((sum, sqDiff) => sum + sqDiff, 0) / prices.length;
  
  
      const deviation = Math.sqrt(variance);
  
      console.log('Sending deviation response');
      res.json({ deviation: parseFloat(deviation.toFixed(2)) });
    } catch (error) {
      console.error('Error in getDeviation:', error);
      next(error);
    }
  };