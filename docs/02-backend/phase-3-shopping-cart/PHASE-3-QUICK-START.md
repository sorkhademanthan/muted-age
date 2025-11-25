# Phase 3: Shopping Cart - Quick Start Guide ⚡

## 🎯 Test in 5 Minutes!

### Prerequisites
- ✅ Server running on port 5000
- ✅ Admin account created

---

## 🚀 Method 1: Automated Testing (Recommended)

```bash
cd Muted-Age-server
./test-chapter-3.2.sh && ./test-chapter-3.3.sh
```

**That's it!** If tests pass ✅, everything works!

---

## 📱 Method 2: Postman/Thunder Client

### Step 1: Login (30 seconds)
```
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@mutedage.com", "password": "Admin@123456" }
```
**→ Copy token**

### Step 2: Get Products (15 seconds)
```
GET http://localhost:5000/api/products
```
**→ Copy first product's `_id` and first variant's `_id`**

### Step 3: Add to Cart (30 seconds)
```
POST http://localhost:5000/api/cart/items
Authorization: Bearer YOUR_TOKEN
Body: {
  "productId": "PASTE_HERE",
  "variantId": "PASTE_HERE",
  "quantity": 2
}
```
**→ See cart with calculated total**

### Step 4: Apply Coupon (15 seconds)
```
POST http://localhost:5000/api/cart/coupon
Authorization: Bearer YOUR_TOKEN
Body: { "couponCode": "SAVE10" }
```
**→ See discount applied**

### Step 5: Validate (15 seconds)
```
POST http://localhost:5000/api/cart/validate/checkout
Authorization: Bearer YOUR_TOKEN
```
**→ See "Cart is ready for checkout"**

**Done! ✅ Total time: ~2 minutes**

---

## 📋 All Endpoints Cheat Sheet

```bash
# CART OPERATIONS
GET    /api/cart                              # Get cart
POST   /api/cart/items                        # Add item
PUT    /api/cart/items/:itemId                # Update quantity
DELETE /api/cart/items/:itemId                # Remove item
DELETE /api/cart                              # Clear cart

# COUPON & SHIPPING
POST   /api/cart/coupon                       # Apply coupon
DELETE /api/cart/coupon                       # Remove coupon
PUT    /api/cart/shipping                     # Update shipping

# VALIDATION
POST   /api/cart/validate                     # Basic validation
POST   /api/cart/validate/checkout            # Full validation
GET    /api/cart/check-stock/:productId/:variantId  # Check stock
```

---

## 💡 Quick Tips

### Get IDs Easily
```bash
# Get product & variant IDs
curl http://localhost:5000/api/products | python3 -m json.tool | grep "_id" | head -5
```

### Test Everything
```bash
# All tests
./test-chapter-3.2.sh && ./test-chapter-3.3.sh

# Just cart
./test-chapter-3.2.sh

# Just validation  
./test-chapter-3.3.sh
```

### Common Mistakes
```json
// ❌ Wrong: Using image ID
"variantId": "69244c2f87c900a44c23ff0c"

// ✅ Right: Using variant ID (from variants array)
"variantId": "69215bf0f4a335fbc18c8c5b"

// ❌ Wrong: Using product ID for update
PUT /api/cart/items/69215bf0f4a335fbc18c8c59

// ✅ Right: Using cart item ID
PUT /api/cart/items/692568d9b4b55433c541036a
```

---

## 🎯 Success Checklist

- [ ] Login works → Token received
- [ ] Add item → Total calculated
- [ ] Update quantity → Total recalculated
- [ ] Apply coupon → Discount applied
- [ ] Check stock → Stock info returned
- [ ] Validate → "Ready for checkout"
- [ ] Clear cart → Empty cart returned

**All checked?** You're done! ✅

---

## 🐛 Quick Troubleshooting

| Error | Solution |
|-------|----------|
| "Unauthorized" | Re-login to get fresh token |
| "Product not found" | Use `GET /api/products` to get valid ID |
| "Variant not found" | Use ID from `variants` array, not `images` |
| "Insufficient stock" | Check stock with `/check-stock` endpoint |
| "Item not found" | Use cart item `_id` from `GET /api/cart` |

---

## 📚 Need More Details?

- **Testing Guide:** [PHASE-3-TESTING-GUIDE.md](./PHASE-3-TESTING-GUIDE.md)
- **Cart Model:** [chapter-3.1-cart-model.md](./chapter-3.1-cart-model.md)
- **Cart API:** [chapter-3.2-cart-api.md](./chapter-3.2-cart-api.md)
- **Validation:** [chapter-3.3-cart-validation.md](./chapter-3.3-cart-validation.md)

---

**Quick Start Complete!** 🎉  
**Time Spent:** ~5 minutes  
**Features Tested:** 11 endpoints, stock validation, coupons, checkout

**Ready for Phase 4!** 🚀
