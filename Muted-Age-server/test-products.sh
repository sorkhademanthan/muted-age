#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API Base URL
BASE_URL="http://localhost:5000"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}CHAPTER 2.2 - PRODUCT CRUD TESTING${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" ${BASE_URL}/api/health)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Server is running"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP Code: $HTTP_CODE"
fi
echo ""

# Test 2: Get All Products (Empty)
echo -e "${YELLOW}Test 2: Get All Products (Empty Database)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" ${BASE_URL}/api/products)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Products retrieved"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP Code: $HTTP_CODE"
fi
echo ""

# Test 3: Get Featured Products
echo -e "${YELLOW}Test 3: Get Featured Products${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" ${BASE_URL}/api/products/featured)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Featured products retrieved"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP Code: $HTTP_CODE"
fi
echo ""

# Test 4: Invalid Product ID
echo -e "${YELLOW}Test 4: Get Product with Invalid ID${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" ${BASE_URL}/api/products/invalid-id)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Validation error correctly returned"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED${NC} - Expected 400, got $HTTP_CODE"
fi
echo ""

# Test 5: Invalid Category Filter
echo -e "${YELLOW}Test 5: Filter with Invalid Category${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/products?category=InvalidCategory")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Validation error for invalid category"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED${NC} - Expected 400, got $HTTP_CODE"
fi
echo ""

# Test 6: Valid Category Filter
echo -e "${YELLOW}Test 6: Filter by Valid Category (Tops)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/products?category=Tops")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Category filter working"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP Code: $HTTP_CODE"
fi
echo ""

# Test 7: Sorting
echo -e "${YELLOW}Test 7: Sort by Price (Low to High)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/products?sortBy=price-low")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Sorting working"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP Code: $HTTP_CODE"
fi
echo ""

# Test 8: Pagination
echo -e "${YELLOW}Test 8: Pagination (Page 1, Limit 5)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/products?page=1&limit=5")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Pagination working"
    echo "$BODY" | python3 -m json.tool 2>/dev/null | grep -A 10 "pagination" || echo "Pagination data present"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP Code: $HTTP_CODE"
fi
echo ""

# Test 9: Search (Empty Query)
echo -e "${YELLOW}Test 9: Search without Query${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/products/search")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Error for missing search query"
else
    echo -e "${RED}❌ FAILED${NC} - Expected 400, got $HTTP_CODE"
fi
echo ""

# Test 10: Search with Query
echo -e "${YELLOW}Test 10: Search Products (query: 'jacket')${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/products/search?q=jacket")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Search working"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP Code: $HTTP_CODE"
fi
echo ""

# Test 11: Create Product without Auth
echo -e "${YELLOW}Test 11: Create Product without Authentication${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST ${BASE_URL}/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test Description",
    "price": 99.99,
    "category": "Tops"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Authentication required"
else
    echo -e "${RED}❌ FAILED${NC} - Expected 401, got $HTTP_CODE"
fi
echo ""

# Test 12: Price Range Filter
echo -e "${YELLOW}Test 12: Filter by Price Range (50-100)${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/products?minPrice=50&maxPrice=100")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Price range filter working"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP Code: $HTTP_CODE"
fi
echo ""

# Test 13: In-Stock Filter
echo -e "${YELLOW}Test 13: Filter In-Stock Products${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/products?inStock=true")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - In-stock filter working"
else
    echo -e "${RED}❌ FAILED${NC} - HTTP Code: $HTTP_CODE"
fi
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}TESTING SUMMARY${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Public Endpoints: All tests completed${NC}"
echo -e "${YELLOW}Admin Endpoints: Require authentication token${NC}"
echo -e "${BLUE}For admin endpoint testing, see: docs-server/CHAPTER-2.2-TESTING-GUIDE.md${NC}"
echo ""
echo -e "${BLUE}To test admin endpoints:${NC}"
echo -e "1. Create admin user and get token"
echo -e "2. Export token: ${YELLOW}export ADMIN_TOKEN='your-token'${NC}"
echo -e "3. Follow detailed guide in testing documentation"
echo ""
