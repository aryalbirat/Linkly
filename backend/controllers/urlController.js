/**
 * URL Controllers
 * Handles all URL shortening, retrieval, and redirection logic
 */
const Url = require('../models/url');

// Utility to get nanoid (sync for clarity)
const getNanoid = () => {
  try {
    // Use require for CommonJS compatibility
    return require('nanoid').nanoid;
  } catch {
    return () => Date.now().toString(36);
  }
};

/**
 * Create a short URL
 * @route POST /api/shorten
 * @param {string} req.body.origUrl - The original URL to shorten
 * @returns {object} The created URL object
 */
exports.shortenUrl = async (req, res) => {
  try {
    const { origUrl } = req.body;
    if (!origUrl || typeof origUrl !== 'string') {
      return res.status(400).json({ error: 'Original URL is required' });
    }
    // Optionally: sanitize origUrl here
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    let url = await Url.findOne({ origUrl, user: req.user._id });
    if (url) return res.json(url);
    const nanoid = getNanoid();
    const urlId = nanoid(6);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    url = new Url({
      urlId,
      origUrl,
      shortUrl: `${baseUrl}/${urlId}`,
      user: req.user._id,
      date: new Date()
    });
    await url.save();
    return res.status(201).json(url);
  } catch (error) {
    console.error('Error shortening URL:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all URLs (admin only)
 * @route GET /api/all
 * @returns {Array} Array of all URL objects
 */
exports.getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find().populate('user', 'email');
    return res.json(urls);
  } catch (error) {
    console.error('Error getting all URLs:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get all URLs for the current user
 * @route GET /api/user-urls
 * @returns {Array} Array of URL objects for the current user
 */
exports.getUserUrls = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const urls = await Url.find({ user: req.user._id });
    return res.json(urls);
  } catch (error) {
    console.error('Error getting user URLs:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get clicks over time data for the current user
 * @route GET /api/clicks-over-time
 * @returns {Array} Array of data points with date and click count
 */
exports.getUserClicksOverTime = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get all URLs for the user
    const urls = await Url.find({ user: req.user._id });
    
    // If no URLs, return empty array
    if (!urls || urls.length === 0) {
      return res.json([]);
    }

    // Create a map of dates to click counts
    // For a real implementation, this would use actual click timestamps
    // This is a simplified version that just creates dummy data based on URL creation dates
    const dateMap = {};
    
    // Get date range (last 7 days)
    const today = new Date();
    const dates = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      dates.push(dateStr);
      dateMap[dateStr] = 0;
    }
    
    // Distribute clicks across dates (simplified simulation)
    urls.forEach(url => {
      const urlDate = new Date(url.date).toISOString().split('T')[0];
      const clicksPerDay = Math.floor(url.clicks / 7) || 0;
      
      dates.forEach((date, index) => {
        // Add more clicks to recent days
        const factor = 1 + (index / 10);
        const clicks = Math.floor(clicksPerDay * factor);
        dateMap[date] = (dateMap[date] || 0) + clicks;
      });
    });
    
    // Convert map to array of objects
    const result = Object.keys(dateMap).map(date => ({
      date,
      clicks: dateMap[date]
    }));
    
    return res.json(result);
  } catch (error) {
    console.error('Error getting clicks over time:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Redirect to the original URL
 * @route GET /:urlId
 * @param {string} req.params.urlId - The short URL ID
 * @returns {redirect} Redirects to the original URL
 */
exports.redirectToUrl = async (req, res) => {
  try {
    const { urlId } = req.params;
    const url = await Url.findOne({ urlId });
    if (!url) return res.status(404).json({ error: 'URL not found' });
    url.clicks += 1;
    await url.save();
    return res.redirect(url.origUrl);
  } catch (error) {
    console.error('Error redirecting to URL:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
