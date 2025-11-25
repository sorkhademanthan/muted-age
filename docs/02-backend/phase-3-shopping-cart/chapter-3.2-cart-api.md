# Chapter 3.2: Cart API Routes

## Overview
Complete Cart API implementation with CRUD operations, coupon management, shipping updates, and stock validation.

---

## 📦 Features Implemented

### 1. **Cart Management**
- Get user's active cart
- Automatic cart creation on first access
- Populated product details in responses
- Cart expiration handling (7 days)

### 2. **Item Operations**
- Add items to cart with stock validation
- Update item quantities
- Remove individual items
- Clear entire cart
- Automatic duplicate item merging

### 3. **Pricing Features**
- Apply discount coupons
- Remove coupons
- Update shipping costs
- Automatic tax calculation
- Real-time total updates

### 4. **Validation**
- Stock availability checks
- Product and variant validation
- Cart readiness for checkout
- Detailed error reporting

---

## 🗂️ API Endpoints

### Base URL
```
http://localhost:5000/api/cart
```

### Authentication
All cart endpoints require user authentication via Bearer token in the Authorization header.

---

## 📋 Endpoint Details

### 1. Get User's Cart

**GET** `/api/cart`

Get the authenticated user's active cart with populated product details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "cart": {
      "_id": "673c1234567890abcdef1234",
      "items": [
        {
          "_id": "673c5678901234abcdef5678",
          "product": {
            "_id": "673c9012345678abcdef9012",
            "name": "Classic T-Shirt",
            "slug": "classic-t-shirt",
            "brand": "Muted Age",
            "price": 29.99,
            "images": [...]
          },
          "variant": {
            "variantId": "673c3456789012abcdef3456",
            "size": "M",
            "color": "Black",
            "sku": "TSH-M-BLK"
          },
          "quantity": 2,
          "price": 29.99,
          "subtotal": 59.98
        }
      ],
      "subtotal": 59.98,
      "tax": 4.80,
      "taxRate": 0.08,
      "shipping": 9.99,
      "discount": 0,
      "couponCode": null,
      "total": 74.77,
      "itemCount": 2,
      "expiresAt": "2025-12-02T10:00:00.000Z",
      "status": "active"
    }
  }
}
```

**Notes:**
- Creates new cart if user doesn't have an active one
- Populates product details (name, images, price, etc.)
- Returns complete pricing breakdown

---

### 2. Add Item to Cart

**POST** `/api/cart/items`

Add a product variant to the cart. If the same product+variant exists, quantities are merged.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "productId": "673c9012345678abcdef9012",
  "variantId": "673c3456789012abcdef3456",
  "quantity": 2
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cart": {
      "_id": "673c1234567890abcdef1234",
      "items": [...],
      "subtotal": 59.98,
      "tax": 4.80,
      "shipping": 0,
      "discount": 0,
      "total": 64.78,
      "itemCount": 2
    }
  }
}
```

**Validation:**
- ✅ Product must exist and be active
- ✅ Variant must exist
- ✅ Sufficient stock available
- ✅ Quantity must be at least 1

**Error Responses:**

404 - Product not found:
```json
{
  "success": false,
  "error": "Product not found or unavailable"
}
```

404 - Variant not found:
```json
{
  "success": false,
  "error": "Variant not found"
}
```

400 - Insufficient stock:
```json
{
  "success": false,
  "error": "Insufficient stock. Only 5 available"
}
```

---

### 3. Update Item Quantity

**PUT** `/api/cart/items/:itemId`

Update the quantity of a cart item. Set quantity to 0 to remove the item.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `itemId` - Cart item ID (not product ID)

**Body:**
```json
{
  "quantity": 5
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "cart": {
      "_id": "673c1234567890abcdef1234",
      "items": [...],
      "subtotal": 149.95,
      "tax": 12.00,
      "shipping": 0,
      "discount": 0,
      "total": 161.95,
      "itemCount": 5
    }
  }
}
```

**Special Cases:**
- Setting quantity to 0 removes the item
- Stock validation occurs before update
- Response message changes based on action

**Error Responses:**

404 - Item not found:
```json
{
  "success": false,
  "error": "Item not found in cart"
}
```

400 - Insufficient stock:
```json
{
  "success": false,
  "error": "Insufficient stock. Only 3 available"
}
```

---

### 4. Remove Item from Cart

**DELETE** `/api/cart/items/:itemId`

Remove a specific item from the cart.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `itemId` - Cart item ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": {
    "cart": {
      "_id": "673c1234567890abcdef1234",
      "items": [],
      "subtotal": 0,
      "tax": 0,
      "shipping": 0,
      "discount": 0,
      "total": 0,
      "itemCount": 0
    }
  }
}
```

**Error Responses:**

404 - Item not found:
```json
{
  "success": false,
  "error": "Item not found in cart"
}
```

---

### 5. Clear Cart

**DELETE** `/api/cart`

Remove all items from the cart and reset pricing.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "cart": {
      "_id": "673c1234567890abcdef1234",
      "items": [],
      "subtotal": 0,
      "tax": 0,
      "shipping": 0,
      "discount": 0,
      "total": 0,
      "itemCount": 0
    }
  }
}
```

**Notes:**
- Clears all items
- Removes coupon and discount
- Resets shipping to 0
- Cart itself is not deleted, just emptied

---

### 6. Apply Coupon

**POST** `/api/cart/coupon`

Apply a discount coupon to the cart.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "couponCode": "SAVE10"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "cart": {
      "_id": "673c1234567890abcdef1234",
      "items": [...],
      "subtotal": 59.98,
      "tax": 4.79,
      "shipping": 0,
      "discount": 6.00,
      "couponCode": "SAVE10",
      "total": 58.77,
      "itemCount": 2
    }
  }
}
```

**Notes:**
- Currently applies 10% discount as placeholder
- TODO: Implement full coupon validation system
- Discount is applied before tax calculation
- Replaces any existing coupon

**Error Responses:**

400 - Empty cart:
```json
{
  "success": false,
  "error": "Cannot apply coupon to empty cart"
}
```

400 - Missing coupon code:
```json
{
  "success": false,
  "error": "Coupon code is required"
}
```

---

### 7. Remove Coupon

**DELETE** `/api/cart/coupon`

Remove the applied coupon from the cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Coupon removed successfully",
  "data": {
    "cart": {
      "_id": "673c1234567890abcdef1234",
      "items": [...],
      "subtotal": 59.98,
      "tax": 4.80,
      "shipping": 0,
      "discount": 0,
      "couponCode": null,
      "total": 64.78,
      "itemCount": 2
    }
  }
}
```

**Notes:**
- Removes coupon code
- Resets discount to 0
- Recalculates totals

---

### 8. Update Shipping Cost

**PUT** `/api/cart/shipping`

Update the shipping cost for the cart.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "shippingCost": 9.99
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shipping cost updated successfully",
  "data": {
    "cart": {
      "_id": "673c1234567890abcdef1234",
      "items": [...],
      "subtotal": 59.98,
      "tax": 4.80,
      "shipping": 9.99,
      "discount": 0,
      "total": 74.77,
      "itemCount": 2
    }
  }
}
```

**Notes:**
- Shipping is added after tax
- Set to 0 for free shipping
- Minimum value: 0

**Error Responses:**

400 - Negative shipping:
```json
{
  "success": false,
  "error": "Shipping cost cannot be negative"
}
```

---

### 9. Validate Cart

**POST** `/api/cart/validate`

Validate cart items for stock availability before checkout.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK) - Valid Cart:**
```json
{
  "success": true,
  "message": "Cart is valid and ready for checkout",
  "data": {
    "valid": true,
    "cart": {
      "_id": "673c1234567890abcdef1234",
      "itemCount": 2,
      "total": 74.77
    }
  }
}
```

**Response (400 Bad Request) - Issues Found:**
```json
{
  "success": true,
  "message": "Cart validation failed",
  "data": {
    "valid": false,
    "issues": [
      {
        "itemId": "673c5678901234abcdef5678",
        "productName": "Classic T-Shirt",
        "size": "M",
        "requested": 10,
        "available": 5,
        "issue": "Insufficient stock"
      },
      {
        "itemId": "673c5678901234abcdef5679",
        "productName": "Vintage Hoodie",
        "issue": "Product not available"
      }
    ]
  }
}
```

**Validation Checks:**
- ✅ Product exists and is active
- ✅ Variant exists
- ✅ Sufficient stock available for each item

**Error Responses:**

400 - Empty cart:
```json
{
  "success": false,
  "error": "Cart is empty"
}
```

404 - No cart:
```json
{
  "success": false,
  "error": "Cart not found"
}
```

---

## 🔐 Security Features

### Authentication Required
- All endpoints require valid JWT token
- User can only access their own cart
- Admin privileges not required

### Data Validation
- Stock checks before adding/updating
- Product and variant existence validation
- Quantity and pricing constraints
- Cart ownership verification

### Price Protection
- Prices stored at time of adding
- Prevents manipulation via client
- Server-side total calculation
- Automatic tax and discount computation

---

## 💡 Key Features

### Automatic Cart Creation
```javascript
// First time user accesses cart
GET /api/cart
// → Creates new active cart automatically
```

### Duplicate Item Merging
```javascript
// Add same product+variant twice
POST /api/cart/items { productId: "A", variantId: "B", quantity: 2 }
POST /api/cart/items { productId: "A", variantId: "B", quantity: 3 }
// → Single cart item with quantity: 5
```

### Cart Expiration
- Carts expire after 7 days of inactivity
- Expiration resets on any cart action
- MongoDB TTL index for auto-cleanup
- Manual cleanup available via Cart.cleanupExpiredCarts()

### Real-time Calculations
- Subtotal = sum(item.price × item.quantity)
- Discount applied to subtotal
- Tax = (subtotal - discount) × taxRate
- Total = subtotal - discount + tax + shipping

### Stock Validation
```javascript
// Before adding/updating
1. Check product exists and is active
2. Check variant exists
3. Verify variant.stock >= requested quantity
```

---

## 🧪 Testing

### Automated Test Script
```bash
cd Muted-Age-server
./test-chapter-3.2.sh
```

### Test Coverage
- ✅ Get empty cart
- ✅ Add item to cart
- ✅ Add duplicate item (merge)
- ✅ Update item quantity
- ✅ Apply coupon
- ✅ Update shipping
- ✅ Validate cart
- ✅ Remove coupon
- ✅ Remove item
- ✅ Clear cart
- ✅ Unauthorized access (blocked)
- ✅ Invalid product (rejected)
- ✅ Empty cart coupon (blocked)

### Manual Testing with Postman

See: `docs/POSTMAN-TESTING-GUIDE-CART-API.md` (to be created)

Quick test flow:
1. Login to get token
2. GET /api/cart → Get empty cart
3. POST /api/cart/items → Add item
4. GET /api/cart → Verify item added
5. PUT /api/cart/shipping → Set shipping
6. POST /api/cart/coupon → Apply coupon
7. POST /api/cart/validate → Validate
8. DELETE /api/cart → Clear cart

---

## 🔄 Integration with Cart Model

### Model Methods Used

```javascript
// From Cart.js model
Cart.getActiveCart(userId)          // Get/create cart
cart.addItem(product, variant, qty) // Add item
cart.updateItemQuantity(id, qty)    // Update quantity
cart.removeItem(id)                 // Remove item
cart.clearCart()                    // Clear all
cart.applyCoupon(code, amount)      // Apply coupon
cart.removeCoupon()                 // Remove coupon
cart.updateShipping(cost)           // Set shipping
cart.checkStock()                   // Validate stock
cart.getPopulatedCart()             // Populate products
cart.calculateTotals()              // Auto on save
```

### Automatic Behaviors
- `calculateTotals()` runs before every save
- Expiration resets on every cart action
- Duplicate items auto-merge
- Item removal when quantity set to 0

---

## 📊 Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Action description",
  "data": {
    "cart": { ... }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack trace (development only)"
}
```

### Cart Object
```json
{
  "_id": "string",
  "items": [CartItem],
  "subtotal": "number",
  "tax": "number",
  "taxRate": "number",
  "shipping": "number",
  "discount": "number",
  "couponCode": "string|null",
  "total": "number",
  "itemCount": "number",
  "expiresAt": "date",
  "status": "string"
}
```

### Cart Item Object
```json
{
  "_id": "string",
  "product": {
    "_id": "string",
    "name": "string",
    "brand": "string",
    "price": "number",
    "images": [...]
  },
  "variant": {
    "variantId": "string",
    "size": "string",
    "color": "string",
    "sku": "string"
  },
  "quantity": "number",
  "price": "number",
  "subtotal": "number"
}
```

---

## 🚨 Common Issues & Solutions

### Issue: "Cart not found"
**Solution:**
- First call to GET /api/cart creates the cart
- Ensure authentication token is valid
- Check user ID is correct

### Issue: "Variant not found"
**Solution:**
- Verify variantId is correct (use _id from variants array)
- Check product has variants
- Ensure variant hasn't been deleted

### Issue: "Insufficient stock"
**Solution:**
- Check current stock with GET /api/products/:id
- Request quantity <= variant.stock
- Consider updating to available quantity

### Issue: "Item not found in cart"
**Solution:**
- Use cart item _id (from cart.items[]._ id)
- NOT the product ID or variant ID
- Get current cart first to find correct item ID

### Issue: Totals not updating
**Solution:**
- Totals calculate automatically on save
- Refresh cart with GET /api/cart
- Check calculateTotals() is in pre-save hook

---

## 📈 Performance Considerations

### Optimizations
1. **Single Query Cart**: getActiveCart() finds or creates in one operation
2. **Selective Population**: Only populate needed product fields
3. **Index Usage**: user + status index for fast cart lookup
4. **Batch Operations**: Multiple items can be added individually

### Caching Recommendations
- Cache active carts in Redis (TTL: 1 hour)
- Invalidate cache on any cart modification
- Key format: `cart:${userId}`

### Rate Limiting
- Consider stricter limits on cart operations
- Prevent rapid add/remove attacks
- Default API rate limit: 100 requests per 15 minutes

---

## 🔮 Future Enhancements

### Planned Features
1. **Coupon System**: Full validation with expiration and rules
2. **Saved for Later**: Move items to wishlist
3. **Cart Sharing**: Share cart via URL
4. **Quantity Limits**: Max quantity per item
5. **Bundle Discounts**: Buy together offers
6. **Guest Carts**: Anonymous cart via session ID
7. **Cart Sync**: Merge guest cart on login
8. **Low Stock Warnings**: Alert when < 5 items available
9. **Price Drop Alerts**: Notify if item price decreases
10. **Abandoned Cart**: Email reminders

### API Additions
- GET /api/cart/summary - Quick item count and total
- POST /api/cart/merge - Merge guest cart on login
- POST /api/cart/save-for-later/:itemId - Move to wishlist
- GET /api/cart/share - Generate shareable link

---

## ✅ Completion Checklist

- [x] GET /api/cart endpoint
- [x] POST /api/cart/items endpoint
- [x] PUT /api/cart/items/:itemId endpoint
- [x] DELETE /api/cart/items/:itemId endpoint
- [x] DELETE /api/cart endpoint
- [x] POST /api/cart/coupon endpoint
- [x] DELETE /api/cart/coupon endpoint
- [x] PUT /api/cart/shipping endpoint
- [x] POST /api/cart/validate endpoint
- [x] Authentication on all endpoints
- [x] Stock validation before adding
- [x] Duplicate item merging
- [x] Populated product details
- [x] Error handling
- [x] Test script created
- [x] Routes registered in server.js
- [x] Documentation completed

---

## 🎉 Summary

Chapter 3.2 successfully implements a complete Cart API with:
- **9 RESTful endpoints** for full cart management
- **Authentication** on all routes
- **Stock validation** before adding/updating items
- **Automatic calculations** for pricing
- **Coupon support** with discount application
- **Cart validation** for checkout readiness
- **Comprehensive error handling** with detailed messages
- **Automated testing** with bash script

All endpoints tested and working correctly! ✨

---

**Next Steps:** 
- Chapter 3.3: Advanced cart features (guest carts, cart sync)
- Chapter 4.1: Order Model
- Chapter 4.2: Stripe Payment Integration

---

**Created:** November 25, 2025  
**Author:** Droid AI  
**Chapter:** 3.2 - Cart API Routes
