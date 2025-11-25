# Chapter 3.1: Cart Model

## Overview
Complete Cart model implementation with automatic total calculation, expiration handling, and comprehensive business logic methods.

---

## 📦 Features Implemented

### 1. **Cart Schema**
- User reference
- Items array with product and variant details
- Automatic totals calculation (subtotal, tax, shipping, discount)
- 7-day expiration
- Status tracking (active, abandoned, converted)

### 2. **Cart Item Schema**
- Product reference
- Variant information (size, color, SKU)
- Quantity with validation
- Price and subtotal tracking

### 3. **Automatic Calculations**
- Item subtotals (price × quantity)
- Cart subtotal (sum of all items)
- Tax calculation (configurable rate, default 8%)
- Discount application
- Shipping costs
- Final total

### 4. **Business Logic Methods**
- Add item to cart
- Update item quantity
- Remove item
- Clear cart
- Apply/remove coupon
- Update shipping
- Stock validation
- Get populated cart

### 5. **Static Methods**
- Get or create active cart for user
- Cleanup expired carts

---

## 🗂️ Schema Structure

### Cart Model
```javascript
{
  user: ObjectId,                    // Reference to User
  items: [CartItemSchema],           // Array of cart items
  subtotal: Number,                  // Sum of all items
  tax: Number,                       // Calculated tax
  taxRate: Number,                   // Tax rate (default 8%)
  shipping: Number,                  // Shipping cost
  discount: Number,                  // Discount amount
  couponCode: String,                // Applied coupon
  total: Number,                     // Final total
  itemCount: Number,                 // Total item quantity
  expiresAt: Date,                   // Auto-expires in 7 days
  status: String,                    // active/abandoned/converted
  timestamps: true                   // createdAt, updatedAt
}
```

### Cart Item Schema
```javascript
{
  product: ObjectId,                 // Reference to Product
  variant: {
    variantId: ObjectId,             // Variant ID
    size: String,                    // Size (XS, S, M, L, etc.)
    color: String,                   // Color name
    sku: String                      // Product SKU
  },
  quantity: Number,                  // Quantity (min: 1)
  price: Number,                     // Price at time of adding
  subtotal: Number                   // price × quantity
}
```

---

## 🔧 Model Methods

### Instance Methods

#### 1. **calculateTotals()**
Automatically calculates all totals:
```javascript
cart.calculateTotals();
```
- Calculates each item subtotal
- Sums all items to get cart subtotal
- Counts total items
- Applies discount
- Calculates tax
- Adds shipping
- Computes final total

**Called automatically before saving!**

---

#### 2. **addItem(productData, variantData, quantity)**
Add item to cart or update quantity if exists:
```javascript
await cart.addItem(product, variant, 2);
```

**Features:**
- Checks if item already exists (same product + variant)
- Updates quantity if exists, adds new item if not
- Resets expiration to 7 days from now
- Auto-saves and recalculates totals

**Parameters:**
- `productData`: Full product object with _id and price
- `variantData`: Variant object with _id, size, color, sku, price
- `quantity`: Number of items to add (default: 1)

---

#### 3. **updateItemQuantity(itemId, quantity)**
Update quantity of existing item:
```javascript
await cart.updateItemQuantity(itemId, 3);
```

**Features:**
- Finds item by _id
- Updates quantity
- Removes item if quantity <= 0
- Resets expiration
- Auto-saves

---

#### 4. **removeItem(itemId)**
Remove specific item from cart:
```javascript
await cart.removeItem(itemId);
```

**Features:**
- Finds and removes item
- Auto-saves and recalculates

---

#### 5. **clearCart()**
Empty entire cart:
```javascript
await cart.clearCart();
```

**Features:**
- Removes all items
- Clears discount and coupon
- Resets shipping
- Auto-saves

---

#### 6. **applyCoupon(couponCode, discountAmount)**
Apply discount coupon:
```javascript
await cart.applyCoupon('SAVE20', 10.00);
```

**Features:**
- Stores coupon code
- Applies discount amount
- Recalculates totals

---

#### 7. **removeCoupon()**
Remove applied coupon:
```javascript
await cart.removeCoupon();
```

---

#### 8. **updateShipping(shippingCost)**
Update shipping cost:
```javascript
await cart.updateShipping(9.99);
```

---

#### 9. **checkStock()**
Validate all items have sufficient stock:
```javascript
const issues = await cart.checkStock();
```

**Returns:**
```javascript
[
  {
    itemId: "...",
    productName: "Product Name",
    size: "M",
    requested: 5,
    available: 3,
    issue: "Insufficient stock"
  }
]
```

**Checks:**
- Product exists and is active
- Variant exists
- Sufficient stock available

---

#### 10. **getPopulatedCart()**
Populate product details:
```javascript
await cart.getPopulatedCart();
```

**Populates:**
- Product name, slug, brand
- Product images
- Product price and category
- Active status

---

### Static Methods

#### 1. **getActiveCart(userId)**
Get or create active cart for user:
```javascript
const cart = await Cart.getActiveCart(userId);
```

**Features:**
- Returns existing active cart
- Creates new cart if none exists
- Ensures user always has a cart

---

#### 2. **cleanupExpiredCarts()**
Remove expired carts (run as cron job):
```javascript
const result = await Cart.cleanupExpiredCarts();
console.log(`Deleted ${result.deletedCount} expired carts`);
```

**Features:**
- Finds carts past expiration date
- Only removes active carts
- Returns deletion count

---

## 🎯 Key Features

### 1. **Automatic Expiration**
- Carts expire after 7 days of inactivity
- Expiration resets on any cart action
- MongoDB TTL index auto-deletes expired carts
- Manual cleanup with static method

### 2. **Smart Item Management**
- Duplicate detection (same product + variant)
- Quantity updates instead of duplicate entries
- Automatic removal when quantity = 0

### 3. **Real-time Total Calculation**
- Runs before every save
- Always accurate
- Includes tax, shipping, discounts

### 4. **Stock Validation**
- Check all items before checkout
- Returns detailed stock issues
- Prevents overselling

### 5. **Status Tracking**
- **active**: Current shopping cart
- **abandoned**: Left without checkout
- **converted**: Became an order

---

## 🔍 Indexes

```javascript
{ user: 1, status: 1 }        // Find user's active cart
{ expiresAt: 1 }              // TTL index for auto-deletion
{ updatedAt: -1 }             // Recent activity queries
```

---

## 📊 Example Usage

### Create/Get Cart
```javascript
const Cart = require('./models/Cart');

// Get or create cart for user
const cart = await Cart.getActiveCart(userId);
```

### Add Items
```javascript
// Get product and variant
const product = await Product.findById(productId);
const variant = product.variants.id(variantId);

// Add to cart
await cart.addItem(product, variant, 2);
```

### Update Quantity
```javascript
// Update item quantity
await cart.updateItemQuantity(itemId, 3);
```

### Remove Item
```javascript
await cart.removeItem(itemId);
```

### Apply Discount
```javascript
// Apply coupon with 20% discount
const discountAmount = cart.subtotal * 0.20;
await cart.applyCoupon('SAVE20', discountAmount);
```

### Calculate Shipping
```javascript
// Standard shipping
await cart.updateShipping(9.99);
```

### Validate Stock
```javascript
const stockIssues = await cart.checkStock();

if (stockIssues.length > 0) {
  console.log('Stock issues found:', stockIssues);
  // Handle insufficient stock
}
```

### Get Populated Cart
```javascript
await cart.getPopulatedCart();
console.log(cart.items[0].product.name); // Access product details
```

---

## 🧮 Total Calculation Logic

```javascript
// Step 1: Calculate item subtotals
items.forEach(item => {
  item.subtotal = item.price * item.quantity;
});

// Step 2: Sum all items
cart.subtotal = sum(item.subtotal);

// Step 3: Count items
cart.itemCount = sum(item.quantity);

// Step 4: Apply discount
subtotalAfterDiscount = cart.subtotal - cart.discount;

// Step 5: Calculate tax
cart.tax = subtotalAfterDiscount * cart.taxRate;

// Step 6: Add shipping and get total
cart.total = subtotalAfterDiscount + cart.tax + cart.shipping;

// Step 7: Ensure non-negative
cart.total = Math.max(0, cart.total);
```

---

## 🚨 Validation Rules

### Cart Item
- ✅ Quantity minimum: 1
- ✅ Price minimum: 0
- ✅ Product reference required
- ✅ Variant details required

### Cart
- ✅ User reference required
- ✅ All amounts >= 0
- ✅ Tax rate between 0 and 1
- ✅ Status: active/abandoned/converted only

---

## 🎨 Best Practices

### 1. **Always Use Methods**
```javascript
// ✅ Good - uses method
await cart.addItem(product, variant, 2);

// ❌ Bad - manual manipulation
cart.items.push({ product, variant, quantity: 2 });
await cart.save();
```

### 2. **Check Stock Before Checkout**
```javascript
const issues = await cart.checkStock();
if (issues.length > 0) {
  return res.status(400).json({ error: 'Stock unavailable', issues });
}
```

### 3. **Populate When Needed**
```javascript
// For API responses
await cart.getPopulatedCart();
```

### 4. **Handle Expiration**
```javascript
// Run daily cron job
cron.schedule('0 0 * * *', async () => {
  const result = await Cart.cleanupExpiredCarts();
  console.log(`Cleaned up ${result.deletedCount} carts`);
});
```

---

## 🧪 Testing Checklist

- [ ] Create new cart for user
- [ ] Add item to empty cart
- [ ] Add duplicate item (should increase quantity)
- [ ] Update item quantity
- [ ] Remove item
- [ ] Clear entire cart
- [ ] Apply coupon
- [ ] Remove coupon
- [ ] Update shipping
- [ ] Validate stock (with insufficient stock)
- [ ] Check expiration behavior
- [ ] Verify total calculations
- [ ] Test populated cart

---

## 📈 Performance Considerations

### Indexes
- User + status lookup: O(log n)
- Expiration cleanup: O(log n)
- Recent activity: O(log n)

### Optimization Tips
1. **Batch Operations**: Update multiple items together
2. **Populate Selectively**: Only load needed product fields
3. **Cache Active Carts**: Redis for frequently accessed carts
4. **Scheduled Cleanup**: Run during off-peak hours

---

## 🔒 Security Considerations

1. **User Isolation**: Cart always tied to authenticated user
2. **Price Validation**: Store price at time of adding (prevents price manipulation)
3. **Stock Checks**: Validate before checkout
4. **Expiration**: Automatic cleanup prevents database bloat

---

## 📝 Next Steps (Chapter 3.2)

With the Cart model complete, next we'll build:
- GET /api/cart - Get user's cart
- POST /api/cart/items - Add item
- PUT /api/cart/items/:itemId - Update quantity
- DELETE /api/cart/items/:itemId - Remove item
- DELETE /api/cart - Clear cart
- POST /api/cart/coupon - Apply coupon
- POST /api/cart/validate - Check stock

---

## ✅ Chapter 3.1 Complete!

**What Was Built:**
- ✅ Complete Cart model with subdocuments
- ✅ Automatic total calculations
- ✅ 7-day expiration with TTL index
- ✅ 10 instance methods for cart operations
- ✅ 2 static methods for cart management
- ✅ Stock validation logic
- ✅ Comprehensive documentation

**Model is ready for API integration in Chapter 3.2!** 🎉

---

**Created:** November 24, 2025  
**Author:** Droid AI  
**Chapter:** 3.1 - Cart Model
