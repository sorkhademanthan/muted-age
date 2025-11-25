const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
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
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    default: 0,
  },
}, { _id: true });

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [CartItemSchema],
  subtotal: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  taxRate: {
    type: Number,
    default: 0.08,
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  couponCode: {
    type: String,
    trim: true,
  },
  total: {
    type: Number,
    default: 0,
    min: 0,
  },
  itemCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    },
  },
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted'],
    default: 'active',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

CartSchema.index({ user: 1, status: 1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
CartSchema.index({ updatedAt: -1 });

CartSchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

CartSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((total, item) => {
    item.subtotal = item.price * item.quantity;
    return total + item.subtotal;
  }, 0);

  this.itemCount = this.items.reduce((count, item) => count + item.quantity, 0);

  const subtotalAfterDiscount = this.subtotal - this.discount;
  this.tax = subtotalAfterDiscount * this.taxRate;
  
  this.total = subtotalAfterDiscount + this.tax + this.shipping;
  
  this.total = Math.max(0, this.total);
};

CartSchema.methods.addItem = async function(productData, variantData, quantity = 1) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productData._id.toString() && 
            item.variant.variantId.toString() === variantData._id.toString()
  );

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;
  } else {
    this.items.push({
      product: productData._id,
      variant: {
        variantId: variantData._id,
        size: variantData.size,
        color: variantData.color,
        sku: variantData.sku,
      },
      quantity,
      price: variantData.price || productData.price,
    });
  }

  this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await this.save();
  return this;
};

CartSchema.methods.updateItemQuantity = async function(itemId, quantity) {
  const item = this.items.id(itemId);
  
  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    this.items.pull(itemId);
  } else {
    item.quantity = quantity;
  }

  this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await this.save();
  return this;
};

CartSchema.methods.removeItem = async function(itemId) {
  const item = this.items.id(itemId);
  
  if (!item) {
    throw new Error('Item not found in cart');
  }

  this.items.pull(itemId);
  
  await this.save();
  return this;
};

CartSchema.methods.clearCart = async function() {
  this.items = [];
  this.discount = 0;
  this.couponCode = null;
  this.shipping = 0;
  
  await this.save();
  return this;
};

CartSchema.methods.applyCoupon = async function(couponCode, discountAmount) {
  this.couponCode = couponCode;
  this.discount = discountAmount;
  
  await this.save();
  return this;
};

CartSchema.methods.removeCoupon = async function() {
  this.couponCode = null;
  this.discount = 0;
  
  await this.save();
  return this;
};

CartSchema.methods.updateShipping = async function(shippingCost) {
  this.shipping = shippingCost;
  
  await this.save();
  return this;
};

CartSchema.methods.checkStock = async function() {
  const Product = mongoose.model('Product');
  const stockIssues = [];

  for (const item of this.items) {
    const product = await Product.findById(item.product);
    
    if (!product || !product.isActive) {
      stockIssues.push({
        itemId: item._id,
        productName: product ? product.name : 'Unknown',
        issue: 'Product not available',
      });
      continue;
    }

    const variant = product.variants.id(item.variant.variantId);
    
    if (!variant) {
      stockIssues.push({
        itemId: item._id,
        productName: product.name,
        issue: 'Variant not available',
      });
      continue;
    }

    if (variant.stock < item.quantity) {
      stockIssues.push({
        itemId: item._id,
        productName: product.name,
        size: variant.size,
        requested: item.quantity,
        available: variant.stock,
        issue: 'Insufficient stock',
      });
    }
  }

  return stockIssues;
};

CartSchema.methods.getPopulatedCart = async function() {
  await this.populate({
    path: 'items.product',
    select: 'name slug brand images price category isActive',
  });
  
  return this;
};

CartSchema.statics.getActiveCart = async function(userId) {
  let cart = await this.findOne({ user: userId, status: 'active' });
  
  if (!cart) {
    cart = await this.create({ user: userId });
  }
  
  return cart;
};

CartSchema.statics.cleanupExpiredCarts = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() },
    status: 'active',
  });
  
  return result;
};

module.exports = mongoose.model('Cart', CartSchema);
