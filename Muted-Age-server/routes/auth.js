const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');
const config = require('../config/config');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
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

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });

  // Return success response
  return ApiResponse.success(res, {
    token,
    user: user.getPublicProfile()
  }, 'User registered successfully', 201);
}));

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Find user by email (include password field)
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  // Generate JWT token
  const payload = {
    id: user._id,
    role: user.role
  };

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiration
  });

  // Return success response
  return ApiResponse.success(res, {
    token,
    user: user.getPublicProfile()
  }, 'Login successful');
}));

// @route   GET /api/auth/me
// @desc    Get current authenticated user
// @access  Private
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  // Find user by ID from middleware (exclude password)
  const user = await User.findById(req.user.id)
    .populate('wishlist', 'name price images');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Return user data
  return ApiResponse.success(res, {
    user: {
      ...user.getPublicProfile(),
      addresses: user.addresses,
      wishlist: user.wishlist
    }
  }, 'User profile retrieved successfully');
}));

module.exports = router;
