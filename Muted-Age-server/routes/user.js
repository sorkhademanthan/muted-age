const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

// ============================================
// WISHLIST ROUTES (Chapter 8.2)
// ============================================

// 1. GET USER'S WISHLIST
// GET /api/user/wishlist
router.get('/wishlist', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  await user.getPopulatedWishlist();
  
  // Filter out inactive products
  const activeWishlist = user.wishlist.filter(product => product && product.isActive);
  
  sendSuccess(res, 'Wishlist retrieved successfully', {
    wishlist: activeWishlist,
    count: activeWishlist.length,
  });
}));

// 2. ADD PRODUCT TO WISHLIST
// POST /api/user/wishlist/:productId
router.post('/wishlist/:productId', authMiddleware, asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 'Product not found', 404);
  }
  
  if (!product.isActive) {
    return sendError(res, 'Product is not available', 400);
  }
  
  const user = await User.findById(req.user.id);
  
  try {
    await user.addToWishlist(productId);
    
    sendSuccess(res, 'Product added to wishlist', {
      wishlistCount: user.wishlist.length,
      message: `${product.name} added to your wishlist`,
    }, 201);
  } catch (error) {
    if (error.message === 'Product already in wishlist') {
      return sendError(res, 'Product already in wishlist', 400);
    }
    throw error;
  }
}));

// 3. REMOVE PRODUCT FROM WISHLIST
// DELETE /api/user/wishlist/:productId
router.delete('/wishlist/:productId', authMiddleware, asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const user = await User.findById(req.user.id);
  
  await user.removeFromWishlist(productId);
  
  sendSuccess(res, 'Product removed from wishlist', {
    wishlistCount: user.wishlist.length,
  });
}));

// 4. CHECK IF PRODUCT IS IN WISHLIST
// GET /api/user/wishlist/check/:productId
router.get('/wishlist/check/:productId', authMiddleware, asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const user = await User.findById(req.user.id);
  const isInWishlist = user.isInWishlist(productId);
  
  sendSuccess(res, 'Wishlist check completed', {
    isInWishlist,
    productId,
  });
}));

// 5. CLEAR WISHLIST
// DELETE /api/user/wishlist
router.delete('/wishlist', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  await user.clearWishlist();
  
  sendSuccess(res, 'Wishlist cleared successfully', {
    wishlistCount: 0,
  });
}));

// ============================================
// ADDRESS ROUTES (Chapter 8.3)
// ============================================

// 6. GET ALL USER ADDRESSES
// GET /api/user/addresses
router.get('/addresses', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  sendSuccess(res, 'Addresses retrieved successfully', {
    addresses: user.addresses,
    count: user.addresses.length,
    defaultAddress: user.getDefaultAddress(),
  });
}));

// 7. ADD NEW ADDRESS
// POST /api/user/addresses
router.post('/addresses', authMiddleware, asyncHandler(async (req, res) => {
  const addressData = req.body;
  
  // Validate required fields
  const requiredFields = ['type', 'firstName', 'lastName', 'street', 'city', 'state', 'zipCode', 'phone'];
  const missingFields = requiredFields.filter(field => !addressData[field]);
  
  if (missingFields.length > 0) {
    return sendError(res, `Missing required fields: ${missingFields.join(', ')}`, 400);
  }
  
  const user = await User.findById(req.user.id);
  
  await user.addAddress(addressData);
  
  const newAddress = user.addresses[user.addresses.length - 1];
  
  sendSuccess(res, 'Address added successfully', {
    address: newAddress,
    addressCount: user.addresses.length,
  }, 201);
}));

// 8. UPDATE ADDRESS
// PUT /api/user/addresses/:addressId
router.put('/addresses/:addressId', authMiddleware, asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const addressData = req.body;
  
  const user = await User.findById(req.user.id);
  
  try {
    await user.updateAddress(addressId, addressData);
    
    const updatedAddress = user.addresses.id(addressId);
    
    sendSuccess(res, 'Address updated successfully', {
      address: updatedAddress,
    });
  } catch (error) {
    if (error.message === 'Address not found') {
      return sendError(res, 'Address not found', 404);
    }
    throw error;
  }
}));

// 9. DELETE ADDRESS
// DELETE /api/user/addresses/:addressId
router.delete('/addresses/:addressId', authMiddleware, asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  
  const user = await User.findById(req.user.id);
  
  try {
    await user.removeAddress(addressId);
    
    sendSuccess(res, 'Address deleted successfully', {
      addressCount: user.addresses.length,
    });
  } catch (error) {
    if (error.message === 'Address not found') {
      return sendError(res, 'Address not found', 404);
    }
    throw error;
  }
}));

// 10. SET DEFAULT ADDRESS
// PATCH /api/user/addresses/:addressId/default
router.patch('/addresses/:addressId/default', authMiddleware, asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  
  const user = await User.findById(req.user.id);
  
  try {
    await user.setDefaultAddress(addressId);
    
    sendSuccess(res, 'Default address updated successfully', {
      defaultAddress: user.getDefaultAddress(),
    });
  } catch (error) {
    if (error.message === 'Address not found') {
      return sendError(res, 'Address not found', 404);
    }
    throw error;
  }
}));

// ============================================
// USER PROFILE & DASHBOARD (Chapter 8.4)
// ============================================

// 11. GET USER PROFILE
// GET /api/user/profile
router.get('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  
  sendSuccess(res, 'Profile retrieved successfully', {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      wishlistCount: user.wishlistCount,
      addressCount: user.addressCount,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    },
  });
}));

// 12. UPDATE USER PROFILE
// PUT /api/user/profile
router.put('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const { username, profile } = req.body;
  
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  
  // Update username if provided
  if (username && username !== user.username) {
    // Check if username is already taken
    const existingUser = await User.findOne({ username, _id: { $ne: req.user.id } });
    if (existingUser) {
      return sendError(res, 'Username already taken', 400);
    }
    user.username = username;
  }
  
  // Update profile fields
  if (profile) {
    if (profile.firstName) user.profile.firstName = profile.firstName;
    if (profile.lastName) user.profile.lastName = profile.lastName;
    if (profile.phone) user.profile.phone = profile.phone;
    if (profile.avatar) user.profile.avatar = profile.avatar;
  }
  
  await user.save();
  
  sendSuccess(res, 'Profile updated successfully', {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
    },
  });
}));

// 13. GET USER DASHBOARD STATS
// GET /api/user/dashboard
router.get('/dashboard', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // Get populated wishlist
  await user.getPopulatedWishlist();
  
  // Get order stats
  const orderStats = await Order.getUserOrderStats(req.user.id);
  
  // Get recent orders
  const recentOrders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('orderNumber total status createdAt')
    .lean();
  
  sendSuccess(res, 'Dashboard data retrieved successfully', {
    user: {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profile: user.profile,
      memberSince: user.createdAt,
    },
    stats: {
      totalOrders: orderStats.totalOrders,
      totalSpent: orderStats.totalSpent,
      pendingOrders: orderStats.pendingOrders,
      deliveredOrders: orderStats.deliveredOrders,
      wishlistItems: user.wishlistCount,
      savedAddresses: user.addressCount,
    },
    recentOrders,
    wishlistPreview: user.wishlist.slice(0, 4), // First 4 items
  });
}));

// 14. GET USER ACTIVITY SUMMARY
// GET /api/user/activity
router.get('/activity', authMiddleware, asyncHandler(async (req, res) => {
  const [orders, reviews] = await Promise.all([
    Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber total status createdAt')
      .lean(),
    require('../models/Review').find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('product', 'name slug images')
      .lean(),
  ]);
  
  sendSuccess(res, 'Activity retrieved successfully', {
    recentOrders: orders,
    recentReviews: reviews,
  });
}));

// 15. UPDATE PASSWORD
// PUT /api/user/password
router.put('/password', authMiddleware, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return sendError(res, 'Current password and new password are required', 400);
  }
  
  if (newPassword.length < 6) {
    return sendError(res, 'New password must be at least 6 characters', 400);
  }
  
  const user = await User.findById(req.user.id).select('+password');
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  
  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return sendError(res, 'Current password is incorrect', 401);
  }
  
  // Update password
  user.password = newPassword;
  await user.save();
  
  sendSuccess(res, 'Password updated successfully');
}));

module.exports = router;
