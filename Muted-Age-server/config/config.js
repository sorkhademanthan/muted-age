require('dotenv').config();

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/muted-age-db',

  // Authentication
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_in_production',
  jwtExpiration: '24h',
  jwtRefreshExpiration: '7d',

  // Email
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'Muted Age <noreply@mutedage.com>',
  },

  // Payment (Razorpay)
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },

  // File Upload
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // Security
  sessionSecret: process.env.SESSION_SECRET || 'default_session_secret',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Pagination
  defaultPageSize: 12,
  maxPageSize: 100,

  // Cart
  cartExpirationDays: 7,

  // Orders
  orderNumberPrefix: 'MA',
  taxRate: 0.08, // 8% tax
  freeShippingThreshold: 500, // Free shipping above $500

  // Reviews
  minReviewLength: 10,
  maxReviewLength: 1000,
};

// Validate required configs
const requiredConfigs = [
  'mongoUri',
  'jwtSecret',
];

requiredConfigs.forEach((key) => {
  if (!config[key] && !config[key.split('.').reduce((o, k) => o?.[k], config)]) {
    console.error(`❌ Missing required config: ${key}`);
    process.exit(1);
  }
});

module.exports = config;
