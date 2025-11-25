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
const upload = require('../config/multer');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with advanced filtering, sorting, and pagination
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
      tags, // NEW: Tag filtering
      minRating, // NEW: Minimum rating filter
    } = req.query;

    // Build filter query
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (size && size !== 'All') {
      filter['variants.size'] = size;
    }

    // Enhanced search: search in name, description, and tags
    if (search) {
      filter.$or = [
        { $text: { $search: search } },
        { tags: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      filter.totalStock = { $gt: 0 };
    }

    // NEW: Tag filtering (supports single or multiple tags)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
      filter.tags = { $in: tagArray };
    }

    // NEW: Minimum rating filter
    if (minRating) {
      filter.averageRating = { $gte: parseFloat(minRating) };
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
      case 'rating': // NEW: Sort by rating
        sort = { averageRating: -1, reviewCount: -1 };
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

// @route   GET /api/products/autocomplete
// @desc    Autocomplete search for products
// @access  Public
router.get('/autocomplete', asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return ApiResponse.success(res, [], 'Query too short');
  }

  // Search in name, tags, and category with regex for autocomplete
  const suggestions = await Product.find({
    isActive: true,
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } }
    ]
  })
    .select('name category price images tags brand')
    .limit(5)
    .lean();

  // Format suggestions for frontend
  const formattedSuggestions = suggestions.map(product => ({
    id: product._id,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.images && product.images.length > 0 
      ? product.images.find(img => img.isPrimary)?.url || product.images[0].url
      : null,
    tags: product.tags,
    brand: product.brand
  }));

  return ApiResponse.success(res, formattedSuggestions, `Found ${formattedSuggestions.length} suggestions`);
}));

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

// ============================================================
// IMAGE MANAGEMENT ROUTES (Chapter 2.4)
// ============================================================

// @route   POST /api/products/:id/images
// @desc    Upload multiple images to product
// @access  Private/Admin
router.post('/:id/images',
  authMiddleware,
  adminOnly,
  upload.array('images', 10),
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (!req.files || req.files.length === 0) {
      throw new AppError('No images provided', 400);
    }

    const { markPrimary } = req.body;

    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, 'products')
    );

    const uploadedImages = await Promise.all(uploadPromises);

    const newImages = uploadedImages.map((img, index) => ({
      url: img.url,
      publicId: img.publicId,
      alt: req.body.alt || `${product.name} image`,
      isPrimary: false,
    }));

    if (markPrimary === 'true' && product.images.length === 0) {
      newImages[0].isPrimary = true;
    }

    product.images.push(...newImages);
    await product.save();

    return ApiResponse.success(
      res, 
      { 
        product, 
        uploadedCount: newImages.length 
      }, 
      `${newImages.length} image(s) uploaded successfully`, 
      201
    );
  })
);

// @route   DELETE /api/products/:id/images/:imageId
// @desc    Delete image from product
// @access  Private/Admin
router.delete('/:id/images/:imageId',
  authMiddleware,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const imageIndex = product.images.findIndex(
      img => img._id.toString() === req.params.imageId
    );

    if (imageIndex === -1) {
      throw new AppError('Image not found', 404);
    }

    const imageToDelete = product.images[imageIndex];

    if (imageToDelete.publicId) {
      await deleteFromCloudinary(imageToDelete.publicId);
    }

    product.images.splice(imageIndex, 1);

    if (imageToDelete.isPrimary && product.images.length > 0) {
      product.images[0].isPrimary = true;
    }

    await product.save();

    return ApiResponse.success(res, product, 'Image deleted successfully');
  })
);

// @route   PUT /api/products/:id/images/:imageId
// @desc    Update image metadata (alt text, set as primary)
// @access  Private/Admin
router.put('/:id/images/:imageId',
  authMiddleware,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const image = product.images.find(
      img => img._id.toString() === req.params.imageId
    );

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    const { alt, isPrimary } = req.body;

    if (alt) {
      image.alt = alt;
    }

    if (isPrimary === true) {
      product.images.forEach(img => {
        img.isPrimary = false;
      });
      image.isPrimary = true;
    }

    await product.save();

    return ApiResponse.success(res, product, 'Image updated successfully');
  })
);

module.exports = router;
