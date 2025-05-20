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
    const originalUrl = origUrl;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Check if URL already exists
    let url = await Url.findOne({ origUrl: originalUrl });
    
    if (url) {
      return res.json(url);
    }
    
    // Generate short URL ID
    const urlId = nanoidGenerate ? nanoidGenerate(6) : Date.now().toString(36);
    
    // Get base URL without the /api prefix
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Create new URL
    url = new Url({
      urlId,
      origUrl: originalUrl,
      shortUrl: `${baseUrl}/${urlId}`,
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
  try {
    const urls = await Url.find();
    return res.json(urls);
  } catch (error) {
    console.error('Error getting all URLs:', error);    return res.status(500).json({ error: 'Server error' });
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
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    // Increment click count
    url.clicks += 1;
    await url.save();
    
    return res.redirect(url.origUrl);
  } catch (error) {
    console.error('Error redirecting to URL:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
