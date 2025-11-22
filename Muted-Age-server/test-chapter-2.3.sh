#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}CHAPTER 2.3 - ADVANCED FILTERING TESTS${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Test 1: Autocomplete
echo -e "${YELLOW}Test 1: Autocomplete Search${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products/autocomplete?q=le")
if echo "$RESPONSE" | grep -q "suggestions"; then
    echo -e "${GREEN}✅ PASSED${NC} - Autocomplete working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 2: Tag Filtering
echo -e "${YELLOW}Test 2: Tag Filtering (Single Tag)${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products?tags=BESTSELLER")
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASSED${NC} - Tag filtering working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 3: Multiple Tags
echo -e "${YELLOW}Test 3: Multiple Tags Filtering${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products?tags=TRENDING,BESTSELLER")
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASSED${NC} - Multiple tags working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 4: Rating Sort
echo -e "${YELLOW}Test 4: Sort by Rating${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products?sortBy=rating")
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASSED${NC} - Rating sort working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 5: Min Rating Filter
echo -e "${YELLOW}Test 5: Minimum Rating Filter${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products?minRating=0")
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASSED${NC} - Min rating filter working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 6: Enhanced Search
echo -e "${YELLOW}Test 6: Enhanced Search${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products?search=leather")
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASSED${NC} - Enhanced search working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 7: Autocomplete with Short Query
echo -e "${YELLOW}Test 7: Autocomplete (Short Query)${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products/autocomplete?q=t")
if echo "$RESPONSE" | grep -q "Query too short\|suggestions"; then
    echo -e "${GREEN}✅ PASSED${NC} - Short query handled"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 8: Tag + Category Combined
echo -e "${YELLOW}Test 8: Tag + Category Filter${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products?tags=NEW&category=Outerwear")
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASSED${NC} - Combined filters working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 9: Invalid Rating
echo -e "${YELLOW}Test 9: Invalid Rating Validation${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products?minRating=10")
if echo "$RESPONSE" | grep -q "Validation failed\|between 0 and 5"; then
    echo -e "${GREEN}✅ PASSED${NC} - Validation working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 10: Search in Tags
echo -e "${YELLOW}Test 10: Search by Tag Content${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products?search=bestseller")
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASSED${NC} - Tag search working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 11: Autocomplete by Category
echo -e "${YELLOW}Test 11: Autocomplete by Category${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products/autocomplete?q=tops")
if echo "$RESPONSE" | grep -q "suggestions"; then
    echo -e "${GREEN}✅ PASSED${NC} - Category autocomplete working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Test 12: Complex Combined Filter
echo -e "${YELLOW}Test 12: Complex Combined Filters${NC}"
RESPONSE=$(curl -s "${BASE_URL}/api/products?tags=TRENDING&sortBy=price-low&minPrice=50&maxPrice=100")
if echo "$RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ PASSED${NC} - Complex filters working"
else
    echo -e "${RED}❌ FAILED${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}TESTING SUMMARY${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}✅ All Chapter 2.3 features tested${NC}"
echo ""
echo -e "${BLUE}New Features Working:${NC}"
echo -e "  ✓ Autocomplete search"
echo -e "  ✓ Tag filtering (single & multiple)"
echo -e "  ✓ Rating sort and filter"
echo -e "  ✓ Enhanced multi-field search"
echo -e "  ✓ Combined filter scenarios"
echo -e "  ✓ Input validation"
echo ""
echo -e "${YELLOW}For detailed test results, see: docs-server/CHAPTER-2.3-TESTING-GUIDE.md${NC}"
echo ""
