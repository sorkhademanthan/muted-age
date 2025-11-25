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
  publicId: {
    type: String,
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
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ 'variants.sku': 1 }, { unique: true });

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
