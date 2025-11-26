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
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
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
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
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

// ============================================
// WISHLIST METHODS
// ============================================

/**
 * Add product to wishlist
 * @param {ObjectId} productId - Product ID
 * @returns {Promise<User>}
 */
UserSchema.methods.addToWishlist = async function(productId) {
  // Check if already in wishlist
  if (this.wishlist.includes(productId)) {
    throw new Error('Product already in wishlist');
  }
  
  this.wishlist.push(productId);
  await this.save();
  return this;
};

/**
 * Remove product from wishlist
 * @param {ObjectId} productId - Product ID
 * @returns {Promise<User>}
 */
UserSchema.methods.removeFromWishlist = async function(productId) {
  this.wishlist = this.wishlist.filter(id => id.toString() !== productId.toString());
  await this.save();
  return this;
};

/**
 * Check if product is in wishlist
 * @param {ObjectId} productId - Product ID
 * @returns {Boolean}
 */
UserSchema.methods.isInWishlist = function(productId) {
  return this.wishlist.some(id => id.toString() === productId.toString());
};

/**
 * Clear wishlist
 * @returns {Promise<User>}
 */
UserSchema.methods.clearWishlist = async function() {
  this.wishlist = [];
  await this.save();
  return this;
};

/**
 * Get populated wishlist
 * @returns {Promise<User>}
 */
UserSchema.methods.getPopulatedWishlist = async function() {
  await this.populate({
    path: 'wishlist',
    select: 'name slug price comparePrice images averageRating reviewCount isActive',
  });
  return this;
};

// ============================================
// ADDRESS METHODS
// ============================================

/**
 * Add new address
 * @param {Object} addressData - Address data
 * @returns {Promise<User>}
 */
UserSchema.methods.addAddress = async function(addressData) {
  // If this is the first address or marked as default, set it as default
  if (this.addresses.length === 0 || addressData.isDefault) {
    // Remove default from other addresses
    this.addresses.forEach(addr => addr.isDefault = false);
    addressData.isDefault = true;
  }
  
  this.addresses.push(addressData);
  await this.save();
  return this;
};

/**
 * Update address
 * @param {ObjectId} addressId - Address ID
 * @param {Object} addressData - Updated address data
 * @returns {Promise<User>}
 */
UserSchema.methods.updateAddress = async function(addressId, addressData) {
  const address = this.addresses.id(addressId);
  
  if (!address) {
    throw new Error('Address not found');
  }
  
  // If setting this as default, remove default from others
  if (addressData.isDefault) {
    this.addresses.forEach(addr => {
      if (addr._id.toString() !== addressId.toString()) {
        addr.isDefault = false;
      }
    });
  }
  
  // Update address fields
  Object.keys(addressData).forEach(key => {
    address[key] = addressData[key];
  });
  
  await this.save();
  return this;
};

/**
 * Remove address
 * @param {ObjectId} addressId - Address ID
 * @returns {Promise<User>}
 */
UserSchema.methods.removeAddress = async function(addressId) {
  const address = this.addresses.id(addressId);
  
  if (!address) {
    throw new Error('Address not found');
  }
  
  const wasDefault = address.isDefault;
  
  // Remove address using pull
  this.addresses.pull(addressId);
  
  // If removed address was default and there are other addresses, set first one as default
  if (wasDefault && this.addresses.length > 0) {
    this.addresses[0].isDefault = true;
  }
  
  await this.save();
  return this;
};

/**
 * Set address as default
 * @param {ObjectId} addressId - Address ID
 * @returns {Promise<User>}
 */
UserSchema.methods.setDefaultAddress = async function(addressId) {
  const address = this.addresses.id(addressId);
  
  if (!address) {
    throw new Error('Address not found');
  }
  
  // Remove default from all addresses
  this.addresses.forEach(addr => addr.isDefault = false);
  
  // Set this address as default
  address.isDefault = true;
  
  await this.save();
  return this;
};

/**
 * Get default address
 * @returns {Address|null}
 */
UserSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(addr => addr.isDefault) || null;
};

// ============================================
// VIRTUAL PROPERTIES
// ============================================

// Full name
UserSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Wishlist count
UserSchema.virtual('wishlistCount').get(function() {
  return this.wishlist.length;
});

// Address count
UserSchema.virtual('addressCount').get(function() {
  return this.addresses.length;
});

module.exports = mongoose.model('User', UserSchema);
