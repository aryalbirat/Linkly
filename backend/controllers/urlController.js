/**
 * URL Controllers
 * Handles all URL shortening, retrieval, and redirection logic
 */
const Url = require('../models/url');

// Function to get nanoid dynamically (handles ESM import in CommonJS)
let nanoidGenerate;
(async () => {
  const { nanoid } = await import('nanoid');
  nanoidGenerate = nanoid;
})();

/**
 * Create a short URL
 * @route POST /api/shorten
 * @param {string} req.body.origUrl - The original URL to shorten
 * @returns {object} The created URL object
 */
exports.shortenUrl = async (req, res) => {
  try {
    const { origUrl } = req.body;
    if (!origUrl) return res.status(400).json({ error: 'Original URL is required' });
    // Always associate with logged-in user
    let url = await Url.findOne({ origUrl, user: req.user._id });
    if (url) return res.json(url);
    const urlId = nanoidGenerate ? nanoidGenerate(6) : Date.now().toString(36);
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
 * Get all URLs
 * @route GET /api/all
 * @returns {Array} Array of all URL objects
 */
exports.getAllUrls = async (req, res) => {
  // Only admin can access (enforced by route)
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
    const urls = await Url.find({ user: req.user._id });
    return res.json(urls);
  } catch (error) {
    console.error('Error getting user URLs:', error);
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
