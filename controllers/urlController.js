// Import other dependencies with require as usual
const Url = require('../models/url');

// Function to get nanoid dynamically
let nanoidGenerate;
(async () => {
  const { nanoid } = await import('nanoid');
  nanoidGenerate = nanoid;
})();

// Create a short URL
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

// Get all URLs
exports.getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find();
    return res.json(urls);
  } catch (error) {
    console.error('Error getting all URLs:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Redirect to original URL
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