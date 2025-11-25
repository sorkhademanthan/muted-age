#!/bin/bash

# ============================================================
# Chapter 2.4 - Image Management Testing Script
# ============================================================

BASE_URL="http://localhost:5000/api"
ADMIN_TOKEN=""
PRODUCT_ID=""
IMAGE_ID=""
TEST_IMAGE_PATH=""

echo "============================================================"
echo "🧪 CHAPTER 2.4: IMAGE MANAGEMENT TESTING"
echo "============================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test results
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}: $2"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: $2"
    ((TESTS_FAILED++))
  fi
}

# Function to make API calls
api_call() {
  local method=$1
  local endpoint=$2
  local data=$3
  local token=$4
  
  if [ -n "$token" ]; then
    curl -s -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $token" \
      -d "$data"
  else
    curl -s -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data"
  fi
}

# Function to upload images
upload_images() {
  local endpoint=$1
  local token=$2
  local image_path=$3
  
  curl -s -X POST "$BASE_URL$endpoint" \
    -H "Authorization: Bearer $token" \
    -F "images=@$image_path" \
    -F "markPrimary=true"
}

echo -e "${BLUE}📋 Pre-Test Setup${NC}"
echo "------------------------------------------------------------"

# Step 1: Admin Login
echo -e "\n1️⃣  Logging in as admin..."
LOGIN_RESPONSE=$(api_call POST "/auth/login" '{
  "email": "testadmin@mutedage.com",
  "password": "Admin@123"
}')

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -n "$ADMIN_TOKEN" ]; then
  print_result 0 "Admin login successful"
  echo "   Token: ${ADMIN_TOKEN:0:20}..."
else
  print_result 1 "Admin login failed"
  echo "   Response: $LOGIN_RESPONSE"
  exit 1
fi

# Step 2: Get existing product
echo -e "\n2️⃣  Fetching existing product..."
PRODUCTS_RESPONSE=$(api_call GET "/products?limit=1" "" "$ADMIN_TOKEN")
PRODUCT_ID=$(echo $PRODUCTS_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')

if [ -n "$PRODUCT_ID" ]; then
  print_result 0 "Product retrieved"
  echo "   Product ID: $PRODUCT_ID"
else
  print_result 1 "No products found - Please create a product first"
  exit 1
fi

# Step 3: Create test image
echo -e "\n3️⃣  Creating test image..."
TEST_IMAGE_PATH="/tmp/test-product-image.jpg"
curl -s "https://via.placeholder.com/800x800.jpg" -o $TEST_IMAGE_PATH

if [ -f "$TEST_IMAGE_PATH" ]; then
  print_result 0 "Test image created"
  echo "   Path: $TEST_IMAGE_PATH"
else
  print_result 1 "Failed to create test image"
  exit 1
fi

echo ""
echo "============================================================"
echo -e "${BLUE}🧪 IMAGE MANAGEMENT TESTS${NC}"
echo "============================================================"

# Test 1: Upload single image
echo -e "\n${YELLOW}TEST 1: Upload Single Image${NC}"
echo "------------------------------------------------------------"
UPLOAD_RESPONSE=$(upload_images "/products/$PRODUCT_ID/images" "$ADMIN_TOKEN" "$TEST_IMAGE_PATH")
UPLOAD_SUCCESS=$(echo $UPLOAD_RESPONSE | grep -o '"success":true')

if [ -n "$UPLOAD_SUCCESS" ]; then
  print_result 0 "Image uploaded successfully"
  IMAGE_ID=$(echo "$UPLOAD_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data']['product']['images'][-1]['_id'])" 2>/dev/null)
  if [ -z "$IMAGE_ID" ]; then
    IMAGE_ID=$(echo $UPLOAD_RESPONSE | grep -o '"_id":"[^"]*' | tail -1 | sed 's/"_id":"//')
  fi
  echo "   Image ID: $IMAGE_ID"
  echo "   Response preview:"
  echo "$UPLOAD_RESPONSE" | python3 -m json.tool 2>/dev/null | head -20
else
  print_result 1 "Image upload failed"
  echo "   Response: $UPLOAD_RESPONSE"
fi

# Test 2: Upload without authentication
echo -e "\n${YELLOW}TEST 2: Upload Without Authentication${NC}"
echo "------------------------------------------------------------"
UNAUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/products/$PRODUCT_ID/images" \
  -F "images=@$TEST_IMAGE_PATH")
UNAUTH_ERROR=$(echo $UNAUTH_RESPONSE | grep -o '"success":false')

if [ -n "$UNAUTH_ERROR" ]; then
  print_result 0 "Correctly rejected unauthorized upload"
else
  print_result 1 "Should have rejected unauthorized upload"
fi

# Test 3: Upload with invalid file type
echo -e "\n${YELLOW}TEST 3: Upload Invalid File Type${NC}"
echo "------------------------------------------------------------"
echo "Test file content" > /tmp/test-invalid.txt
INVALID_RESPONSE=$(curl -s -X POST "$BASE_URL/products/$PRODUCT_ID/images" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "images=@/tmp/test-invalid.txt")
INVALID_ERROR=$(echo $INVALID_RESPONSE | grep -o '"success":false')

if [ -n "$INVALID_ERROR" ]; then
  print_result 0 "Correctly rejected invalid file type"
else
  print_result 1 "Should have rejected invalid file type"
fi
rm /tmp/test-invalid.txt

# Test 4: Update image metadata (alt text)
echo -e "\n${YELLOW}TEST 4: Update Image Alt Text${NC}"
echo "------------------------------------------------------------"
if [ -n "$IMAGE_ID" ]; then
  UPDATE_ALT_RESPONSE=$(api_call PUT "/products/$PRODUCT_ID/images/$IMAGE_ID" '{
    "alt": "Updated product image"
  }' "$ADMIN_TOKEN")
  UPDATE_SUCCESS=$(echo $UPDATE_ALT_RESPONSE | grep -o '"success":true')
  
  if [ -n "$UPDATE_SUCCESS" ]; then
    print_result 0 "Image alt text updated"
    echo "   Response preview:"
    echo "$UPDATE_ALT_RESPONSE" | python3 -m json.tool 2>/dev/null | head -15
  else
    print_result 1 "Failed to update alt text"
    echo "   Response: $UPDATE_ALT_RESPONSE"
  fi
else
  print_result 1 "Skipped - No image ID available"
fi

# Test 5: Set image as primary
echo -e "\n${YELLOW}TEST 5: Set Image as Primary${NC}"
echo "------------------------------------------------------------"
if [ -n "$IMAGE_ID" ]; then
  UPDATE_PRIMARY_RESPONSE=$(api_call PUT "/products/$PRODUCT_ID/images/$IMAGE_ID" '{
    "isPrimary": true
  }' "$ADMIN_TOKEN")
  UPDATE_SUCCESS=$(echo $UPDATE_PRIMARY_RESPONSE | grep -o '"success":true')
  
  if [ -n "$UPDATE_SUCCESS" ]; then
    print_result 0 "Image set as primary"
  else
    print_result 1 "Failed to set image as primary"
    echo "   Response: $UPDATE_PRIMARY_RESPONSE"
  fi
else
  print_result 1 "Skipped - No image ID available"
fi

# Test 6: Update non-existent image
echo -e "\n${YELLOW}TEST 6: Update Non-Existent Image${NC}"
echo "------------------------------------------------------------"
FAKE_IMAGE_ID="507f1f77bcf86cd799439011"
NOTFOUND_RESPONSE=$(api_call PUT "/products/$PRODUCT_ID/images/$FAKE_IMAGE_ID" '{
  "alt": "This should fail"
}' "$ADMIN_TOKEN")
NOTFOUND_ERROR=$(echo $NOTFOUND_RESPONSE | grep -o '"success":false')

if [ -n "$NOTFOUND_ERROR" ]; then
  print_result 0 "Correctly handled non-existent image"
else
  print_result 1 "Should have returned error for non-existent image"
fi

# Test 7: Upload multiple images
echo -e "\n${YELLOW}TEST 7: Upload Multiple Images${NC}"
echo "------------------------------------------------------------"
cp /tmp/test-product-image.jpg /tmp/test-image-2.jpg
MULTI_UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/products/$PRODUCT_ID/images" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "images=@$TEST_IMAGE_PATH" \
  -F "images=@/tmp/test-image-2.jpg")
MULTI_SUCCESS=$(echo $MULTI_UPLOAD_RESPONSE | grep -o '"uploadedCount":2')

if [ -n "$MULTI_SUCCESS" ]; then
  print_result 0 "Multiple images uploaded successfully"
  SECOND_IMAGE_ID=$(echo "$MULTI_UPLOAD_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data']['product']['images'][-1]['_id'])" 2>/dev/null)
  if [ -z "$SECOND_IMAGE_ID" ]; then
    SECOND_IMAGE_ID=$(echo $MULTI_UPLOAD_RESPONSE | grep -o '"_id":"[^"]*' | tail -1 | sed 's/"_id":"//')
  fi
  echo "   Uploaded 2 images"
  echo "   Last Image ID: $SECOND_IMAGE_ID"
else
  print_result 1 "Failed to upload multiple images"
  echo "   Response: $MULTI_UPLOAD_RESPONSE"
fi
rm -f /tmp/test-image-2.jpg

# Test 8: Delete image
echo -e "\n${YELLOW}TEST 8: Delete Image${NC}"
echo "------------------------------------------------------------"
if [ -n "$SECOND_IMAGE_ID" ]; then
  DELETE_RESPONSE=$(api_call DELETE "/products/$PRODUCT_ID/images/$SECOND_IMAGE_ID" "" "$ADMIN_TOKEN")
  DELETE_SUCCESS=$(echo $DELETE_RESPONSE | grep -o '"success":true')
  
  if [ -n "$DELETE_SUCCESS" ]; then
    print_result 0 "Image deleted successfully"
    echo "   Response preview:"
    echo "$DELETE_RESPONSE" | python3 -m json.tool 2>/dev/null | head -15
  else
    print_result 1 "Failed to delete image"
    echo "   Response: $DELETE_RESPONSE"
  fi
else
  print_result 1 "Skipped - No image ID available"
fi

# Test 9: Delete without authentication
echo -e "\n${YELLOW}TEST 9: Delete Without Authentication${NC}"
echo "------------------------------------------------------------"
if [ -n "$IMAGE_ID" ]; then
  DELETE_UNAUTH_RESPONSE=$(curl -s -X DELETE "$BASE_URL/products/$PRODUCT_ID/images/$IMAGE_ID")
  DELETE_UNAUTH_ERROR=$(echo $DELETE_UNAUTH_RESPONSE | grep -o '"success":false')
  
  if [ -n "$DELETE_UNAUTH_ERROR" ]; then
    print_result 0 "Correctly rejected unauthorized delete"
  else
    print_result 1 "Should have rejected unauthorized delete"
  fi
else
  print_result 1 "Skipped - No image ID available"
fi

# Test 10: Verify product has images
echo -e "\n${YELLOW}TEST 10: Verify Product Images${NC}"
echo "------------------------------------------------------------"
PRODUCT_RESPONSE=$(api_call GET "/products/$PRODUCT_ID" "" "$ADMIN_TOKEN")
HAS_IMAGES=$(echo $PRODUCT_RESPONSE | grep -o '"images":\[[^]]*\]')

if [ -n "$HAS_IMAGES" ]; then
  print_result 0 "Product has images stored"
  echo "   Images array found in product"
else
  print_result 1 "Product missing images"
  echo "   Response preview:"
  echo "$PRODUCT_RESPONSE" | python3 -m json.tool 2>/dev/null | head -20
fi

# Cleanup
echo -e "\n${BLUE}🧹 Cleanup${NC}"
echo "------------------------------------------------------------"
rm -f $TEST_IMAGE_PATH
echo "Test images removed"

# Final Summary
echo ""
echo "============================================================"
echo -e "${BLUE}📊 TEST SUMMARY${NC}"
echo "============================================================"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed! Chapter 2.4 is working correctly.${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
  exit 1
fi
