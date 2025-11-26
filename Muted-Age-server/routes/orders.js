const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/response');

// ============================================
// 1. CREATE ORDER FROM CART
// ============================================
// POST /api/orders
// Creates order from user's cart, validates stock, clears cart
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  // Validate shipping address
  if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.lastName || 
      !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || 
      !shippingAddress.zipCode || !shippingAddress.phone) {
    return sendError(res, 'Complete shipping address is required', 400);
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id, status: 'active' })
    .populate('items.product');

  if (!cart || cart.items.length === 0) {
    return sendError(res, 'Cart is empty', 400);
  }

  // Validate stock for all items
  const stockIssues = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      stockIssues.push({
        productName: product?.name || 'Unknown product',
        issue: 'Product not available',
      });
      continue;
    }

    const variant = product.variants.id(item.variant.variantId);
    if (!variant) {
      stockIssues.push({
        productName: product.name,
        issue: 'Variant not found',
      });
      continue;
    }

    if (variant.stock < item.quantity) {
      stockIssues.push({
        productName: product.name,
        variantSize: variant.size,
        requested: item.quantity,
        available: variant.stock,
        issue: `Insufficient stock. Only ${variant.stock} available`,
      });
    }
  }

  if (stockIssues.length > 0) {
    return sendError(res, 'Stock validation failed', 400, { stockIssues });
  }

  // Create order items with product snapshots
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    productSnapshot: {
      name: item.product.name,
      slug: item.product.slug,
      brand: item.product.brand,
      image: item.product.images && item.product.images.length > 0 
        ? item.product.images[0].url 
        : null,
    },
    variant: {
      variantId: item.variant.variantId,
      size: item.variant.size,
      color: item.variant.color,
      sku: item.variant.sku,
    },
    quantity: item.quantity,
    price: item.price,
    subtotal: item.subtotal,
  }));

  // Create order
  const order = new Order({
    user: req.user.id,
    items: orderItems,
    subtotal: cart.subtotal,
    tax: cart.tax,
    taxRate: cart.taxRate,
    shipping: cart.shipping,
    discount: cart.discount,
    couponCode: cart.couponCode,
    total: cart.total,
    shippingAddress,
    status: 'pending',
    paymentStatus: 'pending',
  });

  await order.save();

  // Reduce stock for each item
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    const variant = product.variants.id(item.variant.variantId);
    variant.stock -= item.quantity;
    await product.save();
  }

  // Mark cart as converted and clear items
  cart.status = 'converted';
  cart.items = [];
  await cart.save();

  // Populate order for response
  await order.populate('user', 'username email');

  sendSuccess(res, 'Order created successfully', { 
    order,
    message: 'Your order has been placed. Please proceed to payment.',
  }, 201);
}));

// ============================================
// 2. GET USER'S ORDER HISTORY
// ============================================
// GET /api/orders?page=1&limit=10&status=pending
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, paymentStatus } = req.query;

  const query = { user: req.user.id };
  
  if (status) {
    query.status = status;
  }
  
  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('orderNumber items status paymentStatus total createdAt estimatedDelivery')
      .populate('items.product', 'name slug images'),
    Order.countDocuments(query),
  ]);

  // Format orders for frontend
  const formattedOrders = orders.map(order => ({
    id: order.orderNumber,
    _id: order._id,
    orderNumber: order.orderNumber,
    date: order.createdAt.toISOString().split('T')[0],
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: order.total,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    items: order.items.map(item => ({
      productName: item.productSnapshot.name,
      image: item.productSnapshot.image,
      size: item.variant.size,
      color: item.variant.color,
      quantity: item.quantity,
      price: item.price,
    })),
    estimatedDelivery: order.estimatedDelivery,
  }));

  sendSuccess(res, 'Orders retrieved successfully', {
    orders: formattedOrders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + orders.length < total,
    },
  });
}));

// ============================================
// 3. GET SINGLE ORDER BY ORDER NUMBER
// ============================================
// GET /api/orders/:orderNumber
router.get('/:orderNumber', authMiddleware, asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;

  const order = await Order.findOne({ orderNumber })
    .populate('items.product', 'name slug images brand category')
    .populate('user', 'username email profile');

  if (!order) {
    return sendError(res, 'Order not found', 404);
  }

  // Ensure user can only view their own orders (unless admin)
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return sendError(res, 'Access denied', 403);
  }

  // Format for frontend (Orders.jsx & TrackOrders.jsx)
  const formattedOrder = {
    id: order.orderNumber,
    _id: order._id,
    orderNumber: order.orderNumber,
    date: order.createdAt.toISOString().split('T')[0],
    status: order.status,
    paymentStatus: order.paymentStatus,
    
    // Items
    items: order.items.map(item => ({
      productId: item.product?._id,
      productName: item.productSnapshot.name,
      slug: item.productSnapshot.slug,
      brand: item.productSnapshot.brand,
      image: item.productSnapshot.image,
      size: item.variant.size,
      color: item.variant.color,
      sku: item.variant.sku,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    })),
    
    // Pricing
    subtotal: order.subtotal,
    tax: order.tax,
    shipping: order.shipping,
    discount: order.discount,
    total: order.total,
    couponCode: order.couponCode,
    
    // Shipping
    shippingAddress: order.shippingAddress,
    
    // Tracking
    currentStatus: order.status,
    estimatedDelivery: order.estimatedDelivery 
      ? new Date(order.estimatedDelivery).toLocaleString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit' 
        })
      : null,
    actualDelivery: order.actualDelivery,
    
    // Timeline for TrackOrders.jsx
    timeline: order.timeline.map(entry => ({
      stage: entry.status,
      label: formatStatusLabel(entry.status),
      date: new Date(entry.timestamp).toISOString().split('T')[0].replace(/-/g, '.'),
      time: new Date(entry.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      note: entry.note,
      completed: true,
    })),
    
    // Customer info
    customerName: order.customerName,
    customerEmail: order.user.email,
  };

  sendSuccess(res, 'Order details retrieved successfully', { order: formattedOrder });
}));

// ============================================
// 4. UPDATE ORDER STATUS (ADMIN ONLY)
// ============================================
// PATCH /api/orders/:id/status
router.patch('/:id/status', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!status || !validStatuses.includes(status)) {
    return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
  }

  const order = await Order.findById(id);
  
  if (!order) {
    return sendError(res, 'Order not found', 404);
  }

  // Update status using the model method
  await order.updateStatus(status, note || `Order status updated to ${status}`, req.user.id);

  sendSuccess(res, 'Order status updated successfully', { 
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      timeline: order.timeline,
    },
  });
}));

// ============================================
// 5. GET ORDER STATISTICS (USER)
// ============================================
// GET /api/orders/stats/summary
router.get('/stats/summary', authMiddleware, asyncHandler(async (req, res) => {
  const stats = await Order.getUserOrderStats(req.user.id);
  
  sendSuccess(res, 'Order statistics retrieved successfully', { stats });
}));

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatStatusLabel(status) {
  const labels = {
    pending: 'Order Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
}

module.exports = router;
