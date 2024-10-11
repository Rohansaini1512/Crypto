require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { fetchCryptoData, startBackgroundJob } = require('./jobs');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Server starting...');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Routes
console.log('Adding routes...');
app.use('/api', routes);

// Manually trigger the data fetching
fetchCryptoData()
  .then(() => console.log('Initial data fetch complete'))
  .catch(err => console.error('Error fetching data:', err));

// Test route
app.get('/test', (req, res) => {
  res.send('Test route working');
});

// Start background job to fetch data every 2 hours
startBackgroundJob();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export for testing purposes
