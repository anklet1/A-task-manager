const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Smart Task Manager API is running!' });
});

// Test protected route
const auth = require('./middleware/auth');
app.get('/api/protected', auth, (req, res) => {
  return res.json({ userId: req.user._id });
});

// Only connect and listen when not under test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
}

module.exports = app;
