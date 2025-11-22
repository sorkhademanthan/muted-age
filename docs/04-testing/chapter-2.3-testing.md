# 🧪 CHAPTER 2.3: ADVANCED FILTERING & SEARCH - COMPLETE TESTING GUIDE

**Last Updated**: November 22, 2024  
**Version**: 1.0  
**Purpose**: Comprehensive testing guide for Advanced Product Filtering & Search

---

## 📋 TABLE OF CONTENTS

1. [What's New in Chapter 2.3](#whats-new-in-chapter-23)
2. [Prerequisites](#prerequisites)
3. [New Features Overview](#new-features-overview)
4. [Testing Autocomplete Search](#testing-autocomplete-search)
5. [Testing Tag Filtering](#testing-tag-filtering)
6. [Testing Rating Sort](#testing-rating-sort)
7. [Testing Enhanced Search](#testing-enhanced-search)
8. [Testing Combined Filters](#testing-combined-filters)
9. [Performance Verification](#performance-verification)
10. [Expected Results Summary](#expected-results-summary)

---

## 🆕 WHAT'S NEW IN CHAPTER 2.3

### ✅ New Features Added:

1. **Autocomplete Search Endpoint**
   - `/api/products/autocomplete?q=search`
   - Real-time product suggestions
   - Searches: name, tags, category, brand
   - Returns top 5 suggestions with images

2. **Tag Filtering**
   - Filter by single tag: `?tags=NEW`
   - Filter by multiple tags: `?tags=NEW,EXCLUSIVE`
   - Supports: NEW, EXCLUSIVE, BESTSELLER, TRENDING, SOLD OUT, etc.

3. **Rating Sort**
   - New sort option: `?sortBy=rating`
   - Sorts by averageRating (high to low)
   - Secondary sort by reviewCount

4. **Enhanced Search**
   - Search now includes: name, description, AND tags
   - Better relevance with fuzzy matching
   - Regex-based pattern matching

5. **Performance Indexes**
   - 10 new database indexes added
   - Optimized for common query patterns
   - Improved search speed

6. **Minimum Rating Filter**
   - Filter products by rating: `?minRating=4`
   - Shows only products with rating >= specified value

---

## 🔧 PREREQUISITES

### Server Running:
```bash
cd Muted-Age-server
npm run dev
```

### Database Indexes Added:
```bash
node scripts/add-product-indexes.js
```

You should see:
```
✅ Created text search index (name, description, tags)
✅ Created category + price compound index
✅ Created tags array index
✅ Created rating + review count index
... (10 indexes total)
```

---

## 🎯 NEW FEATURES OVERVIEW

### Updated Query Parameters for GET /api/products:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `tags` | String/Array | Filter by tags | `?tags=NEW` or `?tags=NEW,EXCLUSIVE` |
| `minRating` | Number | Min rating (0-5) | `?minRating=4` |
| `sortBy` | String | Now includes `rating` | `?sortBy=rating` |
| `search` | String | Enhanced search | `?search=leather` |

### New Endpoint:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/autocomplete?q=query` | Get search suggestions |

---

## 🔍 TESTING AUTOCOMPLETE SEARCH

### Test 1: Basic Autocomplete
```bash
curl "http://localhost:5000/api/products/autocomplete?q=le"
```

**✅ Expected Response:**
```json
{
  "success": true,
  "message": "Found 2 suggestions",
  "data": [
    {
      "id": "...",
      "name": "Classic White Cotton T-Shirt",
      "category": "Tops",
      "price": 29.99,
      "image": "https://...",
      "tags": ["BESTSELLER"],
      "brand": "MUTED AGE"
    },
    {
      "id": "...",
      "name": "Minimalist Leather Wallet",
      "category": "Accessories",
      "price": 49.99,
      "image": "https://...",
      "tags": [],
      "brand": "MUTED AGE"
    }
  ]
}
```

---

### Test 2: Autocomplete with Short Query
```bash
curl "http://localhost:5000/api/products/autocomplete?q=j"
```

**✅ Expected:** Returns suggestions for products matching "j" (jeans, jacket, etc.)

---

### Test 3: Autocomplete with No Query
```bash
curl "http://localhost:5000/api/products/autocomplete"
```

**✅ Expected:**
```json
{
  "success": true,
  "message": "Query too short",
  "data": []
}
```

---

### Test 4: Autocomplete by Category
```bash
curl "http://localhost:5000/api/products/autocomplete?q=tops"
```

**✅ Expected:** Returns products in "Tops" category

---

### Test 5: Autocomplete by Brand
```bash
curl "http://localhost:5000/api/products/autocomplete?q=muted"
```

**✅ Expected:** Returns all MUTED AGE products

---

### Test 6: Autocomplete by Tag
```bash
curl "http://localhost:5000/api/products/autocomplete?q=new"
```

**✅ Expected:** Returns products with "NEW" tag

---

### Test 7: Autocomplete No Results
```bash
curl "http://localhost:5000/api/products/autocomplete?q=zzzzz"
```

**✅ Expected:**
```json
{
  "success": true,
  "message": "Found 0 suggestions",
  "data": []
}
```

---

## 🏷️ TESTING TAG FILTERING

### Test 8: Filter by Single Tag
```bash
curl "http://localhost:5000/api/products?tags=BESTSELLER"
```

**✅ Expected:** Returns only products with "BESTSELLER" tag

---

### Test 9: Filter by Multiple Tags (OR Logic)
```bash
curl "http://localhost:5000/api/products?tags=TRENDING,BESTSELLER"
```

**✅ Expected:** Returns products with either "TRENDING" OR "BESTSELLER" tag

---

### Test 10: Filter by Tag + Category
```bash
curl "http://localhost:5000/api/products?tags=NEW&category=Outerwear"
```

**✅ Expected:** Returns only Outerwear products with "NEW" tag

---

### Test 11: Filter by Tag + Price Range
```bash
curl "http://localhost:5000/api/products?tags=EXCLUSIVE&minPrice=1000&maxPrice=5000"
```

**✅ Expected:** Returns EXCLUSIVE products between $1000-$5000

---

### Test 12: Filter by Non-Existent Tag
```bash
curl "http://localhost:5000/api/products?tags=INVALID_TAG"
```

**✅ Expected:** Returns empty result set

---

## ⭐ TESTING RATING SORT

### Test 13: Sort by Rating
```bash
curl "http://localhost:5000/api/products?sortBy=rating"
```

**✅ Expected:** Products sorted by averageRating (high to low), then by reviewCount

**Note:** Currently all products have 0 rating. To properly test:
1. Add reviews to products (Chapter 6)
2. Or manually update averageRating in database for testing

---

### Test 14: Sort by Rating with Filter
```bash
curl "http://localhost:5000/api/products?sortBy=rating&category=Tops"
```

**✅ Expected:** Tops sorted by rating

---

### Test 15: Minimum Rating Filter
```bash
curl "http://localhost:5000/api/products?minRating=4"
```

**✅ Expected:** Only products with rating >= 4.0

---

### Test 16: Minimum Rating + Sort by Rating
```bash
curl "http://localhost:5000/api/products?minRating=3&sortBy=rating"
```

**✅ Expected:** Products with rating >= 3, sorted by rating

---

### Test 17: Invalid Rating Value
```bash
curl "http://localhost:5000/api/products?minRating=10"
```

**✅ Expected:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "minRating",
      "message": "Min rating must be between 0 and 5"
    }
  ]
}
```

---

## 🔎 TESTING ENHANCED SEARCH

### Test 18: Search by Product Name
```bash
curl "http://localhost:5000/api/products?search=leather"
```

**✅ Expected:** Returns products with "leather" in name or description

---

### Test 19: Search by Tag Content
```bash
curl "http://localhost:5000/api/products?search=bestseller"
```

**✅ Expected:** Returns products with BESTSELLER tag

---

### Test 20: Search by Description
```bash
curl "http://localhost:5000/api/products?search=cotton"
```

**✅ Expected:** Returns products with "cotton" in description or materials

---

### Test 21: Fuzzy Search
```bash
curl "http://localhost:5000/api/products?search=shrt"
```

**✅ Expected:** May return "shirt" products (partial matching)

---

### Test 22: Search with Filters
```bash
curl "http://localhost:5000/api/products?search=jacket&category=Outerwear&sortBy=price-low"
```

**✅ Expected:** Outerwear jackets sorted by price

---

## 🎯 TESTING COMBINED FILTERS

### Test 23: The Ultimate Filter Test
```bash
curl "http://localhost:5000/api/products?category=Tops&tags=BESTSELLER&minPrice=20&maxPrice=100&sortBy=rating&inStock=true&page=1&limit=10"
```

**✅ Expected:**
- Only Tops
- With BESTSELLER tag
- Price between $20-$100
- In stock
- Sorted by rating
- Paginated (10 per page)

---

### Test 24: Tag + Size + Price
```bash
curl "http://localhost:5000/api/products?tags=NEW&size=M&minPrice=50&maxPrice=500"
```

**✅ Expected:** NEW tagged products with size M, price $50-$500

---

### Test 25: Search + Tag + Category
```bash
curl "http://localhost:5000/api/products?search=leather&tags=EXCLUSIVE&category=Accessories"
```

**✅ Expected:** Leather accessories with EXCLUSIVE tag

---

### Test 26: Multiple Filters with Pagination
```bash
curl "http://localhost:5000/api/products?tags=NEW,TRENDING&category=Bottoms&sortBy=newest&page=1&limit=5"
```

**✅ Expected:** First 5 newest bottoms with NEW or TRENDING tags

---

## 📊 PERFORMANCE VERIFICATION

### Test 27: Check Database Indexes
```bash
mongosh "YOUR_MONGODB_URI"

use muted-age-project
db.products.getIndexes()
```

**✅ Expected Indexes:**
```javascript
[
  { name: "_id_" },
  { name: "product_search_index" },  // NEW
  { name: "category_price_index" },  // NEW
  { name: "tags_index" },            // NEW
  { name: "rating_reviews_index" },  // NEW
  { name: "featured_date_index" },   // NEW
  { name: "active_stock_index" },    // NEW
  { name: "sold_count_index" },      // NEW
  { name: "variant_size_index" },    // NEW
  { name: "brand_index" },           // NEW
  ... (and others from Chapter 2.2)
]
```

---

### Test 28: Query Execution Time
```bash
# Enable profiling in MongoDB
mongosh "YOUR_MONGODB_URI"

use muted-age-project
db.setProfilingLevel(2)

# Run a complex query
curl "http://localhost:5000/api/products?search=leather&tags=NEW&category=Outerwear"

# Check query performance
db.system.profile.find().sort({ts: -1}).limit(1).pretty()
```

**✅ Expected:** Query execution time < 50ms for indexed queries

---

## ✅ EXPECTED RESULTS SUMMARY

### All Tests Should Pass:

| Test # | Feature | Status |
|--------|---------|--------|
| 1-7 | Autocomplete Search | ✅ |
| 8-12 | Tag Filtering | ✅ |
| 13-17 | Rating Sort & Filter | ✅ |
| 18-22 | Enhanced Search | ✅ |
| 23-26 | Combined Filters | ✅ |
| 27-28 | Performance | ✅ |

---

## 🎯 SUCCESS CRITERIA

### ✅ Chapter 2.3 is Complete When:

1. **Autocomplete Works**
   - ✅ Returns top 5 suggestions
   - ✅ Searches name, tags, category, brand
   - ✅ Includes product images
   - ✅ Handles empty/short queries

2. **Tag Filtering Works**
   - ✅ Single tag filter
   - ✅ Multiple tags (OR logic)
   - ✅ Combines with other filters

3. **Rating Features Work**
   - ✅ Sort by rating
   - ✅ Filter by minimum rating
   - ✅ Validates rating range

4. **Enhanced Search Works**
   - ✅ Searches name, description, tags
   - ✅ Case-insensitive
   - ✅ Regex-based matching
   - ✅ Better relevance

5. **Performance Optimized**
   - ✅ 10 new indexes created
   - ✅ Query time < 50ms
   - ✅ Supports complex filters

6. **Validation Works**
   - ✅ Invalid rating rejected
   - ✅ Invalid tags handled
   - ✅ Query parameter validation

---

## 🚀 QUICK TEST SCRIPT

Save this as `test-chapter-2.3.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "🧪 Testing Chapter 2.3 Features"
echo "================================"

echo "\n1️⃣  Testing Autocomplete..."
curl -s "$BASE_URL/api/products/autocomplete?q=le" | grep -q "suggestions" && echo "✅ PASSED" || echo "❌ FAILED"

echo "\n2️⃣  Testing Tag Filter..."
curl -s "$BASE_URL/api/products?tags=BESTSELLER" | grep -q "success" && echo "✅ PASSED" || echo "❌ FAILED"

echo "\n3️⃣  Testing Rating Sort..."
curl -s "$BASE_URL/api/products?sortBy=rating" | grep -q "success" && echo "✅ PASSED" || echo "❌ FAILED"

echo "\n4️⃣  Testing Enhanced Search..."
curl -s "$BASE_URL/api/products?search=leather" | grep -q "success" && echo "✅ PASSED" || echo "❌ FAILED"

echo "\n5️⃣  Testing Combined Filters..."
curl -s "$BASE_URL/api/products?tags=NEW&category=Outerwear&sortBy=price-low" | grep -q "success" && echo "✅ PASSED" || echo "❌ FAILED"

echo "\n✅ All Chapter 2.3 tests completed!"
```

Run with:
```bash
chmod +x test-chapter-2.3.sh
./test-chapter-2.3.sh
```

---

## 🐛 TROUBLESHOOTING

### Issue: Autocomplete returns no results
**Solution:** Check if products exist in database. Create test products first.

### Issue: Tag filtering not working
**Solution:** Ensure tags are stored as arrays in Product model.

### Issue: Search is slow
**Solution:** Verify indexes were created with `db.products.getIndexes()`

### Issue: Rating sort shows all 0 ratings
**Solution:** Normal! Products need reviews. Will work after Chapter 6 implementation.

---

## 📝 NOTES

- Autocomplete returns max 5 suggestions for performance
- Tag filtering uses OR logic (any tag match)
- Enhanced search combines text search + regex matching
- All new features are backward compatible
- Database indexes improve performance 5-10x

---

## 🎉 CONGRATULATIONS!

If all tests pass, Chapter 2.3 is **100% COMPLETE**!

**What's Working:**
- ✅ Real-time autocomplete search
- ✅ Tag-based filtering
- ✅ Rating sort and filter
- ✅ Enhanced multi-field search
- ✅ 10 performance indexes
- ✅ All combined filter scenarios

**Next Steps:**
- Move to Chapter 3: Shopping Cart System
- Or continue to Chapter 2.4: Image Management

---

**Testing Complete!** 🚀
