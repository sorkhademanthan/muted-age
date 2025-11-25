# Phase 4: Order Processing - Implementation Plan

## 📋 Pre-Development Checklist

### ✅ What You Need to Do BEFORE We Start:

#### 1. **Nothing!** 🎉
- ✅ Phase 3 is already committed
- ✅ Server is set up
- ✅ All dependencies installed
- ✅ Tests are passing

**You're ready to start immediately!**

---

## 🎯 Phase 4 Overview

### Chapters:
1. **Chapter 4.1: Order Model** ← We'll start here
2. **Chapter 4.2: Payment Integration** (Stripe)
3. **Chapter 4.3: Order Management API**

---

## 📦 Chapter 4.1: Order Model - Implementation Plan

### What We'll Build:

#### **Order Schema Features:**
```javascript
Order {
  // Identification
  orderNumber: "MA-2024-001"              // Auto-generated
  user: ObjectId                          // User reference
  
  // Items (from cart)
  items: [OrderItemSchema]                // Products ordered
  
  // Pricing
  subtotal: Number
  tax: Number
  shipping: Number
  discount: Number
  total: Number
  
  // Shipping
  shippingAddress: {
    firstName, lastName,
    street, city, state, zip,
    country, phone
  }
  
  // Status Tracking
  status: "pending"                       // pending → processing → shipped → delivered
  paymentStatus: "pending"                // pending → paid → refunded
  
  // Timeline
  timeline: [{
    status: "ordered",
    timestamp: Date,
    note: String
  }]
  
  // Metadata
  createdAt, updatedAt
  estimatedDelivery: Date
}
```

#### **Order Item Schema:**
```javascript
OrderItem {
  product: ObjectId
  variant: {
    variantId, size, color, sku
  }
  quantity: Number
  price: Number                           // Price at time of order
  subtotal: Number
}
```

---

### Key Features to Implement:

#### 1. **Auto-Generated Order Numbers**
- Format: `MA-2024-XXX`
- Sequential numbering
- Unique per order

#### 2. **Status Management**
- Order status: pending → processing → shipped → delivered
- Payment status: pending → paid → refunded → failed
- Timeline tracking for each status change

#### 3. **Order Creation from Cart**
- Copy cart items to order
- Lock prices at time of purchase
- Clear cart after order creation

#### 4. **Methods:**

**Instance Methods:**
- `updateStatus(newStatus, note)` - Update order status
- `updatePaymentStatus(status)` - Update payment
- `addTimelineEntry(status, note)` - Add to timeline
- `calculateEstimatedDelivery()` - Calculate delivery date
- `getPopulatedOrder()` - Populate product details

**Static Methods:**
- `generateOrderNumber()` - Generate unique order number
- `getUserOrders(userId)` - Get user's order history
- `getOrderByNumber(orderNumber)` - Find by order number

---

### Frontend Requirements (from Orders.jsx & TrackOrders.jsx):

```javascript
// Orders.jsx needs:
{
  id: "MA-2024-001",
  date: "2024-12-08",
  status: "Shipped",
  total: 49.99,
  items: [...]
}

// TrackOrders.jsx needs:
{
  id: "MA-2024-001",
  item: "Product Name",
  currentStatus: "in-transit",
  origin: "Warehouse",
  destination: "Customer Address",
  estimatedDelivery: "Tomorrow, 3:00 PM",
  timeline: [
    { 
      stage: "ordered",
      label: "Order Confirmed",
      date: "2024.12.08",
      time: "14:30",
      completed: true
    },
    // ... more stages
  ]
}
```

---

## 🗂️ Files to Create/Modify:

### New Files:
```
Muted-Age-server/
├── models/
│   └── Order.js                        ← NEW (Main focus)
├── utils/
│   └── orderNumber.js                  ← NEW (Order number generation)
└── test-chapter-4.1.sh                 ← NEW (Testing script)
```

### Documentation:
```
docs/02-backend/phase-4-orders/
├── chapter-4.1-order-model.md          ← NEW
└── PHASE-4-IMPLEMENTATION-PLAN.md      ← This file
```

---

## 🎯 Implementation Steps:

### Step 1: Order Item Schema (5 min)
```javascript
const OrderItemSchema = new mongoose.Schema({
  product: { type: ObjectId, ref: 'Product', required: true },
  variant: {
    variantId: ObjectId,
    size: String,
    color: String,
    sku: String
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, default: 0 }
});
```

### Step 2: Timeline Entry Schema (3 min)
```javascript
const TimelineEntrySchema = new mongoose.Schema({
  status: { 
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  note: String,
  updatedBy: { type: ObjectId, ref: 'User' }
});
```

### Step 3: Shipping Address Schema (5 min)
```javascript
const ShippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  street: { type: String, required: true },
  apartment: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'United States' },
  phone: { type: String, required: true }
});
```

### Step 4: Main Order Schema (10 min)
```javascript
const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  user: { type: ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  shippingAddress: ShippingAddressSchema,
  
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  timeline: [TimelineEntrySchema],
  estimatedDelivery: Date
}, { timestamps: true });
```

### Step 5: Order Number Generation (10 min)
```javascript
// utils/orderNumber.js
async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const lastOrder = await Order.findOne()
    .sort({ createdAt: -1 })
    .select('orderNumber');
  
  let sequence = 1;
  if (lastOrder && lastOrder.orderNumber) {
    const lastNum = parseInt(lastOrder.orderNumber.split('-')[2]);
    sequence = lastNum + 1;
  }
  
  return `MA-${year}-${sequence.toString().padStart(3, '0')}`;
}
```

### Step 6: Pre-save Hook (5 min)
```javascript
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = await generateOrderNumber();
  }
  
  // Add initial timeline entry
  if (this.isNew) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Order created'
    });
  }
  
  next();
});
```

### Step 7: Instance Methods (15 min)
```javascript
// Update order status
OrderSchema.methods.updateStatus = async function(newStatus, note, userId) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy: userId
  });
  
  if (newStatus === 'shipped') {
    this.estimatedDelivery = this.calculateEstimatedDelivery();
  }
  
  await this.save();
  return this;
};

// Update payment status
OrderSchema.methods.updatePaymentStatus = async function(status) {
  this.paymentStatus = status;
  await this.save();
  return this;
};

// Calculate estimated delivery
OrderSchema.methods.calculateEstimatedDelivery = function() {
  const deliveryDays = 3; // Standard 3-day delivery
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
  return estimatedDate;
};

// Populate order with product details
OrderSchema.methods.getPopulatedOrder = async function() {
  await this.populate({
    path: 'items.product',
    select: 'name slug images brand'
  });
  return this;
};
```

### Step 8: Static Methods (10 min)
```javascript
// Get user's orders
OrderSchema.statics.getUserOrders = async function(userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  
  const query = { user: userId };
  if (status) query.status = status;
  
  const orders = await this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('items.product', 'name images');
  
  return orders;
};

// Find by order number
OrderSchema.statics.getOrderByNumber = async function(orderNumber) {
  return await this.findOne({ orderNumber });
};
```

### Step 9: Indexes (3 min)
```javascript
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
```

---

## ⏱️ Estimated Time:

- **Schema Design:** 30 minutes
- **Methods Implementation:** 30 minutes
- **Testing Script:** 15 minutes
- **Documentation:** 15 minutes
- **Total:** ~90 minutes

---

## 🧪 Testing Plan:

### Test Script Will Cover:
1. ✅ Order number generation (MA-2024-XXX format)
2. ✅ Sequential numbering
3. ✅ Order creation with items
4. ✅ Status updates
5. ✅ Timeline tracking
6. ✅ Payment status updates
7. ✅ Estimated delivery calculation
8. ✅ User order history
9. ✅ Find by order number

---

## 📊 Success Criteria:

After Chapter 4.1, you should be able to:
- ✅ Create orders with auto-generated order numbers
- ✅ Track order status through lifecycle
- ✅ Update payment status
- ✅ View order timeline/history
- ✅ Calculate estimated delivery
- ✅ Query orders by user
- ✅ Find orders by order number

---

## 🔮 What's Next (Chapter 4.2):

After completing the Order Model, we'll add:
- Stripe payment integration
- Payment intent creation
- Webhook handling for payment events
- Payment verification

---

## 📝 Notes:

### Important Decisions Made:
1. **Order Number Format:** MA-YYYY-XXX (e.g., MA-2024-001)
2. **Status Flow:** pending → processing → shipped → delivered
3. **Payment Flow:** pending → paid (or failed/refunded)
4. **Delivery:** Standard 3-day delivery estimate
5. **Timeline:** Automatic tracking of all status changes

### Future Enhancements (Not in 4.1):
- Email notifications (Chapter 4.3)
- Order cancellation with refund (Chapter 4.3)
- Order modifications (Chapter 4.3)
- Shipping tracking integration (Phase 5)

---

## ✅ Ready to Start?

**You don't need to do anything!** Just confirm and I'll start implementing Chapter 4.1: Order Model.

**Confirmation:** Reply "let's start" or "proceed" and I'll begin building the Order model.

---

**Estimated Completion:** 90 minutes  
**Complexity:** Medium  
**Dependencies:** None (all required packages already installed)

**Let's build an amazing order system!** 🚀
