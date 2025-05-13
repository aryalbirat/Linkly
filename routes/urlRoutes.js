const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Route to create a short URL
router.post('/shorten', urlController.shortenUrl);

// Route to get all URLs
router.get('/all', urlController.getAllUrls);

// Route to redirect to original URL 
// This will be accessed via the root path
// and is handled in index.js
router.get('/:urlId', urlController.redirectToUrl);

module.exports = router;