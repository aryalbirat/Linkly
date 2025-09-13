const Url = require("../models/url");
const nanoid = require("nanoid");

// Shorten a URL
exports.shortenUrl = async (req, res) => {
  try {
    //Check the url
    const { origUrl } = req.body;
    if (!origUrl || typeof origUrl !== "string") {
      return res.json({ error: "Original URL is required" });
    }

    // Check whether it is user or not
    if (!req.user || !req.user._id) {
      return res.json({ error: "Unauthorized" });
    }

    let url = await Url.findOne({ origUrl, user: req.user._id });
    if (url) return res.json(url);

    const urlId = nanoid.nanoid(6);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    url = new Url({
      urlId,
      origUrl,
      shortUrl: `${baseUrl}/${urlId}`,
      user: req.user._id,
      date: new Date(),
    });
    await url.save();
    return res.status(201).json(url);
  } catch (error) {
    console.error("Error shortening URL:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all URLs (admin)
exports.getAllUrls = async (req, res) => {
  try {
    //Easily associate garna milne bhayo email and password associated to each user.
    const urls = await Url.find().populate("user", "email");
    return res.json(urls);
  } catch (error) {
    console.error("Error getting all URLs:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get URLs for the logged-in user
exports.getUserUrls = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const urls = await Url.find({ user: req.user._id });
    return res.json(urls);
  } catch (error) {
    console.error("Error getting user URLs:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get user's clicks over time (dummy data based on creation date)
exports.getUserClicksOverTime = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const urls = await Url.find({ user: req.user._id });
    if (!urls.length) return res.json([]);

    // Last 7 days
    const today = new Date();
    const dateMap = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dateMap[dateStr] = 0;
    }

    urls.forEach((url) => {
      const urlDate = new Date(url.date).toISOString().split("T")[0];
      const clicksPerDay = Math.floor(url.clicks / 7) || 0;
      Object.keys(dateMap).forEach((date, id) => {
        const factor = 1 + id / 10;
        dateMap[date] += Math.floor(clicksPerDay * factor);
      });
    });

    const result = Object.keys(dateMap).map((date) => ({
      date,
      clicks: dateMap[date],
    }));

    return res.json(result);
  } catch (error) {
    console.error("Error getting clicks over time:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Redirect to the original URL
exports.redirectToUrl = async (req, res) => {
  try {
    const { urlId } = req.params;
    const url = await Url.findOne({ urlId });
    if (!url) return res.status(404).json({ error: "URL not found" });
    url.clicks += 1;
    await url.save();
    return res.redirect(url.origUrl);
  } catch (error) {
    console.error("Error redirecting to URL:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
