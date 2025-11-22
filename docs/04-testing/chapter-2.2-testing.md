# 🧪 CHAPTER 2.2: PRODUCT CRUD OPERATIONS - COMPLETE TESTING GUIDE


69215bf0f4a335fbc18c8c5a=test 6
69215b9bf4a335fbc18c8c51=test 7
69215c62f4a335fbc18c8c66= test 8
69215c35f4a335fbc18c8c5f= test 9
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjE1OWUxY2NhYzJlYzNhMTk1ZmQwMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2Mzc5Mzc0MCwiZXhwIjoxNzYzODgwMTQwfQ.ZiTAuMv6QALYOZVSnw5SvK-TM_V1KTqU8vlfI26ZI2w

**Last Updated**: November 22, 2024  
**Version**: 1.0  
**Purpose**: Comprehensive testing guide for Product Management System

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Authentication Setup](#authentication-setup)
4. [Testing Public Endpoints](#testing-public-endpoints)
5. [Testing Admin Endpoints](#testing-admin-endpoints)
6. [Testing Validation & Error Handling](#testing-validation--error-handling)
7. [Testing Advanced Features](#testing-advanced-features)
8. [Expected Results Summary](#expected-results-summary)

---

## 🔧 PREREQUISITES

### Required Tools:
- **curl** (command line) OR **Postman/Thunder Client** (GUI)
- Server running on `http://localhost:5000`
- MongoDB connected

### Check Installation:
```bash
# Check curl is installed
curl --version

# Check server status
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Muted Age Backend Server is running!",
  "environment": "development",
  "timestamp": "2024-11-22T..."
}
```

---

## 🚀 SERVER SETUP

### Step 1: Start the Server
```bash
cd /Users/manthansorkhade/Desktop/website-live-projects/Muted-Age/Muted-Age-server
npm run dev
```

**Look for these messages:**
```
✅ MongoDB connected successfully
📊 Database: muted-age-project
🚀 Server running on port 5000
🌍 Environment: development
🔗 Frontend URL: http://localhost:3000
```

### Step 2: Verify Server is Running
```bash
curl http://localhost:5000/api/health
```

---

## 🔐 AUTHENTICATION SETUP

### Step 1: Create Admin User (First Time Only)

**Option A: Using curl**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@mutedage.com",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "673f...",
      "username": "admin",
      "email": "admin@mutedage.com",
      "role": "user"
    }
  }
}
```

**Note:** The user is created with role "user" by default. You'll need to manually update it to "admin" in MongoDB.

### Step 2: Update User Role to Admin

**Connect to MongoDB and run:**
```javascript
// Using MongoDB Compass or CLI
db.users.updateOne(
  { email: "admin@mutedage.com" },
  { $set: { role: "admin" } }
)
```

**Or using MongoDB CLI:**
```bash
mongosh "mongodb+srv://sorkhademanthan_db_user:manthan12345@muted-age-project.aq2exx5.mongodb.net/?appName=Muted-Age-Project"

use muted-age-project

db.users.updateOne(
  { email: "admin@mutedage.com" },
  { $set: { role: "admin" } }
)
```

### Step 3: Login as Admin and Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mutedage.com",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2Y...",
    "user": {
      "id": "673f...",
      "username": "admin",
      "email": "admin@mutedage.com",
      "role": "admin"
    }
  }
}
```

### Step 4: Save the Token
Copy the token from the response and save it as an environment variable:

```bash
# For testing session
export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2Y..."
```

---

## 🌐 TESTING PUBLIC ENDPOINTS

### Test 1: Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

**✅ Expected:** Status 200, server running message

---

### Test 2: Get All Products (Empty Database)
```bash
curl -X GET http://localhost:5000/api/products
```

**✅ Expected Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalPages": 0,
    "totalItems": 0,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### Test 3: Get Featured Products (Empty)
```bash
curl -X GET http://localhost:5000/api/products/featured
```

**✅ Expected Response:**
```json
{
  "success": true,
  "message": "Featured products retrieved successfully",
  "data": []
}
```

---

### Test 4: Search Products (No Results)
```bash
curl -X GET "http://localhost:5000/api/products/search?q=jacket"
```

**✅ Expected Response:**
```json
{
  "success": true,
  "message": "Found 0 products",
  "data": []
}
```

---

### Test 5: Get Product by Invalid ID
```bash
curl -X GET http://localhost:5000/api/products/invalid-id
```

**✅ Expected Response:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "id",
      "message": "Invalid product ID"
    }
  ]
}
```

---

## 🔒 TESTING ADMIN ENDPOINTS

### Test 6: Create Product #1 - Black Leather Jacket

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Black Leather Jacket",
    "description": "Premium quality black leather jacket with modern design. Perfect for any season.",
    "shortDescription": "Premium black leather jacket",
    "price": 299.99,
    "comparePrice": 399.99,
    "category": "Outerwear",
    "subcategory": "Jackets",
    "tags": ["NEW", "EXCLUSIVE"],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        "alt": "Black Leather Jacket Front",
        "isPrimary": true
      },
      {
        "url": "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504",
        "alt": "Black Leather Jacket Back",
        "isPrimary": false
      }
    ],
    "variants": [
      {
        "size": "S",
        "color": "Black",
        "colorCode": "#000000",
        "sku": "BLJ-001-S",
        "stock": 10
      },
      {
        "size": "M",
        "color": "Black",
        "colorCode": "#000000",
        "sku": "BLJ-001-M",
        "stock": 15
      },
      {
        "size": "L",
        "color": "Black",
        "colorCode": "#000000",
        "sku": "BLJ-001-L",
        "stock": 12
      },
      {
        "size": "XL",
        "color": "Black",
        "colorCode": "#000000",
        "sku": "BLJ-001-XL",
        "stock": 8
      }
    ],
    "materials": ["Genuine Leather", "Cotton Lining"],
    "careInstructions": "Dry clean only. Do not machine wash.",
    "isFeatured": true,
    "isActive": true
  }'
```

**✅ Expected:** Status 201, product created with all fields

---
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjE1OWUxY2NhYzJlYzNhMTk1ZmQwMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2Mzc5Mzc0MCwiZXhwIjoxNzYzODgwMTQwfQ.ZiTAuMv6QALYOZVSnw5SvK-TM_V1KTqU8vlfI26ZI2w
### Test 7: Create Product #2 - White Cotton T-Shirt

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Classic White Cotton T-Shirt",
    "description": "Essential white cotton t-shirt. Comfortable, breathable, and versatile.",
    "shortDescription": "Classic white cotton tee",
    "price": 29.99,
    "category": "Tops",
    "subcategory": "T-Shirts",
    "tags": ["BESTSELLER"],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        "alt": "White Cotton T-Shirt",
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "size": "S",
        "color": "White",
        "colorCode": "#FFFFFF",
        "sku": "WCT-001-S",
        "stock": 25
      },
      {
        "size": "M",
        "color": "White",
        "colorCode": "#FFFFFF",
        "sku": "WCT-001-M",
        "stock": 30
      },
      {
        "size": "L",
        "color": "White",
        "colorCode": "#FFFFFF",
        "sku": "WCT-001-L",
        "stock": 20
      }
    ],
    "materials": ["100% Cotton"],
    "careInstructions": "Machine wash cold. Tumble dry low.",
    "isFeatured": true,
    "isActive": true
  }'
```

---

### Test 8: Create Product #3 - Slim Fit Blue Jeans

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Slim Fit Blue Jeans",
    "description": "Modern slim fit jeans in classic blue denim. Comfortable stretch fabric.",
    "shortDescription": "Slim fit blue denim jeans",
    "price": 79.99,
    "comparePrice": 99.99,
    "category": "Bottoms",
    "subcategory": "Jeans",
    "tags": ["TRENDING"],
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1542272604-787c3835535d",
        "alt": "Blue Jeans Front",
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "size": "S",
        "color": "Blue",
        "colorCode": "#4169E1",
        "sku": "SFJ-001-S",
        "stock": 15
      },
      {
        "size": "M",
        "color": "Blue",
        "colorCode": "#4169E1",
        "sku": "SFJ-001-M",
        "stock": 20
      },
      {
        "size": "L",
        "color": "Blue",
        "colorCode": "#4169E1",
        "sku": "SFJ-001-L",
        "stock": 18
      },
      {
        "size": "XL",
        "color": "Blue",
        "colorCode": "#4169E1",
        "sku": "SFJ-001-XL",
        "stock": 10
      }
    ],
    "materials": ["98% Cotton", "2% Elastane"],
    "careInstructions": "Machine wash cold. Hang dry.",
    "isFeatured": false,
    "isActive": true
  }'
```

---

### Test 9: Create Product #4 - Leather Wallet (Low Stock)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Minimalist Leather Wallet",
    "description": "Slim leather wallet with RFID protection. Holds up to 8 cards.",
    "shortDescription": "Slim leather wallet",
    "price": 49.99,
    "category": "Accessories",
    "subcategory": "Wallets",
    "images": [
      {
        "url": "https://images.unsplash.com/photo-1627123424574-724758594e93",
        "alt": "Leather Wallet",
        "isPrimary": true
      }
    ],
    "variants": [
      {
        "size": "One Size",
        "color": "Brown",
        "colorCode": "#8B4513",
        "sku": "MLW-001-OS",
        "stock": 5
      }
    ],
    "materials": ["Genuine Leather"],
    "careInstructions": "Wipe with soft cloth. Avoid water.",
    "isFeatured": false,
    "isActive": true
  }'
```

---

### Test 10: Get All Products (Now With Data)

```bash
curl -X GET http://localhost:5000/api/products
```

**✅ Expected:** Should return 4 products with pagination info

---

### Test 11: Get Featured Products

```bash
curl -X GET http://localhost:5000/api/products/featured
```

**✅ Expected:** Should return 2 featured products (Leather Jacket, T-Shirt)

---

### Test 12: Update Product Price

Save the product ID from Test 6 response, then:

```bash
# Replace PRODUCT_ID with actual ID from Test 6
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "price": 279.99,
    "comparePrice": 399.99
  }'
```

**✅ Expected:** Product updated with new price

---

### Test 13: Update Product Stock

```bash
# Replace PRODUCT_ID with actual ID
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "size": "M",
    "stock": 25
  }'
```

**✅ Expected:** Stock updated for size M

---

### Test 14: Soft Delete Product

```bash
# Replace PRODUCT_ID with actual ID
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**✅ Expected:** Product marked as inactive (soft deleted)

---

## ⚠️ TESTING VALIDATION & ERROR HANDLING

### Test 15: Create Product Without Authentication

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 100
  }'
```

**✅ Expected:**
```json
{
  "success": false,
  "error": "No token, authorization denied"
}
```

---

### Test 16: Create Product with Invalid Data

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "",
    "price": -50,
    "category": "InvalidCategory"
  }'
```

**✅ Expected:** Multiple validation errors

---

### Test 17: Create Product Without Required Fields

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Test Product"
  }'
```

**✅ Expected:** Validation errors for missing fields

---

### Test 18: Get Product with Invalid ID Format

```bash
curl -X GET http://localhost:5000/api/products/not-a-valid-id
```

**✅ Expected:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "id",
      "message": "Invalid product ID"
    }
  ]
}
```

---

### Test 19: Get Non-Existent Product

```bash
curl -X GET http://localhost:5000/api/products/673f00000000000000000000
```

**✅ Expected:**
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

### Test 20: Update Product with Invalid Category

```bash
# Replace PRODUCT_ID with actual ID
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "category": "InvalidCategory"
  }'
```

**✅ Expected:** Validation error

---

## 🔍 TESTING ADVANCED FEATURES

### Test 21: Filter by Category

```bash
curl -X GET "http://localhost:5000/api/products?category=Outerwear"
```

**✅ Expected:** Only Outerwear products (Leather Jacket)

---

### Test 22: Filter by Size

```bash
curl -X GET "http://localhost:5000/api/products?size=M"
```

**✅ Expected:** Products with size M variant

---

### Test 23: Filter by Price Range

```bash
curl -X GET "http://localhost:5000/api/products?minPrice=50&maxPrice=100"
```

**✅ Expected:** Products between $50-$100 (Jeans, Wallet)

---

### Test 24: Sort by Price (Low to High)

```bash
curl -X GET "http://localhost:5000/api/products?sortBy=price-low"
```

**✅ Expected:** Products sorted: T-Shirt ($29.99), Wallet ($49.99), Jeans ($79.99), Jacket ($279.99)

---

### Test 25: Sort by Price (High to Low)

```bash
curl -X GET "http://localhost:5000/api/products?sortBy=price-high"
```

**✅ Expected:** Reverse order

---

### Test 26: Sort by Newest

```bash
curl -X GET "http://localhost:5000/api/products?sortBy=newest"
```

**✅ Expected:** Most recently created first

---

### Test 27: Pagination - Page 1 with 2 Items

```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=2"
```

**✅ Expected:**
```json
{
  "success": true,
  "data": [... 2 products ...],
  "pagination": {
    "page": 1,
    "limit": 2,
    "totalPages": 2,
    "totalItems": 4,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Test 28: Pagination - Page 2

```bash
curl -X GET "http://localhost:5000/api/products?page=2&limit=2"
```

**✅ Expected:** Next 2 products, hasNextPage: false, hasPrevPage: true

---

### Test 29: Combined Filters

```bash
curl -X GET "http://localhost:5000/api/products?category=Tops&sortBy=price-low&inStock=true"
```

**✅ Expected:** T-Shirts sorted by price, only in stock

---

### Test 30: Search Products

```bash
curl -X GET "http://localhost:5000/api/products/search?q=leather"
```

**✅ Expected:** Leather Jacket and Wallet

---

### Test 31: Search with No Query

```bash
curl -X GET "http://localhost:5000/api/products/search"
```

**✅ Expected:**
```json
{
  "success": false,
  "error": "Search query is required"
}
```

---

### Test 32: Filter In-Stock Only

```bash
curl -X GET "http://localhost:5000/api/products?inStock=true"
```

**✅ Expected:** All active products with totalStock > 0

---

### Test 33: Get Single Product with View Count

```bash
# Replace PRODUCT_ID with actual ID
curl -X GET http://localhost:5000/api/products/PRODUCT_ID
```

Call this 3 times, then check viewCount should increase each time.

---

## 📊 EXPECTED RESULTS SUMMARY

### ✅ All Tests Should Pass:

| Test # | Endpoint | Expected Result |
|--------|----------|-----------------|
| 1 | Health Check | Server running |
| 2 | GET /products | Empty list with pagination |
| 3 | GET /featured | Empty list |
| 4 | GET /search | No results |
| 5 | GET /invalid-id | Validation error |
| 6-9 | POST /products | 4 products created |
| 10 | GET /products | 4 products returned |
| 11 | GET /featured | 2 featured products |
| 12 | PUT /:id | Price updated |
| 13 | PUT /:id/stock | Stock updated |
| 14 | DELETE /:id | Soft deleted |
| 15 | POST no auth | Authentication error |
| 16-20 | Invalid data | Validation errors |
| 21-33 | Filters/Sort | Correct filtered results |

---

## 🎯 SUCCESS CRITERIA

### ✅ Chapter 2.2 is Complete When:

1. **All CRUD Operations Work**
   - ✅ Create products (admin only)
   - ✅ Read products (public)
   - ✅ Update products (admin only)
   - ✅ Delete products (admin only)

2. **All Filtering Works**
   - ✅ Category filter
   - ✅ Size filter
   - ✅ Price range filter
   - ✅ In-stock filter
   - ✅ Search functionality

3. **All Sorting Works**
   - ✅ Featured
   - ✅ Price low to high
   - ✅ Price high to low
   - ✅ Newest
   - ✅ Popular

4. **Pagination Works**
   - ✅ Page navigation
   - ✅ Custom page size
   - ✅ Total pages calculated
   - ✅ hasNext/hasPrev flags

5. **Security Works**
   - ✅ Authentication required for admin routes
   - ✅ Admin role check
   - ✅ Rate limiting active
   - ✅ Input validation

6. **Error Handling Works**
   - ✅ Invalid IDs handled
   - ✅ Missing fields caught
   - ✅ Invalid data rejected
   - ✅ Clear error messages

---

## 🐛 TROUBLESHOOTING

### Issue: "No token, authorization denied"
**Solution:** Make sure you saved the admin token:
```bash
export ADMIN_TOKEN="your-token-here"
```

### Issue: "Admin access required"
**Solution:** User role must be "admin" in database. Update it:
```javascript
db.users.updateOne(
  { email: "admin@mutedage.com" },
  { $set: { role: "admin" } }
)
```

### Issue: "Product not found"
**Solution:** Use actual product IDs from create responses

### Issue: Rate limit errors
**Solution:** Wait 15 minutes or restart server

### Issue: Validation errors
**Solution:** Check request body matches exact format in examples

---

## 📝 NOTES

- All admin endpoints require Bearer token in Authorization header
- Products are soft-deleted (isActive: false), not removed from database
- View count increases each time product is fetched by ID
- Primary image is auto-assigned if not specified
- Stock is automatically calculated from variants
- Search uses MongoDB text search (requires text index)

---

## 🎉 CONGRATULATIONS!

If all tests pass, Chapter 2.2 is **100% COMPLETE** and ready for production!

**Next Steps:**
- Move to Chapter 2.3: Product Filtering & Search Enhancement
- Or continue to Chapter 3: Shopping Cart System

---

**Testing Complete!** 🚀
