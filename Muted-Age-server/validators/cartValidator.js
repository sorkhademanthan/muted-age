const { body, param } = require('express-validator');

const cartValidators = {
  // Validate add item to cart
  addItem: [
    body('productId')
      .notEmpty()
      .withMessage('Product ID is required')
      .isMongoId()
      .withMessage('Invalid product ID format'),
    
    body('variantId')
      .notEmpty()
      .withMessage('Variant ID is required')
      .isMongoId()
      .withMessage('Invalid variant ID format'),
    
    body('quantity')
      .optional()
      .isInt({ min: 1, max: 99 })
      .withMessage('Quantity must be between 1 and 99'),
  ],

  // Validate update item quantity
  updateItemQuantity: [
    param('itemId')
      .notEmpty()
      .withMessage('Item ID is required')
      .isMongoId()
      .withMessage('Invalid item ID format'),
    
    body('quantity')
      .notEmpty()
      .withMessage('Quantity is required')
      .isInt({ min: 0, max: 99 })
      .withMessage('Quantity must be between 0 and 99'),
  ],

  // Validate remove item
  removeItem: [
    param('itemId')
      .notEmpty()
      .withMessage('Item ID is required')
      .isMongoId()
      .withMessage('Invalid item ID format'),
  ],

  // Validate apply coupon
  applyCoupon: [
    body('couponCode')
      .notEmpty()
      .withMessage('Coupon code is required')
      .isString()
      .withMessage('Coupon code must be a string')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Coupon code must be between 3 and 20 characters')
      .matches(/^[A-Z0-9]+$/)
      .withMessage('Coupon code must contain only uppercase letters and numbers'),
  ],

  // Validate update shipping
  updateShipping: [
    body('shippingCost')
      .notEmpty()
      .withMessage('Shipping cost is required')
      .isFloat({ min: 0, max: 999.99 })
      .withMessage('Shipping cost must be between 0 and 999.99'),
  ],
};

module.exports = cartValidators;
