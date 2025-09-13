
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.post('/shorten', auth, urlController.shortenUrl);


router.get('/all', auth, admin, urlController.getAllUrls);


router.get('/my', auth, urlController.getUserUrls);


router.get('/clicks-over-time', auth, urlController.getUserClicksOverTime);

module.exports = router;