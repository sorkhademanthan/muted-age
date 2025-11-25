# Phase 3: Shopping Cart - Easy Testing Guide 🛒

## 📋 Overview

This guide walks you through testing the complete shopping cart system step-by-step. Perfect for beginners and quick validation!

**What You'll Test:**
- ✅ Adding items to cart
- ✅ Updating quantities
- ✅ Applying coupons
- ✅ Checking stock
- ✅ Validating before checkout

**Time Required:** 15-20 minutes  
**Prerequisites:** Server running, Admin account created

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start Server
```bash
cd Muted-Age-server
npm start
```

**Expected:** Server running on port 5000 ✅

### Step 2: Get Admin Token
**Postman/Thunder Client:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

Body:
{
  "email": "admin@mutedage.com",
  "password": "Admin@123456"
}
```

**Copy the token** from response! 📋

### Step 3: Run Automated Tests
```bash
# Test everything
./test-chapter-3.2.sh && ./test-chapter-3.3.sh
```

**If all tests pass ✅, you're done! Skip to [Verify Results](#verify-results)**

---

## 🧪 Manual Testing (If You Prefer)

### Test 1: Get Empty Cart (2 min)

**Request:**
```
GET http://localhost:5000/api/cart
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [],
      "total": 0,
      "itemCount": 0
    }
  }
}
```

✅ **Pass:** Empty cart returned  
❌ **Fail:** Check authentication token

---

### Test 2: Add Item to Cart (3 min)

**Step 2.1:** Get a product ID
```
GET http://localhost:5000/api/products
```

**Copy the first product's `_id` and first variant's `_id`**

**Step 2.2:** Add to cart
```
POST http://localhost:5000/api/cart/items
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

Body:
{
  "productId": "PASTE_PRODUCT_ID",
  "variantId": "PASTE_VARIANT_ID",
  "quantity": 2
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cart": {
      "items": [{ "quantity": 2, ... }],
      "itemCount": 2,
      "total": 64.78
    }
  }
}
```

✅ **Pass:** Item added, total calculated  
❌ **Fail:** Check product/variant IDs are valid

**💡 Tip:** If you see a warning like "Only 3 left in stock", that's good! Validation is working.

---

### Test 3: Update Quantity (2 min)

**Copy the item `_id` from cart response above**

```
PUT http://localhost:5000/api/cart/items/ITEM_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

Body:
{
  "quantity": 5
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "cart": {
      "itemCount": 5,
      "total": 161.95
    }
  }
}
```

✅ **Pass:** Quantity updated, total recalculated  
❌ **Fail:** Check item ID is correct

---

### Test 4: Apply Coupon (2 min)

```
POST http://localhost:5000/api/cart/coupon
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

Body:
{
  "couponCode": "SAVE10"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "cart": {
      "couponCode": "SAVE10",
      "discount": 14.99,
      "total": 146.96
    }
  }
}
```

✅ **Pass:** Coupon applied, discount calculated, total reduced  
❌ **Fail:** Make sure cart has items

**💡 Note:** Coupon automatically converts to uppercase ("save10" → "SAVE10")

---

### Test 5: Check Stock (3 min)

```
GET http://localhost:5000/api/cart/check-stock/PRODUCT_ID/VARIANT_ID?quantity=2
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (Stock Available):**
```json
{
  "success": true,
  "message": "Stock available",
  "data": {
    "available": true,
    "stock": 25,
    "requested": 2,
    "product": {
      "name": "Classic T-Shirt",
      "price": 29.99
    }
  }
}
```

✅ **Pass:** Stock info returned  
❌ **Fail:** Check product/variant IDs

**💡 Try:** Change quantity to 100 to see "Stock unavailable" response with alternatives!

---

### Test 6: Validate for Checkout (2 min)

```
POST http://localhost:5000/api/cart/validate/checkout
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Cart is ready for checkout",
  "data": {
    "valid": true,
    "warnings": [],
    "cart": {
      "itemCount": 5,
      "total": 146.96
    }
  }
}
```

✅ **Pass:** Cart validated successfully  
❌ **Fail:** Check cart has items and stock is available

---

### Test 7: Clear Cart (1 min)

```
DELETE http://localhost:5000/api/cart
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "cart": {
      "items": [],
      "total": 0
    }
  }
}
```

✅ **Pass:** Cart emptied  
❌ **Fail:** Check authentication

---

## 🎯 Verify Results

### Check 1: Database
```bash
# Connect to MongoDB
mongosh

# Switch to database
use test  # or your database name

# Check carts collection
db.carts.find().pretty()
```

**You should see:**
- ✅ Cart document for your user
- ✅ Items array with products
- ✅ Calculated totals
- ✅ Timestamps

---

### Check 2: Server Logs

Look for in terminal:
```
POST /api/cart/items 201 45.123 ms - 1234
PUT /api/cart/items/:itemId 200 32.456 ms - 987
POST /api/cart/coupon 200 28.789 ms - 1098
```

✅ **Good:** Status 200/201  
❌ **Bad:** Status 400/404/500

---

## 🐛 Troubleshooting

### Issue 1: "Unauthorized" Error
**Problem:** Token expired or invalid  
**Solution:**
```bash
# Login again to get fresh token
POST /api/auth/login
{
  "email": "admin@mutedage.com",
  "password": "Admin@123456"
}
```

---

### Issue 2: "Product not found"
**Problem:** Invalid product ID  
**Solution:**
```bash
# Get valid product IDs
GET /api/products

# Copy _id from response
```

---

### Issue 3: "Variant not found"
**Problem:** Using image ID instead of variant ID  
**Solution:**
```json
// ❌ Wrong: Using image._id
"variantId": "69244c2f87c900a44c23ff0c"

// ✅ Correct: Using variants[0]._id
"variantId": "69215bf0f4a335fbc18c8c5b"
```

**How to find:** In product response, look under `"variants"` array, not `"images"` array

---

### Issue 4: "Insufficient stock"
**Problem:** Requesting more than available  
**Solution:**
```bash
# Check stock first
GET /api/cart/check-stock/:productId/:variantId?quantity=10

# Response will show available stock
{
  "stock": 5,
  "requested": 10
}

# Adjust quantity to available amount
```

---

### Issue 5: "Item not found in cart"
**Problem:** Using product ID instead of cart item ID  
**Solution:**
```json
// ❌ Wrong: Using product _id
PUT /api/cart/items/69215bf0f4a335fbc18c8c59

// ✅ Correct: Using cart item _id
PUT /api/cart/items/692568d9b4b55433c541036a

// Get correct ID from cart response:
GET /api/cart
// Look for: cart.items[0]._id
```

---

## 📊 Test Checklist

Use this to track your progress:

### Basic Operations
- [ ] Get empty cart
- [ ] Add item to cart
- [ ] Get cart with items
- [ ] Update item quantity
- [ ] Remove item from cart
- [ ] Clear entire cart

### Coupon & Shipping
- [ ] Apply coupon code
- [ ] Remove coupon
- [ ] Update shipping cost

### Validation
- [ ] Check stock availability
- [ ] Validate cart for checkout
- [ ] Test insufficient stock error
- [ ] Test invalid quantity (negative)
- [ ] Test invalid quantity (> 99)
- [ ] Test invalid coupon format

### Advanced
- [ ] Add same item twice (should merge)
- [ ] Low stock warning appears
- [ ] Alternative variants suggested
- [ ] Cart totals calculate correctly
- [ ] Cart expires after 7 days

---

## 🎓 Understanding Responses

### Success Response Structure
```json
{
  "success": true,          // Operation succeeded
  "message": "...",         // Human-readable message
  "data": {                 // Actual data
    "cart": { ... }
  }
}
```

### Error Response Structure
```json
{
  "success": false,         // Operation failed
  "error": "...",          // Error message
  "details": [ ... ]       // Validation errors (if any)
}
```

### Cart Object Structure
```json
{
  "_id": "...",            // Cart ID
  "items": [               // Array of items
    {
      "_id": "...",        // Cart item ID (use for update/delete)
      "product": { ... },  // Product details
      "variant": {         // Variant details
        "size": "M",
        "color": "Black"
      },
      "quantity": 2,
      "price": 29.99,
      "subtotal": 59.98
    }
  ],
  "subtotal": 59.98,       // Sum of items
  "tax": 4.80,             // 8% tax
  "shipping": 9.99,        // Shipping cost
  "discount": 0,           // Coupon discount
  "couponCode": null,      // Applied coupon
  "total": 74.77,          // Final total
  "itemCount": 2           // Total quantity
}
```

---

## 💡 Pro Tips

### Tip 1: Save Token as Environment Variable
In Postman:
1. Click "Environments"
2. Create "Muted Age Dev"
3. Add variable: `token` = your token
4. Use `{{token}}` in Authorization header

### Tip 2: Use Postman Tests
Add to "Tests" tab:
```javascript
// Auto-save token from login
pm.environment.set("token", pm.response.json().data.token);

// Auto-save product ID
pm.environment.set("productId", pm.response.json().data[0]._id);

// Auto-save cart item ID
pm.environment.set("itemId", pm.response.json().data.cart.items[0]._id);
```

### Tip 3: Create Postman Collection
Organize requests:
```
Shopping Cart Tests
├── 1. Login (POST auth/login)
├── 2. Get Cart (GET cart)
├── 3. Add Item (POST cart/items)
├── 4. Update Quantity (PUT cart/items/:itemId)
├── 5. Apply Coupon (POST cart/coupon)
├── 6. Check Stock (GET cart/check-stock/:productId/:variantId)
├── 7. Validate Checkout (POST cart/validate/checkout)
└── 8. Clear Cart (DELETE cart)
```

### Tip 4: Quick Test Shortcuts
```bash
# Test everything at once
cd Muted-Age-server
./test-chapter-3.2.sh && ./test-chapter-3.3.sh

# Test only cart API
./test-chapter-3.2.sh

# Test only validation
./test-chapter-3.3.sh
```

---

## 📸 Expected Screenshots

### 1. Empty Cart
![Empty Cart](https://via.placeholder.com/600x200/222222/FFFFFF?text=Empty+Cart:+items:+[],+total:+0)

### 2. Cart with Items
![Cart with Items](https://via.placeholder.com/600x200/222222/FFFFFF?text=Cart+with+Items:+itemCount:+2,+total:+64.78)

### 3. Stock Check Success
![Stock Available](https://via.placeholder.com/600x200/22AA22/FFFFFF?text=Stock+Available:+stock:+25,+available:+true)

### 4. Stock Check Failure
![Stock Unavailable](https://via.placeholder.com/600x200/AA2222/FFFFFF?text=Stock+Unavailable:+alternatives+suggested)

---

## 🎉 Success Criteria

You've successfully tested Phase 3 when:
- ✅ All automated tests pass
- ✅ Can add/update/remove items
- ✅ Totals calculate correctly
- ✅ Coupons apply properly
- ✅ Stock validation works
- ✅ Checkout validation succeeds
- ✅ No errors in server logs
- ✅ Cart persists in database

---

## 📞 Need Help?

### Common Questions

**Q: Where do I find product/variant IDs?**  
A: `GET /api/products` → Look for `_id` and `variants[0]._id`

**Q: What's the difference between product ID and cart item ID?**  
A: Product ID identifies the product catalog entry. Cart item ID identifies an item IN your cart.

**Q: Why does my coupon need to be uppercase?**  
A: It's auto-converted! "save10" becomes "SAVE10" automatically.

**Q: How do I know if stock is low?**  
A: Look for `warning` field in response when adding items.

**Q: Can I test without Postman?**  
A: Yes! Use the automated test scripts: `./test-chapter-3.2.sh`

---

## 📚 Next Steps

After testing Phase 3:
1. ✅ Review test results
2. ✅ Check detailed documentation:
   - [Chapter 3.1: Cart Model](./chapter-3.1-cart-model.md)
   - [Chapter 3.2: Cart API](./chapter-3.2-cart-api.md)
   - [Chapter 3.3: Validation](./chapter-3.3-cart-validation.md)
3. ✅ Commit your changes
4. ✅ Move to Phase 4: Order Processing

---

**Happy Testing! 🚀**

**Estimated Time:** 15-20 minutes  
**Difficulty:** Easy  
**Prerequisites:** Server running, Admin account

**Questions?** Check the detailed chapter documentation or run automated tests!
