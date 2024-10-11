require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { fetchCryptoData, startBackgroundJob } = require('./jobs');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Server starting...');


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());


app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});


console.log('Adding routes...');
app.use('/api', routes);

fetchCryptoData()
  .then(() => console.log('Initial data fetch complete'))
  .catch(err => console.error('Error fetching data:', err));


app.get('/test', (req, res) => {
  res.send('Test route working');
});

startBackgroundJob();


app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 
