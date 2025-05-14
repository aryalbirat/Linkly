const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Route to create a short URL
router.post('/shorten', urlController.shortenUrl);

// Route to get all URLs
router.get('/all', urlController.getAllUrls);

module.exports = router;