# Razorpay Integration - Step-by-Step Guide 🇮🇳

## 📋 Overview

This guide will walk you through setting up Razorpay payment gateway for your Muted Age e-commerce platform.

**Time Required:** 30-45 minutes  
**Difficulty:** Easy  
**Prerequisites:** None (we'll create everything step by step)

---

## 🎯 What is Razorpay?

Razorpay is India's leading payment gateway that allows you to:
- Accept online payments (Cards, UPI, Netbanking, Wallets)
- Process international payments
- Get instant settlements
- Handle refunds automatically

**Why Razorpay?**
- ✅ Easy integration
- ✅ Supports all Indian payment methods
- ✅ Lower fees than international gateways
- ✅ Excellent documentation
- ✅ Great support

---

## 📝 Step 1: Create Razorpay Account (10 minutes)

### 1.1 Sign Up

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click **"Sign Up"** button (top right)
3. Fill in details:
   - **Email:** Your business email
   - **Phone:** Your mobile number
   - **Password:** Create a strong password
4. Click **"Get Started"**
5. **Verify your email** (check inbox for verification link)
6. **Verify your phone** (enter OTP sent via SMS)

**✅ You now have a Razorpay account!**

---

### 1.2 Complete Business Details (Can Do Later)

For now, you can skip this and use **Test Mode**. When going live, you'll need to:
- Business name
- Business type
- PAN number
- Bank account details

**Note:** Test mode works perfectly for development!

---

## 🔑 Step 2: Get API Keys (5 minutes)

### 2.1 Switch to Test Mode

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Look at top-left corner
3. Make sure it says **"Test Mode"** (it should be blue)
4. If it says "Live Mode", click it and select "Test Mode"

**Why Test Mode?**
- No real money is charged
- Can test unlimited payments
- Use test card numbers
- Perfect for development

---

### 2.2 Get Your Keys

1. In dashboard, click **"Settings"** (left sidebar, gear icon)
2. Click **"API Keys"** (under "Account & Security")
3. Click **"Generate Test API Keys"** button
4. You'll see:
   - **Key ID:** Starts with `rzp_test_`
   - **Key Secret:** Click "Copy" to copy it

**⚠️ IMPORTANT:**
- Copy both keys immediately
- Key Secret is shown only ONCE
- If you lose it, generate new keys
- Never share these keys publicly

**📋 Save these somewhere safe:**
```
Key ID:     rzp_test_XXXXXXXXXXXXX
Key Secret: XXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🔧 Step 3: Install Razorpay SDK (2 minutes)

### 3.1 Install Package

Open terminal and run:

```bash
cd Muted-Age-server
npm install razorpay
```

**Expected Output:**
```
+ razorpay@2.9.2
added 1 package
```

**✅ Razorpay SDK installed!**

---

## 🔐 Step 4: Configure Environment Variables (5 minutes)

### 4.1 Update .env File

1. Open `Muted-Age-server/.env` file
2. Add these lines:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

**Replace:**
- `YOUR_KEY_ID_HERE` with your actual Key ID
- `YOUR_KEY_SECRET_HERE` with your actual Key Secret
- `your_webhook_secret_here` can be any random string for now (we'll set up webhooks later)

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_AbCd123456789
RAZORPAY_KEY_SECRET=xYz987654321SecretKey
RAZORPAY_WEBHOOK_SECRET=my_webhook_secret_123
```

---

### 4.2 Verify Configuration

Your `config/config.js` already has Razorpay config:

```javascript
razorpay: {
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
}
```

**✅ Configuration ready!**

---

## 🧪 Step 5: Test Your Setup (5 minutes)

### 5.1 Create Test Script

Create file: `Muted-Age-server/test-razorpay-setup.js`

```javascript
require('dotenv').config();
const Razorpay = require('razorpay');
const config = require('./config/config');

console.log('🧪 Testing Razorpay Setup...\n');

// Check environment variables
console.log('1. Checking environment variables...');
if (!config.razorpay.keyId) {
  console.error('❌ RAZORPAY_KEY_ID not found in .env');
  process.exit(1);
}
if (!config.razorpay.keySecret) {
  console.error('❌ RAZORPAY_KEY_SECRET not found in .env');
  process.exit(1);
}
console.log('✅ Environment variables found');
console.log(`   Key ID: ${config.razorpay.keyId.substring(0, 15)}...`);

// Initialize Razorpay
console.log('\n2. Initializing Razorpay instance...');
try {
  const razorpay = new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret,
  });
  console.log('✅ Razorpay instance created successfully');
} catch (error) {
  console.error('❌ Failed to create Razorpay instance:', error.message);
  process.exit(1);
}

// Test API connection
console.log('\n3. Testing API connection...');
const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

razorpay.payments.all({ count: 1 })
  .then(() => {
    console.log('✅ API connection successful');
    console.log('\n✨ Razorpay setup is complete and working!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test creating an order');
    console.log('   2. Integrate payment in API');
    console.log('   3. Test payment flow');
  })
  .catch((error) => {
    if (error.statusCode === 401) {
      console.error('❌ Authentication failed - check your API keys');
    } else {
      console.error('❌ API connection failed:', error.message);
    }
    process.exit(1);
  });
```

---

### 5.2 Run Test

```bash
node test-razorpay-setup.js
```

**Expected Output:**
```
🧪 Testing Razorpay Setup...

1. Checking environment variables...
✅ Environment variables found
   Key ID: rzp_test_AbCd12...

2. Initializing Razorpay instance...
✅ Razorpay instance created successfully

3. Testing API connection...
✅ API connection successful

✨ Razorpay setup is complete and working!

📝 Next steps:
   1. Test creating an order
   2. Integrate payment in API
   3. Test payment flow
```

**✅ If you see this, everything is working!**

---

## 📚 Step 6: Understanding Razorpay Flow (10 minutes)

### How Razorpay Works

```
1. Customer clicks "Place Order"
   ↓
2. Backend creates Razorpay Order
   ↓
3. Frontend shows Razorpay Checkout
   ↓
4. Customer pays
   ↓
5. Razorpay processes payment
   ↓
6. Frontend receives response
   ↓
7. Backend verifies payment signature
   ↓
8. Order status updated to "paid"
```

---

### Key Concepts

**1. Razorpay Order**
- Created on backend before payment
- Has unique Order ID
- Contains amount and currency
- Used to initialize checkout

**2. Razorpay Payment**
- Created when customer pays
- Has unique Payment ID
- Links to Order ID

**3. Signature Verification**
- Security check to prevent fraud
- Done on backend
- Verifies payment is legitimate

---

## 🛠️ Step 7: Create Payment Utility (5 minutes)

Create file: `Muted-Age-server/utils/razorpay.js`

```javascript
const Razorpay = require('razorpay');
const crypto = require('crypto');
const config = require('../config/config');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

/**
 * Create Razorpay order
 * @param {Number} amount - Amount in rupees
 * @param {String} receipt - Order receipt/number
 * @param {Object} notes - Additional notes
 * @returns {Promise<Object>} - Razorpay order
 */
async function createRazorpayOrder(amount, receipt, notes = {}) {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise (smallest unit)
      currency: 'INR',
      receipt: receipt,
      notes: notes,
    };
    
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
}

/**
 * Verify Razorpay payment signature
 * @param {String} orderId - Razorpay order ID
 * @param {String} paymentId - Razorpay payment ID
 * @param {String} signature - Razorpay signature
 * @returns {Boolean} - True if signature is valid
 */
function verifyPaymentSignature(orderId, paymentId, signature) {
  try {
    const body = orderId + '|' + paymentId;
    
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body.toString())
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error) {
    return false;
  }
}

/**
 * Get payment details
 * @param {String} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} - Payment details
 */
async function getPaymentDetails(paymentId) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new Error(`Failed to fetch payment details: ${error.message}`);
  }
}

/**
 * Initiate refund
 * @param {String} paymentId - Razorpay payment ID
 * @param {Number} amount - Refund amount in rupees (optional, full refund if not provided)
 * @returns {Promise<Object>} - Refund details
 */
async function initiateRefund(paymentId, amount = null) {
  try {
    const options = {};
    if (amount) {
      options.amount = Math.round(amount * 100); // Convert to paise
    }
    
    const refund = await razorpay.payments.refund(paymentId, options);
    return refund;
  } catch (error) {
    throw new Error(`Failed to initiate refund: ${error.message}`);
  }
}

module.exports = {
  razorpay,
  createRazorpayOrder,
  verifyPaymentSignature,
  getPaymentDetails,
  initiateRefund,
};
```

**✅ Razorpay utility functions ready!**

---

## 🧪 Step 8: Test Creating an Order (5 minutes)

Create file: `Muted-Age-server/test-razorpay-order.js`

```javascript
require('dotenv').config();
const { createRazorpayOrder, verifyPaymentSignature } = require('./utils/razorpay');

console.log('🧪 Testing Razorpay Order Creation...\n');

async function testCreateOrder() {
  try {
    console.log('1. Creating Razorpay order...');
    
    const order = await createRazorpayOrder(
      499.00,              // Amount in rupees
      'TEST_001',          // Receipt number
      { test: 'order' }    // Notes
    );
    
    console.log('✅ Order created successfully!');
    console.log('\n📦 Order Details:');
    console.log(`   Order ID: ${order.id}`);
    console.log(`   Amount: ₹${order.amount / 100}`);
    console.log(`   Currency: ${order.currency}`);
    console.log(`   Receipt: ${order.receipt}`);
    console.log(`   Status: ${order.status}`);
    
    console.log('\n2. Testing signature verification...');
    
    // Simulate signature verification
    const isValid = verifyPaymentSignature(
      order.id,
      'pay_test_123',
      'invalid_signature'
    );
    
    if (!isValid) {
      console.log('✅ Signature verification working (correctly rejected invalid signature)');
    }
    
    console.log('\n✨ All tests passed!');
    console.log('\n📝 You can now integrate payment in your API');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testCreateOrder();
```

---

### Run Test

```bash
node test-razorpay-order.js
```

**Expected Output:**
```
🧪 Testing Razorpay Order Creation...

1. Creating Razorpay order...
✅ Order created successfully!

📦 Order Details:
   Order ID: order_xxxxxxxxxxxxx
   Amount: ₹499
   Currency: INR
   Receipt: TEST_001
   Status: created

2. Testing signature verification...
✅ Signature verification working (correctly rejected invalid signature)

✨ All tests passed!

📝 You can now integrate payment in your API
```

**✅ If you see this, you're ready to integrate payments!**

---

## 📋 Step 9: Test Payment Methods (Optional)

### Test Cards (Test Mode Only)

Razorpay provides test cards for testing:

**Successful Payment:**
- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

**Failed Payment:**
- **Card Number:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date

**UPI Test:**
- **UPI ID:** success@razorpay
- **UPI ID (Failure):** failure@razorpay

---

## ✅ Setup Complete Checklist

Check if you've completed all steps:

- [ ] Created Razorpay account
- [ ] Got API keys (Key ID & Secret)
- [ ] Installed razorpay package
- [ ] Updated .env file with keys
- [ ] Ran test-razorpay-setup.js (passed)
- [ ] Created utils/razorpay.js
- [ ] Ran test-razorpay-order.js (passed)
- [ ] Understand payment flow
- [ ] Know test card numbers

**If all checked ✅, you're ready for Chapter 4.2!**

---

## 🚀 What's Next?

### Chapter 4.2: Payment Integration

We'll implement:
1. Create order with Razorpay
2. Verify payment on backend
3. Update order status
4. Handle payment webhooks
5. Process refunds

**Estimated Time:** 2-3 hours

---

## 💡 Quick Reference

### Important Links

- **Dashboard:** https://dashboard.razorpay.com/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **Documentation:** https://razorpay.com/docs/
- **API Reference:** https://razorpay.com/docs/api/

### Key Files

```
Muted-Age-server/
├── .env                        # API keys here
├── config/config.js            # Razorpay config
├── utils/razorpay.js          # Payment utilities
├── test-razorpay-setup.js     # Setup test
└── test-razorpay-order.js     # Order test
```

### Environment Variables

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

---

## 🐛 Troubleshooting

### Issue: "Authentication failed"
**Solution:**
- Check if Key ID starts with `rzp_test_`
- Verify Key Secret is copied correctly
- Make sure you're in Test Mode

### Issue: "Cannot find module 'razorpay'"
**Solution:**
```bash
cd Muted-Age-server
npm install razorpay
```

### Issue: "Environment variables not found"
**Solution:**
- Check `.env` file exists
- Verify variable names match exactly
- Restart server after updating .env

---

## 🎓 Understanding Razorpay Concepts

### Amount in Paise
Razorpay uses smallest currency unit (paise for INR):
- ₹1.00 = 100 paise
- ₹499.00 = 49900 paise
- Always multiply by 100: `amount * 100`

### Order vs Payment
- **Order:** Created before payment (on backend)
- **Payment:** Created when user pays (by Razorpay)
- One Order can have multiple Payment attempts

### Signature Verification
- Security feature to prevent fraud
- Uses HMAC SHA256
- Verifies payment came from Razorpay
- Must always verify on backend

---

## 🎉 Congratulations!

You've successfully set up Razorpay! 🎊

**What you learned:**
- ✅ Created Razorpay account
- ✅ Got and configured API keys
- ✅ Installed Razorpay SDK
- ✅ Created utility functions
- ✅ Tested the setup
- ✅ Understand payment flow

**You're now ready to integrate payments in Chapter 4.2!** 🚀

---

**Need Help?** 
- Check Razorpay Dashboard for transaction logs
- Use test mode for unlimited testing
- Refer to this guide anytime

**Happy Coding!** ✨
