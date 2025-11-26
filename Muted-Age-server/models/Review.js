const mongoose = require('mongoose');

// ============================================
// REVIEW SCHEMA
// ============================================

const ReviewSchema = new mongoose.Schema({
  // References
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required'],
    index: true,
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true,
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  
  // Review Content
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Review title cannot exceed 100 characters'],
  },
  
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters'],
  },
  
  // Verification
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
  },
  
  // Helpful Votes (for future use)
  helpfulVotes: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Admin Moderation
  isApproved: {
    type: Boolean,
    default: true, // Auto-approve for now
  },
  
  isFlagged: {
    type: Boolean,
    default: false,
  },
  
  // Response from admin/seller (optional)
  response: {
    text: {
      type: String,
      trim: true,
      maxlength: [500, 'Response cannot exceed 500 characters'],
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    respondedAt: {
      type: Date,
    },
  },
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ============================================
// INDEXES
// ============================================

// Compound index for product reviews (most common query)
ReviewSchema.index({ product: 1, createdAt: -1 });

// Find user's reviews
ReviewSchema.index({ user: 1, createdAt: -1 });

// Prevent duplicate reviews (one review per user per product)
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Filter by rating
ReviewSchema.index({ rating: 1 });

// Filter approved reviews
ReviewSchema.index({ isApproved: 1 });

// ============================================
// VIRTUAL PROPERTIES
// ============================================

// Time since review
ReviewSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
});

// Star display (for frontend)
ReviewSchema.virtual('starDisplay').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Check if user has purchased this product
 * @returns {Promise<Boolean>}
 */
ReviewSchema.methods.verifyPurchase = async function() {
  const Order = mongoose.model('Order');
  
  const order = await Order.findOne({
    user: this.user,
    'items.product': this.product,
    paymentStatus: 'paid',
  });
  
  this.isVerifiedPurchase = !!order;
  await this.save();
  
  return this.isVerifiedPurchase;
};

/**
 * Add admin response to review
 * @param {String} responseText - Response text
 * @param {ObjectId} adminId - Admin user ID
 * @returns {Promise<Review>}
 */
ReviewSchema.methods.addResponse = async function(responseText, adminId) {
  this.response = {
    text: responseText,
    respondedBy: adminId,
    respondedAt: new Date(),
  };
  
  await this.save();
  return this;
};

/**
 * Flag review as inappropriate
 * @returns {Promise<Review>}
 */
ReviewSchema.methods.flag = async function() {
  this.isFlagged = true;
  await this.save();
  return this;
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Get all reviews for a product with pagination
 * @param {ObjectId} productId - Product ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
ReviewSchema.statics.getProductReviews = async function(productId, options = {}) {
  const {
    page = 1,
    limit = 10,
    rating,
    sortBy = '-createdAt',
    onlyVerified = false,
  } = options;
  
  const query = { 
    product: productId,
    isApproved: true,
  };
  
  if (rating) {
    query.rating = parseInt(rating);
  }
  
  if (onlyVerified) {
    query.isVerifiedPurchase = true;
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [reviews, total] = await Promise.all([
    this.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username profile.firstName profile.lastName')
      .lean(),
    this.countDocuments(query),
  ]);
  
  return {
    reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + reviews.length < total,
    },
  };
};

/**
 * Calculate and update product's average rating
 * @param {ObjectId} productId - Product ID
 * @returns {Promise<Object>}
 */
ReviewSchema.statics.updateProductRating = async function(productId) {
  const Product = mongoose.model('Product');
  
  const stats = await this.aggregate([
    { 
      $match: { 
        product: new mongoose.Types.ObjectId(productId),
        isApproved: true,
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingBreakdown: {
          $push: '$rating'
        }
      }
    }
  ]);
  
  if (stats.length > 0) {
    const { averageRating, totalReviews } = stats[0];
    
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: totalReviews,
    });
    
    return {
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: totalReviews,
    };
  } else {
    // No reviews, reset to 0
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0,
    });
    
    return {
      averageRating: 0,
      reviewCount: 0,
    };
  }
};

/**
 * Get user's review for a product
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} productId - Product ID
 * @returns {Promise<Review|null>}
 */
ReviewSchema.statics.getUserProductReview = async function(userId, productId) {
  return await this.findOne({
    user: userId,
    product: productId,
  }).populate('product', 'name slug images');
};

/**
 * Get rating breakdown for a product
 * @param {ObjectId} productId - Product ID
 * @returns {Promise<Object>}
 */
ReviewSchema.statics.getRatingBreakdown = async function(productId) {
  const breakdown = await this.aggregate([
    { 
      $match: { 
        product: new mongoose.Types.ObjectId(productId),
        isApproved: true,
      }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);
  
  // Format: { 5: 10, 4: 5, 3: 2, 2: 1, 1: 0 }
  const result = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  breakdown.forEach(item => {
    result[item._id] = item.count;
  });
  
  const total = Object.values(result).reduce((sum, count) => sum + count, 0);
  
  // Calculate percentages
  const percentages = {};
  for (let rating in result) {
    percentages[rating] = total > 0 ? Math.round((result[rating] / total) * 100) : 0;
  }
  
  return {
    breakdown: result,
    percentages,
    total,
  };
};

// ============================================
// POST-SAVE HOOK
// ============================================

// Update product rating after saving a review
ReviewSchema.post('save', async function() {
  await this.constructor.updateProductRating(this.product);
});

// Update product rating after deleting a review
ReviewSchema.post('remove', async function() {
  await this.constructor.updateProductRating(this.product);
});

// Update product rating after findOneAndDelete
ReviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.updateProductRating(doc.product);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
