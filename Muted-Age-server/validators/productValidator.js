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
      .isIn(['featured', 'price-low', 'price-high', 'newest', 'popular'])
      .withMessage('Invalid sort option'),
  ],
};

module.exports = productValidators;
