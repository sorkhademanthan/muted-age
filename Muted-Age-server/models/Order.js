const mongoose = require('mongoose');
const { generateOrderNumber } = require('../utils/orderNumber');

// ============================================
// SUBDOCUMENT SCHEMAS
// ============================================

/**
 * Order Item Schema
 * Stores snapshot of product at time of purchase
 */
const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
  },
  productSnapshot: {
    name: {
      type: String,
      required: true,
    },
    slug: String,
    brand: String,
    image: String, // Primary image URL
  },
  variant: {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    color: String,
    sku: {
      type: String,
      required: true,
    },
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  subtotal: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { _id: true });

// Calculate subtotal before saving
OrderItemSchema.pre('save', function(next) {
  this.subtotal = this.price * this.quantity;
  next();
});

/**
 * Timeline Entry Schema
 * Tracks order status changes
 */
const TimelineEntrySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, 'Note cannot exceed 500 characters'],
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { _id: true });

/**
 * Shipping Address Schema
 * Customer's delivery address
 */
const ShippingAddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
  },
  apartment: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    trim: true,
  },
  country: {
    type: String,
    required: true,
    default: 'United States',
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
}, { _id: false });

// ============================================
// MAIN ORDER SCHEMA
// ============================================

const OrderSchema = new mongoose.Schema({
  // Identification
  orderNumber: {
    type: String,
    // Not required - generated automatically in pre-save hook
    // unique index defined separately below
    match: [/^MA-\d{4}-\d{3}$/, 'Invalid order number format'],
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  
  // Order Items
  items: {
    type: [OrderItemSchema],
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must contain at least one item',
    },
  },
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative'],
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative'],
  },
  taxRate: {
    type: Number,
    default: 0.08, // 8% default
    min: 0,
    max: 1,
  },
  shipping: {
    type: Number,
    default: 0,
    min: [0, 'Shipping cost cannot be negative'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
  },
  couponCode: {
    type: String,
    trim: true,
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
  },
  
  // Shipping Information
  shippingAddress: {
    type: ShippingAddressSchema,
    required: [true, 'Shipping address is required'],
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      message: 'Invalid order status',
    },
    default: 'pending',
  },
  
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: 'Invalid payment status',
    },
    default: 'pending',
  },
  
  razorpayOrderId: {
    type: String,
    trim: true,
  },
  
  razorpayPaymentId: {
    type: String,
    trim: true,
  },
  
  razorpaySignature: {
    type: String,
    trim: true,
  },
  
  // Timeline
  timeline: [TimelineEntrySchema],
  
  // Delivery
  estimatedDelivery: {
    type: Date,
  },
  actualDelivery: {
    type: Date,
  },
  
  // Additional Info
  customerNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  
  internalNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Internal notes cannot exceed 1000 characters'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ============================================
// INDEXES
// ============================================

// User's order history (most common query)
OrderSchema.index({ user: 1, createdAt: -1 });

// Order number lookup (unique)
OrderSchema.index({ orderNumber: 1 }, { unique: true });

// Status filtering
OrderSchema.index({ status: 1 });

// Payment status filtering
OrderSchema.index({ paymentStatus: 1 });

// Recent orders
OrderSchema.index({ createdAt: -1 });

// Compound index for user + status queries
OrderSchema.index({ user: 1, status: 1 });

// ============================================
// VIRTUAL PROPERTIES
// ============================================

// Full customer name
OrderSchema.virtual('customerName').get(function() {
  return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
});

// Item count
OrderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Is delivered
OrderSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered';
});

// Is paid
OrderSchema.virtual('isPaid').get(function() {
  return this.paymentStatus === 'paid';
});

// Days since order
OrderSchema.virtual('daysSinceOrder').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// ============================================
// PRE-SAVE HOOKS
// ============================================

/**
 * Pre-save hook to calculate item subtotals
 */
OrderSchema.pre('save', function(next) {
  // Calculate subtotals for each item
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
  
  // Recalculate order subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  next();
});

/**
 * Pre-save hook to generate order number for new orders
 */
OrderSchema.pre('save', async function(next) {
  // Generate order number for new orders
  if (this.isNew && !this.orderNumber) {
    try {
      this.orderNumber = await generateOrderNumber(mongoose.model('Order'));
    } catch (error) {
      return next(error);
    }
  }
  
  // Add initial timeline entry for new orders
  if (this.isNew && this.timeline.length === 0) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Order created',
    });
  }
  
  next();
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Update order status and add timeline entry
 * @param {String} newStatus - New status value
 * @param {String} note - Optional note
 * @param {ObjectId} userId - User who made the update
 * @returns {Promise<Order>}
 */
OrderSchema.methods.updateStatus = async function(newStatus, note = '', userId = null) {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  
  // Prevent backwards status changes (except cancellation)
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(this.status);
  const newIndex = statusOrder.indexOf(newStatus);
  
  if (newStatus !== 'cancelled' && newIndex < currentIndex) {
    throw new Error(`Cannot change status from ${this.status} to ${newStatus}`);
  }
  
  this.status = newStatus;
  
  // Add timeline entry
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Order status changed to ${newStatus}`,
    updatedBy: userId,
  });
  
  // Calculate estimated delivery when shipped
  if (newStatus === 'shipped' && !this.estimatedDelivery) {
    this.estimatedDelivery = this.calculateEstimatedDelivery();
  }
  
  // Set actual delivery date when delivered
  if (newStatus === 'delivered' && !this.actualDelivery) {
    this.actualDelivery = new Date();
  }
  
  await this.save();
  return this;
};

/**
 * Update payment status
 * @param {String} status - New payment status
 * @param {Object} razorpayDetails - Razorpay payment details
 * @returns {Promise<Order>}
 */
OrderSchema.methods.updatePaymentStatus = async function(status, razorpayDetails = {}) {
  const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
  
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid payment status: ${status}`);
  }
  
  this.paymentStatus = status;
  
  // Save Razorpay payment details
  if (razorpayDetails.orderId) {
    this.razorpayOrderId = razorpayDetails.orderId;
  }
  if (razorpayDetails.paymentId) {
    this.razorpayPaymentId = razorpayDetails.paymentId;
  }
  if (razorpayDetails.signature) {
    this.razorpaySignature = razorpayDetails.signature;
  }
  
  // Add timeline entry for payment status
  this.timeline.push({
    status: this.status,
    timestamp: new Date(),
    note: `Payment ${status}`,
  });
  
  await this.save();
  return this;
};

/**
 * Calculate estimated delivery date
 * @returns {Date}
 */
OrderSchema.methods.calculateEstimatedDelivery = function() {
  const deliveryDays = 3; // Standard 3-day delivery
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
  
  // Skip weekends (simple logic)
  const dayOfWeek = estimatedDate.getDay();
  if (dayOfWeek === 0) { // Sunday
    estimatedDate.setDate(estimatedDate.getDate() + 1);
  } else if (dayOfWeek === 6) { // Saturday
    estimatedDate.setDate(estimatedDate.getDate() + 2);
  }
  
  return estimatedDate;
};

/**
 * Add a timeline entry
 * @param {String} status - Status for entry
 * @param {String} note - Note text
 * @param {ObjectId} userId - User who made the entry
 * @returns {Promise<Order>}
 */
OrderSchema.methods.addTimelineEntry = async function(status, note, userId = null) {
  this.timeline.push({
    status: status || this.status,
    timestamp: new Date(),
    note,
    updatedBy: userId,
  });
  
  await this.save();
  return this;
};

/**
 * Populate order with product details
 * @returns {Promise<Order>}
 */
OrderSchema.methods.getPopulatedOrder = async function() {
  await this.populate({
    path: 'items.product',
    select: 'name slug brand images category isActive',
  });
  
  await this.populate({
    path: 'user',
    select: 'username email profile',
  });
  
  return this;
};

/**
 * Cancel order
 * @param {String} reason - Cancellation reason
 * @param {ObjectId} userId - User who cancelled
 * @returns {Promise<Order>}
 */
OrderSchema.methods.cancelOrder = async function(reason, userId = null) {
  if (this.status === 'delivered') {
    throw new Error('Cannot cancel delivered order');
  }
  
  if (this.status === 'cancelled') {
    throw new Error('Order is already cancelled');
  }
  
  await this.updateStatus('cancelled', reason || 'Order cancelled', userId);
  
  // TODO: Initiate refund if payment was made
  
  return this;
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Get user's orders with pagination and filtering
 * @param {ObjectId} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
OrderSchema.statics.getUserOrders = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    paymentStatus,
    sortBy = '-createdAt',
  } = options;
  
  const query = { user: userId };
  
  if (status) {
    query.status = status;
  }
  
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }
  
  const orders = await this.find(query)
    .sort(sortBy)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('items.product', 'name images slug')
    .lean();
  
  const total = await this.countDocuments(query);
  
  return {
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Find order by order number
 * @param {String} orderNumber - Order number
 * @returns {Promise<Order>}
 */
OrderSchema.statics.getOrderByNumber = async function(orderNumber) {
  return await this.findOne({ orderNumber })
    .populate('items.product', 'name images slug brand')
    .populate('user', 'username email');
};

/**
 * Get order statistics for a user
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Object>}
 */
OrderSchema.statics.getUserOrderStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
        },
      },
    },
  ]);
  
  return stats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  };
};

/**
 * Get recent orders (admin)
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
OrderSchema.statics.getRecentOrders = async function(options = {}) {
  const { limit = 20, status } = options;
  
  const query = {};
  if (status) query.status = status;
  
  return await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'username email')
    .populate('items.product', 'name');
};

module.exports = mongoose.model('Order', OrderSchema);
