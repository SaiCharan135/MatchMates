const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

const createRoomLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Max 20 room creations per minute per IP
  message: {
    success: false,
    error: 'Creating rooms too quickly. Please wait a moment.'
  }
});

module.exports = {
  apiLimiter,
  createRoomLimiter
};
