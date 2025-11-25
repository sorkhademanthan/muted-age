const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');
const cartValidators = require('../validators/cartValidator');
const validate = require('../middleware/validator');
const CartValidationUtils = require('../utils/cartValidation');

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

// @route   GET /api/cart
// @desc    Get user's active cart with populated product details
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  let cart = await Cart.getActiveCart(req.user.id);
  
  await cart.getPopulatedCart();

  return ApiResponse.success(res, {
    cart: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      taxRate: cart.taxRate,
      shipping: cart.shipping,
      discount: cart.discount,
      couponCode: cart.couponCode,
      total: cart.total,
      itemCount: cart.itemCount,
      expiresAt: cart.expiresAt,
      status: cart.status,
    }
  }, 'Cart retrieved successfully');
}));

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post('/items', 
  cartValidators.addItem,
  validate,
  asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  const variant = product ? product.variants.id(variantId) : null;

  // Comprehensive stock validation
  const stockValidation = await CartValidationUtils.validateStock(
    product, 
    variant, 
    quantity
  );

  if (!stockValidation.valid) {
    throw new AppError(
      stockValidation.issues[0].message, 
      400
    );
  }

  let cart = await Cart.getActiveCart(req.user.id);
  
  // Check cart size limit
  const existingItem = cart.items.find(
    item => item.product.toString() === productId && 
            item.variant.variantId.toString() === variantId
  );
  
  if (!existingItem) {
    CartValidationUtils.validateCartSize(cart.items.length, 1);
  }
  
  await cart.addItem(product, variant, quantity);
  await cart.getPopulatedCart();

  // Prepare response with warnings
  const response = {
    cart: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      itemCount: cart.itemCount,
    }
  };

  // Add low stock warning if applicable
  if (stockValidation.warning) {
    response.warning = stockValidation.warning;
  }

  return ApiResponse.success(res, response, 'Item added to cart successfully', 201);
}));

// @route   PUT /api/cart/items/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/items/:itemId', 
  cartValidators.updateItemQuantity,
  validate,
  asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || quantity === null) {
    throw new AppError('Quantity is required', 400);
  }

  if (quantity < 0) {
    throw new AppError('Quantity cannot be negative', 400);
  }

  const cart = await Cart.findOne({ 
    user: req.user.id, 
    status: 'active' 
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const item = cart.items.id(itemId);
  if (!item) {
    throw new AppError('Item not found in cart', 404);
  }

  if (quantity > 0) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const variant = product.variants.id(item.variant.variantId);
    if (!variant) {
      throw new AppError('Variant not found', 404);
    }

    if (variant.stock < quantity) {
      throw new AppError(
        `Insufficient stock. Only ${variant.stock} available`, 
        400
      );
    }
  }

  await cart.updateItemQuantity(itemId, quantity);
  await cart.getPopulatedCart();

  const message = quantity === 0 
    ? 'Item removed from cart' 
    : 'Cart item updated successfully';

  return ApiResponse.success(res, {
    cart: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      itemCount: cart.itemCount,
    }
  }, message);
}));

// @route   DELETE /api/cart/items/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:itemId', 
  cartValidators.removeItem,
  validate,
  asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ 
    user: req.user.id, 
    status: 'active' 
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  await cart.removeItem(itemId);
  await cart.getPopulatedCart();

  return ApiResponse.success(res, {
    cart: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      itemCount: cart.itemCount,
    }
  }, 'Item removed from cart successfully');
}));

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ 
    user: req.user.id, 
    status: 'active' 
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  await cart.clearCart();

  return ApiResponse.success(res, {
    cart: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      itemCount: cart.itemCount,
    }
  }, 'Cart cleared successfully');
}));

// @route   POST /api/cart/coupon
// @desc    Apply coupon code to cart
// @access  Private
router.post('/coupon', 
  cartValidators.applyCoupon,
  validate,
  asyncHandler(async (req, res) => {
  let { couponCode } = req.body;

  // Validate and normalize coupon code
  couponCode = CartValidationUtils.validateCouponFormat(couponCode);

  const cart = await Cart.findOne({ 
    user: req.user.id, 
    status: 'active' 
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  if (cart.items.length === 0) {
    throw new AppError('Cannot apply coupon to empty cart', 400);
  }

  // TODO: Implement coupon validation logic
  // For now, using placeholder discount calculation
  const discountPercentage = 0.10; // 10% discount
  const discountAmount = cart.subtotal * discountPercentage;

  await cart.applyCoupon(couponCode, discountAmount);
  await cart.getPopulatedCart();

  return ApiResponse.success(res, {
    cart: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      couponCode: cart.couponCode,
      total: cart.total,
      itemCount: cart.itemCount,
    }
  }, 'Coupon applied successfully');
}));

// @route   DELETE /api/cart/coupon
// @desc    Remove coupon from cart
// @access  Private
router.delete('/coupon', asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ 
    user: req.user.id, 
    status: 'active' 
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  await cart.removeCoupon();
  await cart.getPopulatedCart();

  return ApiResponse.success(res, {
    cart: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      couponCode: cart.couponCode,
      total: cart.total,
      itemCount: cart.itemCount,
    }
  }, 'Coupon removed successfully');
}));

// @route   PUT /api/cart/shipping
// @desc    Update shipping cost
// @access  Private
router.put('/shipping', 
  cartValidators.updateShipping,
  validate,
  asyncHandler(async (req, res) => {
  const { shippingCost } = req.body;

  // Validate shipping cost
  CartValidationUtils.validateShippingCost(shippingCost);

  const cart = await Cart.findOne({ 
    user: req.user.id, 
    status: 'active' 
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  await cart.updateShipping(shippingCost);
  await cart.getPopulatedCart();

  return ApiResponse.success(res, {
    cart: {
      _id: cart._id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
      itemCount: cart.itemCount,
    }
  }, 'Shipping cost updated successfully');
}));

// @route   POST /api/cart/validate
// @desc    Validate cart stock availability before checkout
// @access  Private
router.post('/validate', asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ 
    user: req.user.id, 
    status: 'active' 
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  if (cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const stockIssues = await cart.checkStock();

  if (stockIssues.length > 0) {
    return ApiResponse.success(res, {
      valid: false,
      issues: stockIssues,
      message: 'Some items in your cart are unavailable or have insufficient stock'
    }, 'Cart validation failed', 400);
  }

  return ApiResponse.success(res, {
    valid: true,
    cart: {
      _id: cart._id,
      itemCount: cart.itemCount,
      total: cart.total,
    }
  }, 'Cart is valid and ready for checkout');
}));

// @route   POST /api/cart/validate/checkout
// @desc    Comprehensive pre-checkout validation with warnings
// @access  Private
router.post('/validate/checkout', asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ 
    user: req.user.id, 
    status: 'active' 
  });

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  // Populate cart for validation
  await cart.getPopulatedCart();

  // Comprehensive validation
  const validation = await CartValidationUtils.validateCartForCheckout(cart);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Cart validation failed',
      data: {
        valid: false,
        issues: validation.issues,
        warnings: validation.warnings
      }
    });
  }

  return ApiResponse.success(res, {
    valid: true,
    warnings: validation.warnings,
    cart: {
      _id: cart._id,
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      discount: cart.discount,
      total: cart.total,
    }
  }, validation.warnings.length > 0 
    ? 'Cart is valid but has some warnings' 
    : 'Cart is ready for checkout');
}));

// @route   GET /api/cart/check-stock/:productId/:variantId
// @desc    Check stock availability for a specific product variant
// @access  Private
router.get('/check-stock/:productId/:variantId', asyncHandler(async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.query;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw new AppError('Variant not found', 404);
  }

  const stockValidation = await CartValidationUtils.validateStock(
    product,
    variant,
    parseInt(quantity)
  );

  const alternatives = !stockValidation.valid 
    ? CartValidationUtils.getAvailableAlternatives(product, variantId)
    : [];

  return ApiResponse.success(res, {
    available: stockValidation.valid,
    stock: variant.stock,
    requested: parseInt(quantity),
    warning: stockValidation.warning,
    alternatives: alternatives.length > 0 ? alternatives : undefined,
    product: {
      _id: product._id,
      name: product.name,
      price: product.price
    },
    variant: {
      _id: variant._id,
      size: variant.size,
      color: variant.color,
      sku: variant.sku
    }
  }, stockValidation.valid ? 'Stock available' : 'Stock unavailable');
}));

module.exports = router;
