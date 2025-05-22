/**
 * URL Routes
 * Defines the API endpoints for URL shortening and retrieval
 */
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Route to create a short URL (auth required)
router.post('/shorten', auth, urlController.shortenUrl);

// Route to get all URLs (admin only)
router.get('/all', auth, admin, urlController.getAllUrls);

// Route to get all URLs for the current user
router.get('/my', auth, urlController.getUserUrls);

module.exports = router;