const { body, param, query } = require('express-validator');

const orderValidators = {
  // Validate create order from cart
  createOrder: [
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('shippingAddress.firstName')
      .notEmpty()
      .withMessage('First name is required')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('shippingAddress.lastName')
      .notEmpty()
      .withMessage('Last name is required')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('shippingAddress.street')
      .notEmpty()
      .withMessage('Street address is required')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Street address must be between 5 and 200 characters'),
    body('shippingAddress.city')
      .notEmpty()
      .withMessage('City is required')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('City must be between 2 and 100 characters'),
    body('shippingAddress.state')
      .notEmpty()
      .withMessage('State is required')
      .trim(),
    body('shippingAddress.zipCode')
      .notEmpty()
      .withMessage('ZIP code is required')
      .trim()
      .matches(/^\d{5}(-\d{4})?$/)
      .withMessage('Invalid ZIP code format'),
    body('shippingAddress.phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .trim()
      .matches(/^[\d\s\-\(\)]+$/)
      .withMessage('Invalid phone number format'),
    body('customerNotes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Customer notes cannot exceed 1000 characters'),
  ],

  // Validate get order by ID
  getOrderById: [
    param('orderId')
      .notEmpty()
      .withMessage('Order ID is required')
      .isMongoId()
      .withMessage('Invalid order ID format'),
  ],

  // Validate get order by order number
  getOrderByNumber: [
    param('orderNumber')
      .notEmpty()
      .withMessage('Order number is required')
      .matches(/^MA-\d{4}-\d{3}$/)
      .withMessage('Invalid order number format'),
  ],

  // Validate update order status
  updateStatus: [
    param('orderId')
      .notEmpty()
      .withMessage('Order ID is required')
      .isMongoId()
      .withMessage('Invalid order ID format'),
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status value'),
    body('note')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Note cannot exceed 500 characters'),
  ],

  // Validate cancel order
  cancelOrder: [
    param('orderId')
      .notEmpty()
      .withMessage('Order ID is required')
      .isMongoId()
      .withMessage('Invalid order ID format'),
    body('reason')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Reason cannot exceed 500 characters'),
  ],

  // Validate query parameters for listing orders
  listOrders: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status value'),
    query('paymentStatus')
      .optional()
      .isIn(['pending', 'paid', 'failed', 'refunded'])
      .withMessage('Invalid payment status value'),
  ],
};

module.exports = orderValidators;
