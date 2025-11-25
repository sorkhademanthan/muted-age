/**
 * Order Model Test Script
 * Tests Order model functionality independently
 * 
 * Run: node test-order-model.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');
const config = require('./config/config');
const { generateOrderNumber, isValidOrderNumber, parseOrderNumber } = require('./utils/orderNumber');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.yellow}🧪 ${msg}${colors.reset}`),
};

let testUser, testProduct, testVariant;

// Connect to database
async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    log.success('Connected to MongoDB');
  } catch (error) {
    log.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
}

// Disconnect from database
async function disconnectDB() {
  await mongoose.connection.close();
  log.info('Disconnected from MongoDB');
}

// Setup test data
async function setupTestData() {
  log.info('Setting up test data...');
  
  // Get or create test user
  testUser = await User.findOne({ email: 'admin@mutedage.com' });
  if (!testUser) {
    log.error('Test user not found. Please run server and login first.');
    process.exit(1);
  }
  
  // Get test product
  testProduct = await Product.findOne().limit(1);
  if (!testProduct || !testProduct.variants || testProduct.variants.length === 0) {
    log.error('No products found. Please create a product first.');
    process.exit(1);
  }
  
  testVariant = testProduct.variants[0];
  
  log.success(`Test user: ${testUser.email}`);
  log.success(`Test product: ${testProduct.name}`);
}

// Test 1: Order Number Generation
async function testOrderNumberGeneration() {
  log.test('Test 1: Order Number Generation');
  
  try {
    const orderNumber = await generateOrderNumber(Order);
    log.info(`Generated: ${orderNumber}`);
    
    if (!isValidOrderNumber(orderNumber)) {
      throw new Error('Invalid order number format');
    }
    
    const parsed = parseOrderNumber(orderNumber);
    log.info(`Parsed: Year=${parsed.year}, Sequence=${parsed.sequence}`);
    
    const currentYear = new Date().getFullYear();
    if (parsed.year !== currentYear) {
      throw new Error('Order number year does not match current year');
    }
    
    log.success('Order number generation passed');
    return true;
  } catch (error) {
    log.error(`Order number generation failed: ${error.message}`);
    return false;
  }
}

// Test 2: Create Order
async function testCreateOrder() {
  log.test('Test 2: Create Order');
  
  try {
    const orderData = {
      user: testUser._id,
      items: [
        {
          product: testProduct._id,
          productSnapshot: {
            name: testProduct.name,
            slug: testProduct.slug,
            brand: testProduct.brand,
            image: testProduct.images[0]?.url || '',
          },
          variant: {
            variantId: testVariant._id,
            size: testVariant.size,
            color: testVariant.color,
            sku: testVariant.sku,
          },
          quantity: 2,
          price: testProduct.price,
        },
      ],
      subtotal: testProduct.price * 2,
      tax: testProduct.price * 2 * 0.08,
      shipping: 9.99,
      discount: 0,
      total: (testProduct.price * 2) + (testProduct.price * 2 * 0.08) + 9.99,
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '555-0100',
      },
      customerNotes: 'Please leave at door',
    };
    
    const order = await Order.create(orderData);
    
    // Verify order creation
    if (!order.orderNumber) {
      throw new Error('Order number not generated');
    }
    
    if (!isValidOrderNumber(order.orderNumber)) {
      throw new Error('Invalid order number format');
    }
    
    if (order.timeline.length === 0) {
      throw new Error('Timeline not initialized');
    }
    
    if (order.status !== 'pending') {
      throw new Error('Initial status should be pending');
    }
    
    if (order.paymentStatus !== 'pending') {
      throw new Error('Initial payment status should be pending');
    }
    
    log.info(`Order created: ${order.orderNumber}`);
    log.info(`Total: $${order.total.toFixed(2)}`);
    log.info(`Items: ${order.itemCount}`);
    log.info(`Timeline entries: ${order.timeline.length}`);
    
    log.success('Create order passed');
    return order;
  } catch (error) {
    log.error(`Create order failed: ${error.message}`);
    return null;
  }
}

// Test 3: Update Order Status
async function testUpdateStatus(order) {
  log.test('Test 3: Update Order Status');
  
  try {
    const timelineBefore = order.timeline.length;
    
    await order.updateStatus('processing', 'Order is being processed');
    
    if (order.status !== 'processing') {
      throw new Error('Status not updated');
    }
    
    if (order.timeline.length !== timelineBefore + 1) {
      throw new Error('Timeline not updated');
    }
    
    const lastEntry = order.timeline[order.timeline.length - 1];
    if (lastEntry.status !== 'processing') {
      throw new Error('Timeline entry status incorrect');
    }
    
    log.info(`Status updated to: ${order.status}`);
    log.info(`Timeline entries: ${order.timeline.length}`);
    
    log.success('Update status passed');
    return true;
  } catch (error) {
    log.error(`Update status failed: ${error.message}`);
    return false;
  }
}

// Test 4: Update to Shipped (with estimated delivery)
async function testUpdateToShipped(order) {
  log.test('Test 4: Update to Shipped (with estimated delivery)');
  
  try {
    await order.updateStatus('shipped', 'Package shipped via carrier');
    
    if (order.status !== 'shipped') {
      throw new Error('Status not updated to shipped');
    }
    
    if (!order.estimatedDelivery) {
      throw new Error('Estimated delivery not calculated');
    }
    
    const deliveryDate = new Date(order.estimatedDelivery);
    const now = new Date();
    
    if (deliveryDate <= now) {
      throw new Error('Estimated delivery should be in future');
    }
    
    log.info(`Status: ${order.status}`);
    log.info(`Estimated delivery: ${deliveryDate.toDateString()}`);
    
    log.success('Update to shipped passed');
    return true;
  } catch (error) {
    log.error(`Update to shipped failed: ${error.message}`);
    return false;
  }
}

// Test 5: Update Payment Status
async function testUpdatePaymentStatus(order) {
  log.test('Test 5: Update Payment Status');
  
  try {
    const razorpayDetails = {
      orderId: 'order_test_123456789',
      paymentId: 'pay_test_123456789',
      signature: 'sig_test_123456789'
    };
    await order.updatePaymentStatus('paid', razorpayDetails);
    
    if (order.paymentStatus !== 'paid') {
      throw new Error('Payment status not updated');
    }
    
    if (order.razorpayOrderId !== razorpayDetails.orderId) {
      throw new Error('Razorpay order ID not saved');
    }
    
    log.info(`Payment status: ${order.paymentStatus}`);
    log.info(`Razorpay order ID: ${order.razorpayOrderId}`);
    
    log.success('Update payment status passed');
    return true;
  } catch (error) {
    log.error(`Update payment status failed: ${error.message}`);
    return false;
  }
}

// Test 6: Deliver Order
async function testDeliverOrder(order) {
  log.test('Test 6: Deliver Order');
  
  try {
    await order.updateStatus('delivered', 'Package delivered successfully');
    
    if (order.status !== 'delivered') {
      throw new Error('Status not updated to delivered');
    }
    
    if (!order.actualDelivery) {
      throw new Error('Actual delivery date not set');
    }
    
    if (!order.isDelivered) {
      throw new Error('isDelivered virtual should be true');
    }
    
    log.info(`Status: ${order.status}`);
    log.info(`Delivered at: ${order.actualDelivery.toISOString()}`);
    log.info(`Is delivered: ${order.isDelivered}`);
    log.info(`Is paid: ${order.isPaid}`);
    
    log.success('Deliver order passed');
    return true;
  } catch (error) {
    log.error(`Deliver order failed: ${error.message}`);
    return false;
  }
}

// Test 7: Find Order by Number
async function testFindByOrderNumber(orderNumber) {
  log.test('Test 7: Find Order by Number');
  
  try {
    const order = await Order.getOrderByNumber(orderNumber);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (order.orderNumber !== orderNumber) {
      throw new Error('Wrong order returned');
    }
    
    log.info(`Found order: ${order.orderNumber}`);
    log.info(`User: ${order.user.email}`);
    log.info(`Status: ${order.status}`);
    
    log.success('Find by order number passed');
    return true;
  } catch (error) {
    log.error(`Find by order number failed: ${error.message}`);
    return false;
  }
}

// Test 8: Get User Orders
async function testGetUserOrders() {
  log.test('Test 8: Get User Orders');
  
  try {
    const result = await Order.getUserOrders(testUser._id, {
      page: 1,
      limit: 10,
    });
    
    if (!result.orders) {
      throw new Error('No orders returned');
    }
    
    if (!result.pagination) {
      throw new Error('Pagination missing');
    }
    
    log.info(`Found ${result.orders.length} orders`);
    log.info(`Total: ${result.pagination.total}`);
    log.info(`Pages: ${result.pagination.pages}`);
    
    log.success('Get user orders passed');
    return true;
  } catch (error) {
    log.error(`Get user orders failed: ${error.message}`);
    return false;
  }
}

// Test 9: Get User Order Stats
async function testGetUserOrderStats() {
  log.test('Test 9: Get User Order Stats');
  
  try {
    const stats = await Order.getUserOrderStats(testUser._id);
    
    if (typeof stats.totalOrders !== 'number') {
      throw new Error('Invalid stats format');
    }
    
    log.info(`Total orders: ${stats.totalOrders}`);
    log.info(`Total spent: $${stats.totalSpent.toFixed(2)}`);
    log.info(`Delivered: ${stats.deliveredOrders}`);
    
    log.success('Get user order stats passed');
    return true;
  } catch (error) {
    log.error(`Get user order stats failed: ${error.message}`);
    return false;
  }
}

// Test 10: Populate Order
async function testPopulateOrder(order) {
  log.test('Test 10: Populate Order');
  
  try {
    await order.getPopulatedOrder();
    
    if (!order.items[0].product || !order.items[0].product.name) {
      throw new Error('Product not populated');
    }
    
    if (!order.user || !order.user.email) {
      throw new Error('User not populated');
    }
    
    log.info(`Product: ${order.items[0].product.name}`);
    log.info(`User: ${order.user.email}`);
    
    log.success('Populate order passed');
    return true;
  } catch (error) {
    log.error(`Populate order failed: ${error.message}`);
    return false;
  }
}

// Test 11: Virtual Properties
async function testVirtualProperties(order) {
  log.test('Test 11: Virtual Properties');
  
  try {
    if (!order.customerName) {
      throw new Error('customerName virtual missing');
    }
    
    if (typeof order.itemCount !== 'number') {
      throw new Error('itemCount virtual missing');
    }
    
    if (typeof order.isDelivered !== 'boolean') {
      throw new Error('isDelivered virtual missing');
    }
    
    if (typeof order.isPaid !== 'boolean') {
      throw new Error('isPaid virtual missing');
    }
    
    if (typeof order.daysSinceOrder !== 'number') {
      throw new Error('daysSinceOrder virtual missing');
    }
    
    log.info(`Customer: ${order.customerName}`);
    log.info(`Item count: ${order.itemCount}`);
    log.info(`Days since order: ${order.daysSinceOrder}`);
    
    log.success('Virtual properties passed');
    return true;
  } catch (error) {
    log.error(`Virtual properties failed: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n' + '='.repeat(50));
  console.log('  ORDER MODEL TEST SUITE');
  console.log('='.repeat(50) + '\n');
  
  await connectDB();
  await setupTestData();
  
  const results = {
    passed: 0,
    failed: 0,
    total: 11,
  };
  
  // Test 1: Order Number Generation
  if (await testOrderNumberGeneration()) results.passed++;
  else results.failed++;
  console.log();
  
  // Test 2: Create Order
  const order = await testCreateOrder();
  if (order) results.passed++;
  else {
    results.failed++;
    console.log();
    log.error('Cannot continue without order. Exiting.');
    await disconnectDB();
    process.exit(1);
  }
  console.log();
  
  // Test 3: Update Status
  if (await testUpdateStatus(order)) results.passed++;
  else results.failed++;
  console.log();
  
  // Test 4: Update to Shipped
  if (await testUpdateToShipped(order)) results.passed++;
  else results.failed++;
  console.log();
  
  // Test 5: Update Payment Status
  if (await testUpdatePaymentStatus(order)) results.passed++;
  else results.failed++;
  console.log();
  
  // Test 6: Deliver Order
  if (await testDeliverOrder(order)) results.passed++;
  else results.failed++;
  console.log();
  
  // Test 7: Find by Order Number
  if (await testFindByOrderNumber(order.orderNumber)) results.passed++;
  else results.failed++;
  console.log();
  
  // Test 8: Get User Orders
  if (await testGetUserOrders()) results.passed++;
  else results.failed++;
  console.log();
  
  // Test 9: Get User Order Stats
  if (await testGetUserOrderStats()) results.passed++;
  else results.failed++;
  console.log();
  
  // Test 10: Populate Order
  if (await testPopulateOrder(order)) results.passed++;
  else results.failed++;
  console.log();
  
  // Test 11: Virtual Properties
  if (await testVirtualProperties(order)) results.passed++;
  else results.failed++;
  console.log();
  
  // Summary
  console.log('='.repeat(50));
  console.log('  TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(50) + '\n');
  
  await disconnectDB();
  
  if (results.failed > 0) {
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
