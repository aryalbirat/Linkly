const express = require('express');
const router = express.Router();
const Url = require('../models/url');
const User = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/admin/analytics
router.get('/analytics', auth, admin, async (req, res) => {
  try {
    const urls = await Url.find().populate('user', 'email role');
    const users = await User.find({}, 'email role');
    const totalClicks = await Url.aggregate([{ $group: { _id: null, clicks: { $sum: "$clicks" } } }]);
    res.json({
      urlCount: urls.length,
      userCount: users.length,
      totalClicks: totalClicks[0]?.clicks || 0,
      urls,
      users
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/clicks-over-time
router.get('/clicks-over-time', auth, admin, async (req, res) => {
  try {
    const data = await Url.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          clicks: { $sum: "$clicks" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
