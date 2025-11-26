const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

// ============================================
// 1. SUBMIT REVIEW FOR A PRODUCT
// ============================================
// POST /api/products/:productId/reviews
router.post('/:productId/reviews', authMiddleware, asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;
  
  // Validate input
  if (!rating || !comment) {
    return sendError(res, 'Rating and comment are required', 400);
  }
  
  if (rating < 1 || rating > 5) {
    return sendError(res, 'Rating must be between 1 and 5', 400);
  }
  
  if (comment.length < 10) {
    return sendError(res, 'Review must be at least 10 characters', 400);
  }
  
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 'Product not found', 404);
  }
  
  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user.id,
  });
  
  if (existingReview) {
    return sendError(res, 'You have already reviewed this product. You can edit your existing review.', 400);
  }
  
  // Create review
  const review = new Review({
    product: productId,
    user: req.user.id,
    rating: parseInt(rating),
    title: title || '',
    comment,
  });
  
  await review.save();
  
  // Check if verified purchase
  await review.verifyPurchase();
  
  // Populate user info for response
  await review.populate('user', 'username profile.firstName profile.lastName');
  
  sendSuccess(res, 'Review submitted successfully', { 
    review,
    message: 'Thank you for your review!',
  }, 201);
}));

// ============================================
// 2. GET ALL REVIEWS FOR A PRODUCT
// ============================================
// GET /api/products/:productId/reviews?page=1&limit=10&rating=5&sortBy=-createdAt
router.get('/:productId/reviews', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10, rating, sortBy = '-createdAt', onlyVerified } = req.query;
  
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 'Product not found', 404);
  }
  
  // Get reviews
  const result = await Review.getProductReviews(productId, {
    page,
    limit,
    rating,
    sortBy,
    onlyVerified: onlyVerified === 'true',
  });
  
  // Get rating breakdown
  const breakdown = await Review.getRatingBreakdown(productId);
  
  sendSuccess(res, 'Reviews retrieved successfully', {
    reviews: result.reviews,
    pagination: result.pagination,
    ratingBreakdown: breakdown,
    productRating: {
      average: product.averageRating,
      count: product.reviewCount,
    },
  });
}));

// ============================================
// 3. GET RATING BREAKDOWN FOR A PRODUCT
// ============================================
// GET /api/products/:productId/reviews/stats
router.get('/:productId/reviews/stats', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 'Product not found', 404);
  }
  
  // Get rating breakdown
  const breakdown = await Review.getRatingBreakdown(productId);
  
  sendSuccess(res, 'Rating statistics retrieved successfully', {
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
    breakdown: breakdown.breakdown,
    percentages: breakdown.percentages,
  });
}));

// ============================================
// 4. GET USER'S REVIEW FOR A PRODUCT
// ============================================
// GET /api/products/:productId/reviews/my-review
router.get('/:productId/reviews/my-review', authMiddleware, asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const review = await Review.getUserProductReview(req.user.id, productId);
  
  if (!review) {
    return sendSuccess(res, 'No review found', { review: null });
  }
  
  sendSuccess(res, 'Review retrieved successfully', { review });
}));

// ============================================
// 5. UPDATE OWN REVIEW
// ============================================
// PUT /api/reviews/:id
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;
  
  const review = await Review.findById(id);
  
  if (!review) {
    return sendError(res, 'Review not found', 404);
  }
  
  // Check if user owns this review
  if (review.user.toString() !== req.user.id) {
    return sendError(res, 'You can only edit your own reviews', 403);
  }
  
  // Update fields
  if (rating !== undefined) {
    if (rating < 1 || rating > 5) {
      return sendError(res, 'Rating must be between 1 and 5', 400);
    }
    review.rating = parseInt(rating);
  }
  
  if (title !== undefined) {
    review.title = title;
  }
  
  if (comment !== undefined) {
    if (comment.length < 10) {
      return sendError(res, 'Review must be at least 10 characters', 400);
    }
    review.comment = comment;
  }
  
  await review.save();
  
  await review.populate('user', 'username profile.firstName profile.lastName');
  
  sendSuccess(res, 'Review updated successfully', { review });
}));

// ============================================
// 6. DELETE OWN REVIEW
// ============================================
// DELETE /api/reviews/:id
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const review = await Review.findById(id);
  
  if (!review) {
    return sendError(res, 'Review not found', 404);
  }
  
  // Check if user owns this review or is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return sendError(res, 'You can only delete your own reviews', 403);
  }
  
  const productId = review.product;
  
  await Review.findByIdAndDelete(id);
  
  sendSuccess(res, 'Review deleted successfully', {
    message: 'Your review has been removed',
  });
}));

// ============================================
// 7. GET USER'S ALL REVIEWS (User Dashboard)
// ============================================
// GET /api/reviews/my-reviews?page=1&limit=10
router.get('/my-reviews', authMiddleware, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [reviews, total] = await Promise.all([
    Review.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('product', 'name slug images price')
      .lean(),
    Review.countDocuments({ user: req.user.id }),
  ]);
  
  sendSuccess(res, 'Your reviews retrieved successfully', {
    reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
}));

// ============================================
// ADMIN ROUTES
// ============================================

// 8. GET ALL REVIEWS (ADMIN)
// GET /api/reviews/admin/all?page=1&limit=20&flagged=true
router.get('/admin/all', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, flagged, approved } = req.query;
  
  const query = {};
  
  if (flagged !== undefined) {
    query.isFlagged = flagged === 'true';
  }
  
  if (approved !== undefined) {
    query.isApproved = approved === 'true';
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [reviews, total] = await Promise.all([
    Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username email')
      .populate('product', 'name slug')
      .lean(),
    Review.countDocuments(query),
  ]);
  
  sendSuccess(res, 'All reviews retrieved successfully', {
    reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
}));

// 9. RESPOND TO REVIEW (ADMIN)
// POST /api/reviews/:id/response
router.post('/:id/response', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { responseText } = req.body;
  
  if (!responseText || responseText.trim().length === 0) {
    return sendError(res, 'Response text is required', 400);
  }
  
  const review = await Review.findById(id);
  
  if (!review) {
    return sendError(res, 'Review not found', 404);
  }
  
  await review.addResponse(responseText, req.user.id);
  
  await review.populate([
    { path: 'user', select: 'username' },
    { path: 'response.respondedBy', select: 'username' }
  ]);
  
  sendSuccess(res, 'Response added successfully', { review });
}));

// 10. FLAG/UNFLAG REVIEW (ADMIN)
// PATCH /api/reviews/:id/flag
router.patch('/:id/flag', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { flagged } = req.body;
  
  const review = await Review.findById(id);
  
  if (!review) {
    return sendError(res, 'Review not found', 404);
  }
  
  review.isFlagged = flagged === true;
  await review.save();
  
  sendSuccess(res, `Review ${flagged ? 'flagged' : 'unflagged'} successfully`, { review });
}));

// 11. APPROVE/REJECT REVIEW (ADMIN)
// PATCH /api/reviews/:id/approve
router.patch('/:id/approve', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;
  
  const review = await Review.findById(id);
  
  if (!review) {
    return sendError(res, 'Review not found', 404);
  }
  
  review.isApproved = approved === true;
  await review.save();
  
  sendSuccess(res, `Review ${approved ? 'approved' : 'rejected'} successfully`, { review });
}));

module.exports = router;
