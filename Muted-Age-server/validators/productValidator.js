const { body, param, query } = require('express-validator');

const productValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Product name is required')
      .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),
    
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    
    body('price')
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('comparePrice')
      .optional()
      .isFloat({ min: 0 }).withMessage('Compare price must be a positive number'),
    
    body('category')
      .notEmpty().withMessage('Category is required')
      .isIn(['Outerwear', 'Tops', 'Bottoms', 'Accessories'])
      .withMessage('Invalid category'),
    
    body('variants')
      .isArray({ min: 1 }).withMessage('At least one variant is required'),
    
    body('variants.*.size')
      .notEmpty().withMessage('Variant size is required')
      .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'])
      .withMessage('Invalid size'),
    
    body('variants.*.sku')
      .trim()
      .notEmpty().withMessage('SKU is required'),
    
    body('variants.*.stock')
      .isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
    
    body('images')
      .isArray({ min: 1 }).withMessage('At least one image is required'),
    
    body('images.*.url')
      .isURL().withMessage('Invalid image URL'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('category')
      .optional()
      .isIn(['Outerwear', 'Tops', 'Bottoms', 'Accessories'])
      .withMessage('Invalid category'),
  ],

  delete: [
    param('id').isMongoId().withMessage('Invalid product ID'),
  ],

  getById: [
    param('id').isMongoId().withMessage('Invalid product ID'),
  ],

  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    
    query('category')
      .optional()
      .isIn(['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'])
      .withMessage('Invalid category'),
    
    query('sortBy')
      .optional()
      .isIn(['featured', 'price-low', 'price-high', 'newest', 'popular', 'rating'])
      .withMessage('Invalid sort option'),
    
    query('minPrice')
      .optional()
      .isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
    
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
    
    query('minRating')
      .optional()
      .isFloat({ min: 0, max: 5 }).withMessage('Min rating must be between 0 and 5'),
    
    query('tags')
      .optional()
      .custom((value) => {
        if (typeof value === 'string') {
          return value.length > 0;
        }
        if (Array.isArray(value)) {
          return value.length > 0 && value.every(tag => typeof tag === 'string');
        }
        return false;
      }).withMessage('Tags must be a string or array of strings'),
    
    query('inStock')
      .optional()
      .isIn(['true', 'false']).withMessage('inStock must be true or false'),
  ],
};

module.exports = productValidators;
