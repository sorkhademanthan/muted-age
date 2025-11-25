# Chapter 3.3: Cart Validation System

## Overview
Comprehensive validation system for cart operations including stock checks, input validation, quantity limits, and pre-checkout validation.

---

## 📦 Features Implemented

### 1. **Input Validation**
- Product and variant ID format validation
- Quantity limits (1-99 per item)
- Coupon code format validation
- Shipping cost validation
- MongoDB ObjectId format checking

### 2. **Stock Validation**
- Real-time stock availability checks
- Product active status validation
- Variant existence validation
- Insufficient stock detection
- Alternative variant suggestions

### 3. **Business Rules**
- Maximum 99 items per cart item
- Maximum 50 unique items in cart
- Minimum order amount: $1
- Maximum order amount: $99,999.99
- Low stock threshold: 5 units

### 4. **Enhanced Validation Endpoints**
- Stock check before adding to cart
- Comprehensive pre-checkout validation
- Low stock warnings
- Alternative variant recommendations

---

## 🗂️ Files Structure

```
Muted-Age-server/
├── validators/
│   └── cartValidator.js          # Express-validator rules
├── utils/
│   └── cartValidation.js         # Validation utility class
├── routes/
│   └── cart.js                   # Updated with validation
└── test-chapter-3.3.sh           # Validation test script
```

---

## 🔍 Validation Components

### 1. Cart Validators (Express-Validator)

**File:** `validators/cartValidator.js`

Validation rules for cart endpoints:

```javascript
// Add Item Validation
- productId: required, MongoDB ObjectId
- variantId: required, MongoDB ObjectId
- quantity: optional, integer 1-99

// Update Quantity Validation
- itemId: required, MongoDB ObjectId (param)
- quantity: required, integer 0-99

// Remove Item Validation
- itemId: required, MongoDB ObjectId (param)

// Apply Coupon Validation
- couponCode: required, string, 3-20 chars, uppercase + numbers only

// Update Shipping Validation
- shippingCost: required, float, 0-999.99
```

**Usage:**
```javascript
router.post('/items', 
  cartValidators.addItem,
  validate,
  asyncHandler(async (req, res) => {
    // Handler code
  })
);
```

---

### 2. Cart Validation Utils

**File:** `utils/cartValidation.js`

Comprehensive validation utility class with static methods:

#### Constants
```javascript
MAX_QUANTITY_PER_ITEM = 99        // Maximum quantity per cart item
MAX_CART_ITEMS = 50               // Maximum unique items in cart
MIN_ORDER_AMOUNT = 1              // Minimum order total
MAX_ORDER_AMOUNT = 99999.99       // Maximum order total
LOW_STOCK_THRESHOLD = 5           // Low stock warning threshold
```

#### Key Methods

**validateQuantity(quantity, available)**
```javascript
CartValidationUtils.validateQuantity(10, 25);
// Returns: true
// Throws: AppError if invalid
```

**validateCartSize(currentItemCount, additionalItems)**
```javascript
CartValidationUtils.validateCartSize(48, 2);
// Returns: true (48 + 2 = 50, within limit)
```

**validateStock(product, variant, quantity)**
```javascript
const validation = await CartValidationUtils.validateStock(
  product, 
  variant, 
  5
);
// Returns: {
//   valid: true,
//   issues: [],
//   warning: { warning: true, message: "Only 3 left in stock", available: 3 }
// }
```

**validateCartForCheckout(cart)**
```javascript
const validation = await CartValidationUtils.validateCartForCheckout(cart);
// Returns: {
//   valid: true,
//   issues: [],
//   warnings: [...]
// }
```

**checkLowStock(availableStock)**
```javascript
const warning = CartValidationUtils.checkLowStock(3);
// Returns: {
//   warning: true,
//   message: "Only 3 left in stock",
//   available: 3
// }
```

**getAvailableAlternatives(product, excludeVariantId)**
```javascript
const alternatives = CartValidationUtils.getAvailableAlternatives(
  product, 
  variantId
);
// Returns: [
//   {
//     variantId: "...",
//     size: "M",
//     color: "Black",
//     stock: 10,
//     lowStock: false
//   }
// ]
```

---

## 🔗 New API Endpoints

### 1. Check Stock Availability

**GET** `/api/cart/check-stock/:productId/:variantId?quantity=1`

Check stock availability for a specific product variant before adding to cart.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `productId` - Product ID
- `variantId` - Variant ID

**Query Parameters:**
- `quantity` - Requested quantity (default: 1)

**Response (200 OK) - Stock Available:**
```json
{
  "success": true,
  "message": "Stock available",
  "data": {
    "available": true,
    "stock": 25,
    "requested": 2,
    "warning": null,
    "product": {
      "_id": "673c...",
      "name": "Classic T-Shirt",
      "price": 29.99
    },
    "variant": {
      "_id": "673c...",
      "size": "M",
      "color": "Black",
      "sku": "TSH-M-BLK"
    }
  }
}
```

**Response (200 OK) - Insufficient Stock with Alternatives:**
```json
{
  "success": true,
  "message": "Stock unavailable",
  "data": {
    "available": false,
    "stock": 2,
    "requested": 5,
    "warning": {
      "warning": true,
      "message": "Only 2 left in stock",
      "available": 2
    },
    "alternatives": [
      {
        "variantId": "673c...",
        "size": "L",
        "color": "Black",
        "stock": 15,
        "lowStock": false
      },
      {
        "variantId": "673c...",
        "size": "XL",
        "color": "Black",
        "stock": 8,
        "lowStock": false
      }
    ],
    "product": { ... },
    "variant": { ... }
  }
}
```

**Use Cases:**
- Display stock status on product page
- Show "Only X left!" warning
- Suggest alternative sizes/colors
- Prevent adding out-of-stock items

---

### 2. Comprehensive Checkout Validation

**POST** `/api/cart/validate/checkout`

Perform comprehensive pre-checkout validation including stock, pricing, and warnings.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK) - Valid Cart:**
```json
{
  "success": true,
  "message": "Cart is ready for checkout",
  "data": {
    "valid": true,
    "warnings": [],
    "cart": {
      "_id": "673c...",
      "itemCount": 3,
      "subtotal": 89.97,
      "tax": 7.20,
      "shipping": 9.99,
      "discount": 0,
      "total": 107.16
    }
  }
}
```

**Response (200 OK) - Valid with Warnings:**
```json
{
  "success": true,
  "message": "Cart is valid but has some warnings",
  "data": {
    "valid": true,
    "warnings": [
      {
        "itemId": "673c...",
        "productName": "Classic T-Shirt",
        "size": "M",
        "warning": true,
        "message": "Only 3 left in stock",
        "available": 3
      }
    ],
    "cart": { ... }
  }
}
```

**Response (400 Bad Request) - Validation Failed:**
```json
{
  "success": false,
  "message": "Cart validation failed",
  "data": {
    "valid": false,
    "issues": [
      {
        "field": "stock",
        "message": "Insufficient stock",
        "code": "STOCK_ISSUE",
        "details": {
          "itemId": "673c...",
          "productName": "Vintage Hoodie",
          "size": "L",
          "requested": 10,
          "available": 5,
          "issue": "Insufficient stock"
        }
      },
      {
        "field": "product",
        "message": "Product is no longer available",
        "code": "PRODUCT_INACTIVE",
        "details": { ... }
      }
    ],
    "warnings": []
  }
}
```

**Validation Checks:**
- ✅ Cart not empty
- ✅ All products exist and active
- ✅ All variants exist
- ✅ Sufficient stock for all items
- ✅ Cart total within limits
- ✅ Low stock warnings

---

## 🛡️ Validation Rules

### Input Validation

#### Product/Variant IDs
```javascript
// Must be valid MongoDB ObjectId (24 hex characters)
✅ Valid:   "673c1234567890abcdef1234"
❌ Invalid: "invalid-id"
❌ Invalid: "12345"
```

#### Quantity
```javascript
// Must be integer between 1 and 99
✅ Valid:   1, 2, 50, 99
❌ Invalid: 0, -1, 100, 999
❌ Invalid: 1.5, "ten"
```

#### Coupon Code
```javascript
// 3-20 characters, uppercase letters and numbers only
✅ Valid:   "SAVE20", "WINTER2024", "VIP"
❌ Invalid: "save20" (lowercase - will be auto-converted)
❌ Invalid: "save@20" (special characters)
❌ Invalid: "AB" (too short)
```

#### Shipping Cost
```javascript
// Float between 0 and 999.99
✅ Valid:   0, 5.99, 100.00, 999.99
❌ Invalid: -5, 1000, 9999.99
```

---

### Business Rules Validation

#### Cart Size Limit
```javascript
// Maximum 50 unique items in cart
Current items: 49
Adding: 1 new item
Result: ✅ Allowed (50 total)

Current items: 50
Adding: 1 new item
Result: ❌ Rejected (would be 51)

Current items: 49
Adding to existing item (quantity update)
Result: ✅ Allowed (still 49 unique items)
```

#### Order Amount Limits
```javascript
// Minimum: $1, Maximum: $99,999.99
Cart Total: $0.50     → ❌ Below minimum
Cart Total: $50.00    → ✅ Valid
Cart Total: $100,000  → ❌ Exceeds maximum
```

#### Stock Availability
```javascript
// Must have sufficient stock
Available: 10
Requested: 5
Result: ✅ Allowed

Available: 3
Requested: 5
Result: ❌ Insufficient stock

Available: 0
Requested: 1
Result: ❌ Out of stock
```

---

## 🎯 Enhanced Features

### 1. Low Stock Warnings

When stock is ≤ 5 units, warnings are included in responses:

```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cart": { ... },
    "warning": {
      "warning": true,
      "message": "Only 3 left in stock",
      "available": 3
    }
  }
}
```

**Frontend Usage:**
```javascript
if (response.data.warning) {
  showNotification(response.data.warning.message, 'warning');
  // Display: "Only 3 left in stock"
}
```

---

### 2. Alternative Variant Suggestions

When requested variant is out of stock, suggest alternatives:

```json
{
  "available": false,
  "alternatives": [
    {
      "variantId": "673c...",
      "size": "L",
      "color": "Black",
      "stock": 15,
      "lowStock": false
    },
    {
      "variantId": "673c...",
      "size": "M",
      "color": "Navy",
      "stock": 4,
      "lowStock": true
    }
  ]
}
```

**Frontend Usage:**
```javascript
if (!response.data.available && response.data.alternatives.length > 0) {
  showAlternativeDialog(response.data.alternatives);
  // "Size M is out of stock. Try these alternatives:"
  // - Size L (15 in stock)
  // - Size M Navy (only 4 left!)
}
```

---

### 3. Comprehensive Checkout Validation

Before proceeding to payment:

```javascript
const validateCheckout = async () => {
  const response = await fetch('/api/cart/validate/checkout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!data.data.valid) {
    // Show issues
    data.data.issues.forEach(issue => {
      console.error(issue.message);
    });
    return false;
  }
  
  if (data.data.warnings.length > 0) {
    // Show warnings but allow to proceed
    const proceed = confirm(
      `${data.data.warnings.length} item(s) have low stock. Continue?`
    );
    return proceed;
  }
  
  return true;
};
```

---

## 🧪 Testing

### Automated Test Script

```bash
cd Muted-Age-server
./test-chapter-3.3.sh
```

### Test Coverage

**Input Validation Tests:**
- ✅ Valid quantity (1-99)
- ✅ Negative quantity rejection
- ✅ Quantity > 99 rejection
- ✅ Invalid product ID format
- ✅ Invalid variant ID format
- ✅ Valid coupon code (auto-uppercase)
- ✅ Invalid coupon format
- ✅ Negative shipping cost
- ✅ Shipping cost > 999.99
- ✅ Missing required fields

**Stock Validation Tests:**
- ✅ Sufficient stock
- ✅ Insufficient stock detection
- ✅ Out of stock detection
- ✅ High quantity rejection
- ✅ Alternative variant suggestions
- ✅ Low stock warnings

**Business Rules Tests:**
- ✅ Cart size limit (50 items)
- ✅ Order amount limits
- ✅ Product active status check
- ✅ Variant existence check

**Checkout Validation Tests:**
- ✅ Empty cart rejection
- ✅ Valid cart approval
- ✅ Cart with warnings
- ✅ Cart with issues

---

## 🔄 Integration with Existing Endpoints

All existing cart endpoints now include validation:

### POST /api/cart/items
**New Validations:**
- ✅ Product ID format
- ✅ Variant ID format
- ✅ Quantity range (1-99)
- ✅ Stock availability
- ✅ Cart size limit
- ✅ Low stock warnings

### PUT /api/cart/items/:itemId
**New Validations:**
- ✅ Item ID format
- ✅ Quantity range (0-99)
- ✅ Stock availability (if increasing)

### POST /api/cart/coupon
**New Validations:**
- ✅ Coupon code format
- ✅ Auto-uppercase normalization
- ✅ 3-20 character length
- ✅ Alphanumeric only

### PUT /api/cart/shipping
**New Validations:**
- ✅ Shipping cost range (0-999.99)
- ✅ Numeric type

---

## 📊 Validation Error Responses

### Format Validation Errors

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "productId",
      "message": "Invalid product ID format"
    },
    {
      "field": "quantity",
      "message": "Quantity must be between 1 and 99"
    }
  ]
}
```

### Business Logic Errors

```json
{
  "success": false,
  "error": "Insufficient stock. Only 5 available"
}
```

```json
{
  "success": false,
  "error": "Cart cannot contain more than 50 unique items"
}
```

---

## 💡 Best Practices

### 1. Frontend Validation

Pre-validate on frontend before API calls:

```javascript
// Check quantity before adding
if (quantity < 1 || quantity > 99) {
  showError('Quantity must be between 1 and 99');
  return;
}

// Check stock before adding
const stockCheck = await fetch(
  `/api/cart/check-stock/${productId}/${variantId}?quantity=${quantity}`
);
const stockData = await stockCheck.json();

if (!stockData.data.available) {
  if (stockData.data.alternatives.length > 0) {
    showAlternatives(stockData.data.alternatives);
  } else {
    showError('Out of stock');
  }
  return;
}

// Proceed to add to cart
addToCart(productId, variantId, quantity);
```

### 2. Comprehensive Checkout Flow

```javascript
const checkout = async () => {
  // Step 1: Validate cart
  const validation = await validateCheckout();
  
  if (!validation.valid) {
    showErrors(validation.issues);
    return;
  }
  
  // Step 2: Show warnings if any
  if (validation.warnings.length > 0) {
    const proceed = await showWarningsDialog(validation.warnings);
    if (!proceed) return;
  }
  
  // Step 3: Proceed to payment
  redirectToPayment();
};
```

### 3. Real-time Stock Checking

```javascript
// Check stock when user changes quantity
const handleQuantityChange = async (itemId, newQuantity) => {
  if (newQuantity > 99) {
    showError('Maximum 99 items per product');
    return;
  }
  
  // Update cart with validation
  try {
    await updateCartItem(itemId, newQuantity);
  } catch (error) {
    if (error.message.includes('Insufficient stock')) {
      const available = extractAvailableStock(error.message);
      showError(`Only ${available} available. Quantity updated.`);
      await updateCartItem(itemId, available);
    }
  }
};
```

---

## 🚨 Common Validation Scenarios

### Scenario 1: Adding Out of Stock Item

**Request:**
```bash
POST /api/cart/items
{
  "productId": "673c...",
  "variantId": "673c...",
  "quantity": 5
}
```

**Response:**
```json
{
  "success": false,
  "error": "Insufficient stock. Only 2 available"
}
```

**Frontend Handling:**
```javascript
if (error.message.includes('Insufficient stock')) {
  const available = extractNumber(error.message);
  
  // Suggest adding available quantity
  const addAvailable = confirm(
    `Only ${available} in stock. Add ${available} instead?`
  );
  
  if (addAvailable) {
    addToCart(productId, variantId, available);
  }
}
```

---

### Scenario 2: Low Stock Warning

**Request:**
```bash
POST /api/cart/items
{
  "productId": "673c...",
  "variantId": "673c...",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cart": { ... },
    "warning": {
      "warning": true,
      "message": "Only 4 left in stock",
      "available": 4
    }
  }
}
```

**Frontend Handling:**
```javascript
if (response.data.warning) {
  showToast(response.data.warning.message, 'warning');
  // Show badge on product: "Low Stock"
}
```

---

### Scenario 3: Alternative Variants

**Request:**
```bash
GET /api/cart/check-stock/673c.../673c...?quantity=10
```

**Response:**
```json
{
  "success": true,
  "message": "Stock unavailable",
  "data": {
    "available": false,
    "stock": 2,
    "alternatives": [
      { "variantId": "...", "size": "L", "stock": 15 },
      { "variantId": "...", "size": "XL", "stock": 8 }
    ]
  }
}
```

**Frontend Handling:**
```javascript
if (!data.available && data.alternatives.length > 0) {
  const modal = showModal({
    title: 'Size M is out of stock',
    message: 'Try these alternatives:',
    alternatives: data.alternatives.map(alt => ({
      label: `Size ${alt.size} (${alt.stock} in stock)`,
      onClick: () => selectVariant(alt.variantId)
    }))
  });
}
```

---

## 📈 Performance Considerations

### 1. Caching Stock Data

```javascript
// Cache stock checks for 5 minutes
const stockCache = new Map();

const checkStock = async (productId, variantId, quantity) => {
  const cacheKey = `${productId}:${variantId}:${quantity}`;
  const cached = stockCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.data;
  }
  
  const data = await fetchStockCheck(productId, variantId, quantity);
  stockCache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
};
```

### 2. Batch Validation

Instead of validating each item individually during checkout:

```javascript
// ✅ Good: Single comprehensive validation
POST /api/cart/validate/checkout

// ❌ Avoid: Multiple individual checks
GET /api/cart/check-stock/... (for each item)
```

---

## ✅ Completion Checklist

- [x] Input validators with express-validator
- [x] Validation utility class
- [x] Stock validation logic
- [x] Low stock warnings
- [x] Alternative variant suggestions
- [x] Quantity limits (1-99)
- [x] Cart size limit (50 items)
- [x] Order amount limits
- [x] Coupon code validation
- [x] Shipping cost validation
- [x] Comprehensive checkout validation endpoint
- [x] Stock check endpoint
- [x] Integration with existing cart endpoints
- [x] Test script
- [x] Documentation

---

## 🎉 Summary

Chapter 3.3 successfully implements a comprehensive validation system:
- **Input Validation** with express-validator
- **Business Rules** enforcement
- **Stock Validation** with real-time checks
- **Low Stock Warnings** for better UX
- **Alternative Suggestions** when out of stock
- **Pre-Checkout Validation** with detailed feedback
- **2 New Endpoints** for enhanced validation
- **All Existing Endpoints** upgraded with validation

All validation features tested and working correctly! ✨

---

**Next Steps:**
- Chapter 4.1: Order Model
- Chapter 4.2: Payment Integration (Stripe)
- Chapter 4.3: Order Management API

---

**Created:** November 25, 2025  
**Author:** Droid AI  
**Chapter:** 3.3 - Cart Validation System
