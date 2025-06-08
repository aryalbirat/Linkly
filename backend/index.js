/**
 * Linkly Application
 * Main server file that sets up Express, MongoDB connection, and routes
 */
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
const urlController = require('./controllers/urlController');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS for all routes

// API Routes with /api prefix
app.use('/api', urlRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// URL redirect route
app.get('/:urlId', urlController.redirectToUrl);

// // Simple API info at root endpoint
// app.get('/', (req, res) => {
//   res.json({
//     message: "Linkly API Server",
//     version: "1.0",
//     endpoints: {
//       createShortUrl: "POST /api/shorten",
//       getAllUrls: "GET /api/all",
//       redirectToUrl: "GET /:urlId"
//     }
//   });
// });

// Simple API info
app.get('/api/info', (req, res) => {
  res.json({
    message: "Linkly API",
    endpoints: {
      createShortUrl: "POST /api/shorten",
      getAllUrls: "GET /api/all",
      redirectToUrl: "GET /:urlId"
    }
  });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/linkly";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Retry connection after 5 seconds
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 8000);
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
