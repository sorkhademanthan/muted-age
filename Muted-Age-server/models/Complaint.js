const mongoose = require('mongoose');

// ============================================
// SUBDOCUMENT SCHEMAS
// ============================================

/**
 * Message/Reply Schema
 * Tracks conversation thread in ticket
 */
const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderRole: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  isInternal: {
    type: Boolean,
    default: false, // Internal notes only visible to admins
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ============================================
// MAIN COMPLAINT/TICKET SCHEMA
// ============================================

const ComplaintSchema = new mongoose.Schema({
  // Ticket Information
  ticketNumber: {
    type: String,
    unique: true,
    required: true,
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true,
  },

  // Ticket Details
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters'],
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },

  category: {
    type: String,
    enum: {
      values: [
        'Product Quality',
        'Delivery Issue',
        'Payment Problem',
        'Return/Refund',
        'Account Issue',
        'Website Issue',
        'General Inquiry',
        'Other'
      ],
      message: '{VALUE} is not a valid category',
    },
    required: [true, 'Category is required'],
    index: true,
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true,
  },

  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open',
    index: true,
  },

  // Related Information
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },

  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },

  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  assignedAt: {
    type: Date,
  },

  // Conversation Thread
  messages: [MessageSchema],

  // Tracking
  lastResponseBy: {
    type: String,
    enum: ['user', 'admin', 'system'],
  },

  lastResponseAt: {
    type: Date,
  },

  resolvedAt: {
    type: Date,
  },

  closedAt: {
    type: Date,
  },

  // Reopening Logic
  canReopen: {
    type: Boolean,
    default: true,
  },

  reopenDeadline: {
    type: Date, // 7 days after resolution
  },

  previousTicket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
  },

  // Metadata
  tags: [{
    type: String,
    trim: true,
  }],

  internalNotes: {
    type: String,
    trim: true,
  },

}, {
  timestamps: true,
});

// ============================================
// INDEXES
// ============================================

ComplaintSchema.index({ user: 1, status: 1 });
ComplaintSchema.index({ category: 1, status: 1 });
ComplaintSchema.index({ assignedTo: 1, status: 1 });
ComplaintSchema.index({ priority: 1, status: 1 });
ComplaintSchema.index({ createdAt: -1 });
ComplaintSchema.index({ ticketNumber: 1 });

// ============================================
// MIDDLEWARE
// ============================================

/**
 * Pre-validate: Generate unique ticket number
 */
ComplaintSchema.pre('validate', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.ticketNumber = `MUTED-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

/**
 * Pre-save: Update lastResponse tracking
 */
ComplaintSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    const lastMessage = this.messages[this.messages.length - 1];
    if (!lastMessage.isInternal) {
      this.lastResponseBy = lastMessage.senderRole;
      this.lastResponseAt = lastMessage.createdAt;
    }
  }
  next();
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Add a message to the ticket
 */
ComplaintSchema.methods.addMessage = async function(userId, role, messageText, isInternal = false) {
  const message = {
    sender: userId,
    senderRole: role,
    message: messageText,
    isInternal: isInternal,
    createdAt: new Date(),
  };

  this.messages.push(message);
  
  if (!isInternal) {
    this.lastResponseBy = role;
    this.lastResponseAt = message.createdAt;
  }

  await this.save();
  return message;
};

/**
 * Update ticket status
 */
ComplaintSchema.methods.updateStatus = async function(newStatus, userId = null) {
  const oldStatus = this.status;
  this.status = newStatus;

  // Track resolution
  if (newStatus === 'resolved' && oldStatus !== 'resolved') {
    this.resolvedAt = new Date();
    this.reopenDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    this.canReopen = true;
  }

  // Track closure
  if (newStatus === 'closed' && oldStatus !== 'closed') {
    this.closedAt = new Date();
    this.canReopen = false;
  }

  // If reopened, clear resolution dates
  if ((oldStatus === 'resolved' || oldStatus === 'closed') && 
      (newStatus === 'open' || newStatus === 'in-progress')) {
    this.resolvedAt = null;
    this.closedAt = null;
    this.reopenDeadline = null;
  }

  await this.save();
  return this;
};

/**
 * Assign ticket to admin
 */
ComplaintSchema.methods.assignTo = async function(adminId) {
  this.assignedTo = adminId;
  this.assignedAt = new Date();
  
  if (this.status === 'open') {
    this.status = 'in-progress';
  }

  await this.save();
  return this;
};

/**
 * Update priority
 */
ComplaintSchema.methods.updatePriority = async function(newPriority) {
  this.priority = newPriority;
  await this.save();
  return this;
};

/**
 * Check if ticket can be reopened
 */
ComplaintSchema.methods.canBeReopened = function() {
  if (!this.canReopen) return false;
  if (!this.reopenDeadline) return false;
  return new Date() <= this.reopenDeadline;
};

/**
 * Reopen ticket
 */
ComplaintSchema.methods.reopen = async function(userId, reason) {
  if (!this.canBeReopened()) {
    throw new Error('Ticket cannot be reopened. Please create a new ticket.');
  }

  this.status = 'open';
  this.resolvedAt = null;
  this.closedAt = null;
  this.reopenDeadline = null;

  // Add system message
  await this.addMessage(userId, 'user', `[REOPENED] ${reason}`);

  await this.save();
  return this;
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Get tickets by user with filters
 */
ComplaintSchema.statics.getByUser = async function(userId, filters = {}) {
  const query = { user: userId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  const tickets = await this.find(query)
    .populate('relatedOrder', 'orderNumber')
    .populate('relatedProduct', 'name slug')
    .sort({ createdAt: -1 });

  return tickets;
};

/**
 * Get all tickets with advanced filters (Admin)
 */
ComplaintSchema.statics.getAllWithFilters = async function(filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  if (filters.unassigned === 'true') {
    query.assignedTo = { $exists: false };
  }

  if (filters.search) {
    query.$or = [
      { ticketNumber: new RegExp(filters.search, 'i') },
      { subject: new RegExp(filters.search, 'i') },
      { description: new RegExp(filters.search, 'i') },
    ];
  }

  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;
  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    this.find(query)
      .populate('user', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .populate('relatedOrder', 'orderNumber')
      .populate('relatedProduct', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments(query),
  ]);

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get statistics (Admin Dashboard)
 */
ComplaintSchema.statics.getStatistics = async function() {
  const [
    total,
    open,
    inProgress,
    resolved,
    closed,
    urgent,
    unassigned,
  ] = await Promise.all([
    this.countDocuments(),
    this.countDocuments({ status: 'open' }),
    this.countDocuments({ status: 'in-progress' }),
    this.countDocuments({ status: 'resolved' }),
    this.countDocuments({ status: 'closed' }),
    this.countDocuments({ priority: 'urgent', status: { $nin: ['closed'] } }),
    this.countDocuments({ assignedTo: { $exists: false }, status: { $nin: ['closed', 'resolved'] } }),
  ]);

  const categoryStats = await this.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const avgResponseTime = await this.aggregate([
    { $match: { lastResponseAt: { $exists: true } } },
    { $project: { 
      responseTime: { $subtract: ['$lastResponseAt', '$createdAt'] } 
    }},
    { $group: { 
      _id: null, 
      avgTime: { $avg: '$responseTime' } 
    }},
  ]);

  return {
    total,
    byStatus: { open, inProgress, resolved, closed },
    urgent,
    unassigned,
    byCategory: categoryStats,
    avgResponseTimeHours: avgResponseTime[0] ? avgResponseTime[0].avgTime / (1000 * 60 * 60) : 0,
  };
};

// ============================================
// VIRTUALS
// ============================================

ComplaintSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

ComplaintSchema.virtual('isWaitingForUser').get(function() {
  return this.lastResponseBy === 'admin';
});

ComplaintSchema.virtual('isWaitingForAdmin').get(function() {
  return this.lastResponseBy === 'user' || !this.lastResponseBy;
});

// Include virtuals in JSON
ComplaintSchema.set('toJSON', { virtuals: true });
ComplaintSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
