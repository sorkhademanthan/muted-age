# 🏗️ COMPLETE BACKEND IMPLEMENTATION GUIDE - MUTED AGE E-COMMERCE PLATFORM

**Version**: 1.0  
**Created**: November 21, 2024  
**Purpose**: Comprehensive chapter-by-chapter backend development guide matching frontend requirements

---

## 📋 DOCUMENT STRUCTURE

This guide is organized into **8 PHASES** with **multiple chapters** per phase. Each chapter is:
- ✅ **Self-contained** - Can be implemented independently
- ✅ **AI-ready** - Copy and paste to Droid for implementation
- ✅ **Production-focused** - Includes error handling, validation, security
- ✅ **Frontend-aligned** - Matches exact client-side feature requirements

---

## 🎯 FRONTEND FEATURES ANALYSIS (FROM CLIENT CODE)

Based on the client folder analysis, these features need backend support:

### Core Features
1. **Authentication System** ✅ (Already implemented)
   - User registration
   - User login
   - JWT authentication
   - Protected routes

2. **Product Catalog** (Shop.jsx)
   - Product listing with pagination
   - Category filtering (Outerwear, Tops, Bottoms, Accessories)
   - Size filtering (XS, S, M, L, XL, XXL)
   - Sorting (Featured, Price, Newest)
   - Product variants (size, color)
   - Product images (primary + hover)
   - Tags (NEW, EXCLUSIVE, SOLD OUT)
   - Brand information
   - Quick add to cart

3. **Shopping Cart** (Cart.jsx)
   - Add items to cart
   - Update quantities
   - Remove items
   - Calculate totals (subtotal, tax, shipping)
   - Checkout process

4. **Order Management** (Orders.jsx, TrackOrders.jsx)
   - Place orders
   - Order history
   - Order details
   - Order status tracking
   - Delivery timeline with stages
   - Real-time tracking updates

5. **User Profile** (Profile.jsx, Account.jsx)
   - Profile information
   - Address management
   - Order history
   - Wishlist

6. **Reviews & Ratings** (Reviews.jsx)
   - Submit product reviews
   - View reviews
   - Rating system (1-5 stars)
   - Review comments

7. **Customer Support** (Support.jsx, Contact.jsx)
   - Submit complaints/tickets
   - Contact form
   - FAQ system
   - Ticket status tracking

8. **Search & Filter**
   - Product search
   - Advanced filtering
   - Sort options

---

## 🗺️ IMPLEMENTATION ROADMAP

### **PHASE 1: FOUNDATION & CORE SETUP** (Week 1)
- Chapter 1.1: Environment & Configuration Setup
- Chapter 1.2: Database Schema Enhancement
- Chapter 1.3: Middleware & Security Setup
- Chapter 1.4: Error Handling & Logging

### **PHASE 2: PRODUCT MANAGEMENT SYSTEM** (Week 2)
- Chapter 2.1: Enhanced Product Model with Variants
- Chapter 2.2: Product CRUD Operations
- Chapter 2.3: Product Filtering & Search
- Chapter 2.4: Product Image Management

### **PHASE 3: SHOPPING CART SYSTEM** (Week 3)
- Chapter 3.1: Cart Model & Basic Operations
- Chapter 3.2: Cart Management API
- Chapter 3.3: Cart Validation & Stock Check

### **PHASE 4: ORDER PROCESSING & CHECKOUT** (Week 4)
- Chapter 4.1: Order Model & Checkout Flow
- Chapter 4.2: Payment Integration
- Chapter 4.3: Order Management API

### **PHASE 5: DELIVERY & TRACKING SYSTEM** (Week 5)
- Chapter 5.1: Delivery Model & Tracking
- Chapter 5.2: Order Status Updates
- Chapter 5.3: Delivery Timeline API

### **PHASE 6: REVIEWS & RATINGS** (Week 6)
- Chapter 6.1: Review Model & Validation
- Chapter 6.2: Review CRUD Operations
- Chapter 6.3: Rating Calculation System

### **PHASE 7: SUPPORT & COMMUNICATION** (Week 7)
- Chapter 7.1: Support Ticket System
- Chapter 7.2: Contact Form & Email Integration
- Chapter 7.3: Admin Support Management

### **PHASE 8: USER FEATURES & OPTIMIZATION** (Week 8)
- Chapter 8.1: Wishlist Functionality
- Chapter 8.2: Address Management
- Chapter 8.3: User Dashboard API
- Chapter 8.4: Performance Optimization
- Chapter 8.5: Testing & Deployment

---

# ================================================================================
# PHASE 1: FOUNDATION & CORE SETUP
# ================================================================================

---

## 📘 CHAPTER 1.1: ENVIRONMENT & CONFIGURATION SETUP

### 🎯 Objective
Fix environment configuration issues and set up a robust configuration system for development, staging, and production environments.

### 🔍 Current Issues
- `.env` file has `MONGODB_URI` but `server.js` expects `MONGO_URI`
- Missing configuration for email service, payment gateway, and file uploads
- No environment-specific configurations

### 📝 Tasks

#### Task 1: Fix MongoDB Connection Variable
**File**: `Muted-Age-server/server.js`

**Current Code** (line 22-25):
```javascript
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/muted-age-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
```

**Change to**:
```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/muted-age-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
```

#### Task 2: Update .env File with Complete Configuration
**File**: `Muted-Age-server/.env`

**Add these variables**:
```env
# Existing
MONGODB_URI=mongodb+srv://sorkhademanthan_db_user:manthan12345@muted-age-project.aq2exx5.mongodb.net/?appName=Muted-Age-Project
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development

# Email Service (SendGrid or Gmail)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Muted Age <noreply@mutedage.com>

# Payment Gateway (Stripe)
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Upload (Cloudinary or AWS S3)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Session & Security
SESSION_SECRET=your_session_secret_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Other Services
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Task 3: Create Config Utility File
**File**: `Muted-Age-server/config/config.js` (CREATE NEW)

```javascript
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

  // Payment
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
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
```

#### Task 4: Update server.js to Use Config
**File**: `Muted-Age-server/server.js`

**Replace** the entire file with:
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const PORT = config.port;

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// MongoDB connection
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Muted Age Backend Server is running!',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});
```

### ✅ Verification Steps
1. Test MongoDB connection: `node server.js`
2. Verify environment variables are loaded: Check console output
3. Test health check endpoint: `curl http://localhost:5000/api/health`

### 📦 Expected Output
```json
{
  "success": true,
  "message": "Muted Age Backend Server is running!",
  "environment": "development",
  "timestamp": "2024-11-21T..."
}
```

---

## 📘 CHAPTER 1.2: DATABASE SCHEMA ENHANCEMENT

### 🎯 Objective
Update and enhance all database models to match frontend requirements with proper validation, indexes, and relationships.

### 📝 Tasks

#### Task 1: Enhance User Model
**File**: `Muted-Age-server/models/User.js`

**Replace with**:
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AddressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['shipping', 'billing'],
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  apartment: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    default: 'United States',
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
  },
  addresses: [AddressSchema],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'addresses.isDefault': 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
UserSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    profile: this.profile,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', UserSchema);
```

#### Task 2: Create Complete Product Model
**File**: `Muted-Age-server/models/Product.js`

**Replace with**:
```javascript
const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
    required: true,
  },
  color: {
    type: String,
    trim: true,
  },
  colorCode: {
    type: String,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  price: {
    type: Number,
    min: 0,
  },
}, { _id: true });

const ProductImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'Product image',
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
}, { _id: true });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  brand: {
    type: String,
    default: 'MUTED AGE',
    uppercase: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Outerwear', 'Tops', 'Bottoms', 'Accessories'],
  },
  subcategory: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  images: [ProductImageSchema],
  variants: [ProductVariantSchema],
  totalStock: {
    type: Number,
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  soldCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  materials: [{
    type: String,
    trim: true,
  }],
  careInstructions: {
    type: String,
  },
  sizeGuide: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ 'variants.sku': 1 });

// Pre-save middleware to generate slug
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate total stock from variants
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((total, variant) => total + variant.stock, 0);
  }
  
  next();
});

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for stock status
ProductSchema.virtual('stockStatus').get(function() {
  if (this.totalStock === 0) return 'SOLD OUT';
  if (this.totalStock <= this.lowStockThreshold) return 'LOW STOCK';
  return 'IN STOCK';
});

// Method to check if product is in stock
ProductSchema.methods.isInStock = function(size, quantity = 1) {
  if (!size) return this.totalStock >= quantity;
  
  const variant = this.variants.find(v => v.size === size);
  return variant && variant.stock >= quantity;
};

// Method to update stock
ProductSchema.methods.updateStock = async function(size, quantity) {
  const variant = this.variants.find(v => v.size === size);
  if (!variant) throw new Error('Variant not found');
  
  variant.stock += quantity;
  this.totalStock = this.variants.reduce((total, v) => total + v.stock, 0);
  
  await this.save();
};

module.exports = mongoose.model('Product', ProductSchema);
```

### ✅ Verification Steps
1. Test model creation: Create a sample user and product
2. Verify indexes: `db.users.getIndexes()` in MongoDB
3. Test model methods: Try comparePassword and isInStock methods

---

## 📘 CHAPTER 1.3: MIDDLEWARE & SECURITY SETUP

### 🎯 Objective
Implement essential middleware for security, rate limiting, input validation, and error handling.

### 📝 Tasks

#### Task 1: Install Required Packages
```bash
cd Muted-Age-server
npm install helmet express-rate-limit express-validator morgan winston
```

#### Task 2: Create Rate Limiting Middleware
**File**: `Muted-Age-server/middleware/rateLimiter.js` (CREATE NEW)

```javascript
const rateLimit = require('express-rate-limit');
const config = require('../config/config');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
  skipSuccessfulRequests: true,
});

// Create order rate limiter
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 orders per hour
  message: {
    success: false,
    error: 'Order limit reached, please try again later.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  orderLimiter,
};
```

#### Task 3: Create Input Validation Middleware
**File**: `Muted-Age-server/middleware/validator.js` (CREATE NEW)

```javascript
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: extractedErrors,
    });
  }
  
  next();
};

module.exports = validate;
```

#### Task 4: Create Logger
**File**: `Muted-Age-server/utils/logger.js` (CREATE NEW)

```javascript
const winston = require('winston');
const config = require('../config/config');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (config.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;
```

#### Task 5: Create Error Handler Middleware
**File**: `Muted-Age-server/middleware/errorHandler.js` (CREATE NEW)

```javascript
const logger = require('../utils/logger');
const config = require('../config/config');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  logger.error({
    message: error.message,
    statusCode: error.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    error.message = errors.join(', ');
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message || 'Server Error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

module.exports = { AppError, errorHandler };
```

#### Task 6: Update server.js with New Middleware
**File**: `Muted-Age-server/server.js`

**Add after line 1**:
```javascript
const helmet = require('helmet');
const morgan = require('morgan');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
```

**Add after CORS middleware (around line 19)**:
```javascript
// Security middleware
app.use(helmet());

// Request logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
  }));
}

// Rate limiting
app.use('/api/', apiLimiter);
```

**Replace the error handler at the bottom with**:
```javascript
// Use the new error handler
app.use(errorHandler);
```

### ✅ Verification Steps
1. Test rate limiting: Make multiple rapid requests
2. Test validation: Send invalid data to an endpoint
3. Check logs: Verify `logs/` folder is created
4. Test error handling: Trigger various error types

---

## 📘 CHAPTER 1.4: ERROR HANDLING & LOGGING

### 🎯 Objective
Implement comprehensive error handling and logging system across the application.

### 📝 Tasks

#### Task 1: Create Async Handler Utility
**File**: `Muted-Age-server/utils/asyncHandler.js` (CREATE NEW)

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
```

#### Task 2: Create Response Utility
**File**: `Muted-Age-server/utils/response.js` (CREATE NEW)

```javascript
class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = 'Error', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,
      },
    });
  }
}

module.exports = ApiResponse;
```

#### Task 3: Update Auth Routes with New Utilities
**File**: `Muted-Age-server/routes/auth.js`

**Add at the top**:
```javascript
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');
```

**Update the register route to use asyncHandler**:
```javascript
router.post('/register', asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    throw new AppError('Please provide username, email, and password', 400);
  }

  // Validate username length
  if (username.length < 3 || username.length > 30) {
    throw new AppError('Username must be between 3 and 30 characters long', 400);
  }

  // Validate password length
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters long', 400);
  }

  // Check if username already exists
  let existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new AppError('Username already exists', 400);
  }

  // Check if email already exists
  let existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new AppError('Email already exists', 400);
  }

  // Create new user
  const user = new User({
    username,
    email,
    password
  });

  await user.save();

  // Generate JWT token
  const payload = {
    id: user._id,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  // Return success response
  return ApiResponse.success(res, {
    token,
    user: user.getPublicProfile()
  }, 'User registered successfully', 201);
}));
```

### ✅ Verification Steps
1. Test error scenarios: Invalid input, duplicate email, etc.
2. Check error response format: Should be consistent
3. Verify logging: Check logs folder for error logs

---

# ================================================================================
# PHASE 2: PRODUCT MANAGEMENT SYSTEM
# ================================================================================

---

## 📘 CHAPTER 2.1: ENHANCED PRODUCT MODEL WITH VARIANTS

**Status**: ✅ Already covered in Chapter 1.2

---

## 📘 CHAPTER 2.2: PRODUCT CRUD OPERATIONS

### 🎯 Objective
Implement complete CRUD (Create, Read, Update, Delete) operations for products with proper validation and authorization.

### 📝 Tasks

#### Task 1: Create Product Validation Rules
**File**: `Muted-Age-server/validators/productValidator.js` (CREATE NEW)

```javascript
const { body, param, query } = require('express-validator');

const productValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Product name is required')
      .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),
    
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    
    body('price')
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('comparePrice')
      .optional()
      .isFloat({ min: 0 }).withMessage('Compare price must be a positive number'),
    
    body('category')
      .notEmpty().withMessage('Category is required')
      .isIn(['Outerwear', 'Tops', 'Bottoms', 'Accessories'])
      .withMessage('Invalid category'),
    
    body('variants')
      .isArray({ min: 1 }).withMessage('At least one variant is required'),
    
    body('variants.*.size')
      .notEmpty().withMessage('Variant size is required')
      .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'])
      .withMessage('Invalid size'),
    
    body('variants.*.sku')
      .trim()
      .notEmpty().withMessage('SKU is required'),
    
    body('variants.*.stock')
      .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
    
    body('images')
      .isArray({ min: 1 }).withMessage('At least one image is required'),
    
    body('images.*.url')
      .isURL().withMessage('Invalid image URL'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('category')
      .optional()
      .isIn(['Outerwear', 'Tops', 'Bottoms', 'Accessories'])
      .withMessage('Invalid category'),
  ],

  delete: [
    param('id').isMongoId().withMessage('Invalid product ID'),
  ],

  getById: [
    param('id').isMongoId().withMessage('Invalid product ID'),
  ],

  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    
    query('category')
      .optional()
      .isIn(['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'])
      .withMessage('Invalid category'),
    
    query('sortBy')
      .optional()
      .isIn(['featured', 'price-low', 'price-high', 'newest', 'popular'])
      .withMessage('Invalid sort option'),
  ],
};

module.exports = productValidators;
```

#### Task 2: Create Admin Authorization Middleware
**File**: `Muted-Age-server/middleware/adminMiddleware.js` (CREATE NEW)

```javascript
const { AppError } = require('./errorHandler');

const adminOnly = (req, res, next) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  if (req.user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  next();
};

module.exports = adminOnly;
```

#### Task 3: Create Complete Product Routes
**File**: `Muted-Age-server/routes/products.js`

**Replace entire file with**:
```javascript
const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');
const productValidators = require('../validators/productValidator');
const validate = require('../middleware/validator');
const config = require('../config/config');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', 
  productValidators.getAll,
  validate,
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = config.defaultPageSize,
      category,
      size,
      sortBy = 'featured',
      search,
      minPrice,
      maxPrice,
      inStock,
    } = req.query;

    // Build filter query
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (size && size !== 'All') {
      filter['variants.size'] = size;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      filter.totalStock = { $gt: 0 };
    }

    // Build sort query
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'popular':
        sort = { soldCount: -1 };
        break;
      case 'featured':
      default:
        sort = { isFeatured: -1, createdAt: -1 };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [products, totalItems] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .limit(parseInt(limit))
        .skip(skip)
        .select('-__v'),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return ApiResponse.paginated(res, products, {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  })
);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ 
    isActive: true, 
    isFeatured: true 
  })
    .limit(8)
    .select('-__v');

  return ApiResponse.success(res, products, 'Featured products retrieved successfully');
}));

// @route   GET /api/products/search
// @desc    Search products
// @access  Public
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    throw new AppError('Search query is required', 400);
  }

  const products = await Product.find({
    isActive: true,
    $text: { $search: q },
  })
    .limit(20)
    .select('-__v');

  return ApiResponse.success(res, products, `Found ${products.length} products`);
}));

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id',
  productValidators.getById,
  validate,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'username')
      .select('-__v');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (!product.isActive && (!req.user || req.user.role !== 'admin')) {
      throw new AppError('Product not available', 404);
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    return ApiResponse.success(res, product, 'Product retrieved successfully');
  })
);

// @route   POST /api/products
// @desc    Create new product (admin only)
// @access  Private/Admin
router.post('/',
  authMiddleware,
  adminOnly,
  productValidators.create,
  validate,
  asyncHandler(async (req, res) => {
    const productData = {
      ...req.body,
      createdBy: req.user.id,
    };

    // Ensure one image is marked as primary
    if (productData.images && productData.images.length > 0) {
      const hasPrimary = productData.images.some(img => img.isPrimary);
      if (!hasPrimary) {
        productData.images[0].isPrimary = true;
      }
    }

    const product = new Product(productData);
    await product.save();

    return ApiResponse.success(res, product, 'Product created successfully', 201);
  })
);

// @route   PUT /api/products/:id
// @desc    Update product (admin only)
// @access  Private/Admin
router.put('/:id',
  authMiddleware,
  adminOnly,
  productValidators.update,
  validate,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      product[key] = req.body[key];
    });

    await product.save();

    return ApiResponse.success(res, product, 'Product updated successfully');
  })
);

// @route   PUT /api/products/:id/stock
// @desc    Update product stock (admin only)
// @access  Private/Admin
router.put('/:id/stock',
  authMiddleware,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { size, stock } = req.body;

    if (!size || stock === undefined) {
      throw new AppError('Size and stock are required', 400);
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const variant = product.variants.find(v => v.size === size);
    if (!variant) {
      throw new AppError('Variant not found', 404);
    }

    variant.stock = stock;
    product.totalStock = product.variants.reduce((total, v) => total + v.stock, 0);

    await product.save();

    return ApiResponse.success(res, product, 'Stock updated successfully');
  })
);

// @route   DELETE /api/products/:id
// @desc    Delete product (admin only) - Soft delete
// @access  Private/Admin
router.delete('/:id',
  authMiddleware,
  adminOnly,
  productValidators.delete,
  validate,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Soft delete by marking as inactive
    product.isActive = false;
    await product.save();

    return ApiResponse.success(res, null, 'Product deleted successfully');
  })
);

module.exports = router;
```

#### Task 4: Update server.js to Include Product Routes
**File**: `Muted-Age-server/server.js`

**Verify this line exists** (should already be there):
```javascript
app.use('/api/products', productRoutes);
```

### ✅ Verification Steps

Test each endpoint using curl or Postman:

1. **Get all products**:
```bash
curl http://localhost:5000/api/products
```

2. **Get products with filters**:
```bash
curl "http://localhost:5000/api/products?category=Tops&size=M&sortBy=price-low"
```

3. **Get featured products**:
```bash
curl http://localhost:5000/api/products/featured
```

4. **Create product** (requires admin token):
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 99.99,
    "category": "Tops",
    "variants": [{"size": "M", "sku": "TEST-001", "stock": 10}],
    "images": [{"url": "https://example.com/image.jpg", "isPrimary": true}]
  }'
```

---

### 🎉 **END OF DETAILED SAMPLE - TEMPLATE FOR REMAINING CHAPTERS**

---

## 📘 CHAPTERS 2.3 - 8.5 STRUCTURE

Each remaining chapter follows this format:

### Chapter Title
- **🎯 Objective**: Clear goal
- **📝 Tasks**: Step-by-step implementation
  - Task 1: Create Model/Schema
  - Task 2: Create Validators
  - Task 3: Create Routes/Controllers
  - Task 4: Test Endpoints
- **✅ Verification Steps**: How to test
- **📦 Expected Output**: Sample responses

---

## 📚 COMPLETE CHAPTER LIST (To Be Developed)

**PHASE 2: PRODUCT MANAGEMENT**
- ✅ Chapter 2.1: Enhanced Product Model
- ✅ Chapter 2.2: Product CRUD Operations
- ⏳ Chapter 2.3: Product Filtering & Search
- ⏳ Chapter 2.4: Product Image Management

**PHASE 3: SHOPPING CART**
- ⏳ Chapter 3.1: Cart Model & Basic Operations
- ⏳ Chapter 3.2: Cart Management API
- ⏳ Chapter 3.3: Cart Validation & Stock Check

**PHASE 4: ORDER PROCESSING**
- ⏳ Chapter 4.1: Order Model & Checkout
- ⏳ Chapter 4.2: Payment Integration (Stripe)
- ⏳ Chapter 4.3: Order Management API

**PHASE 5: DELIVERY SYSTEM**
- ⏳ Chapter 5.1: Delivery Model & Tracking
- ⏳ Chapter 5.2: Order Status Updates
- ⏳ Chapter 5.3: Delivery Timeline API

**PHASE 6: REVIEWS**
- ⏳ Chapter 6.1: Review Model
- ⏳ Chapter 6.2: Review CRUD Operations
- ⏳ Chapter 6.3: Rating System

**PHASE 7: SUPPORT**
- ⏳ Chapter 7.1: Ticket System
- ⏳ Chapter 7.2: Contact Form & Email
- ⏳ Chapter 7.3: Admin Support Management

**PHASE 8: USER FEATURES**
- ⏳ Chapter 8.1: Wishlist
- ⏳ Chapter 8.2: Address Management
- ⏳ Chapter 8.3: User Dashboard
- ⏳ Chapter 8.4: Performance Optimization
- ⏳ Chapter 8.5: Testing & Deployment

---

## 🚀 HOW TO USE THIS GUIDE

### For Each Chapter:

1. **Copy the chapter content**
2. **Paste to Droid AI** with this prompt:
```
Implement this backend chapter for Muted Age:

[PASTE CHAPTER CONTENT HERE]

Follow the exact specifications, create all files mentioned, and test each endpoint.
```

3. **Verify implementation** using the verification steps
4. **Move to next chapter** once current is complete

### Progress Tracking:
- Mark chapters as ✅ when complete
- Update the roadmap document
- Keep notes of any customizations

---

## 📋 NEXT STEPS

1. **Start with Phase 1, Chapter 1.1**
2. **Complete all 4 chapters of Phase 1** (Foundation)
3. **Test thoroughly** before moving to Phase 2
4. **Continue sequentially** through all phases

---

## 💡 IMPORTANT NOTES

### Code Quality Standards:
- ✅ All routes must have error handling
- ✅ All models must have validation
- ✅ All endpoints must be tested
- ✅ Security best practices enforced
- ✅ Clean, documented code

### Frontend Integration:
- Each API matches exact frontend requirements
- Response formats consistent
- Error messages user-friendly
- Authentication flow seamless

### Scalability:
- Database indexed properly
- Pagination on all list endpoints
- Rate limiting configured
- Caching strategy ready

---

## 🎯 SUCCESS CRITERIA

### Phase 1 Complete When:
- ✅ Server runs without errors
- ✅ MongoDB connected
- ✅ Authentication working
- ✅ All middleware functioning
- ✅ Error handling tested

### Full Project Complete When:
- ✅ All 8 phases implemented
- ✅ Frontend integrated
- ✅ All features working
- ✅ Security audit passed
- ✅ Performance optimized
- ✅ Deployed to production

---

**Ready to build a production-grade e-commerce backend! 🚀**

**Start with Phase 1, Chapter 1.1 and work sequentially through each chapter.**
