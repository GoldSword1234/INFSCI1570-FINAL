const User = require('../models/User');

const requireApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ success: false, error: 'API key required' });
    }
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { requireApiKey };