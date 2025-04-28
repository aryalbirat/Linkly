require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
const urlController = require('./controllers/urlController');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes with /api prefix
app.use('/api', urlRoutes);

// URL redirect route (must be before the static files middleware)
app.get('/:urlId', urlController.redirectToUrl);

// Simple API info
app.get('/api/info', (req, res) => {
  res.json({
    message: "URL Shortener API",
    endpoints: {
      createShortUrl: "POST /api/shorten",
      getAllUrls: "GET /api/all",
      redirectToUrl: "GET /:urlId"
    }
  });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // For any route not handled by API or redirects, serve the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  // In development, serve the React files from the client build
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // For the root path in development, serve the React app
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/urlShortener";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
