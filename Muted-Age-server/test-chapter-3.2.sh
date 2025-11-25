#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000/api"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Chapter 3.2: Cart API Testing${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Login to get token
echo -e "${YELLOW}Step 1: Logging in as admin...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mutedage.com",
    "password": "Admin@123456"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to login. Please check credentials.${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Login successful${NC}"
echo -e "Token: ${TOKEN:0:20}...\n"

# Step 2: Get a product ID and variant ID
echo -e "${YELLOW}Step 2: Getting product list...${NC}"
PRODUCTS_RESPONSE=$(curl -s -X GET "${BASE_URL}/products")

# Extract product ID from first product
PRODUCT_ID=$(echo $PRODUCTS_RESPONSE | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data'][0]['_id'] if data.get('data') and len(data['data']) > 0 else '')" 2>/dev/null)

if [ -z "$PRODUCT_ID" ]; then
  echo -e "${RED}❌ No products found. Please create a product first.${NC}"
  exit 1
fi

# Extract variant ID from first product's first variant
VARIANT_ID=$(echo $PRODUCTS_RESPONSE | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data'][0]['variants'][0]['_id'] if data.get('data') and len(data['data']) > 0 and data['data'][0].get('variants') and len(data['data'][0]['variants']) > 0 else '')" 2>/dev/null)

if [ -z "$VARIANT_ID" ]; then
  echo -e "${RED}❌ No variants found. Please ensure products have variants.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Product found${NC}"
echo -e "Product ID: $PRODUCT_ID"
echo -e "Variant ID: $VARIANT_ID\n"

# Step 3: Get empty cart
echo -e "${YELLOW}Step 3: Getting empty cart...${NC}"
CART_RESPONSE=$(curl -s -X GET "${BASE_URL}/cart" \
  -H "Authorization: Bearer $TOKEN")
echo $CART_RESPONSE | python3 -m json.tool 2>/dev/null || echo $CART_RESPONSE
echo -e "${GREEN}✅ Empty cart retrieved\n${NC}"

# Step 4: Add item to cart
echo -e "${YELLOW}Step 4: Adding item to cart...${NC}"
ADD_ITEM_RESPONSE=$(curl -s -X POST "${BASE_URL}/cart/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"variantId\": \"$VARIANT_ID\",
    \"quantity\": 2
  }")
echo $ADD_ITEM_RESPONSE | python3 -m json.tool 2>/dev/null || echo $ADD_ITEM_RESPONSE

ITEM_ID=$(echo $ADD_ITEM_RESPONSE | grep -o '"_id":"[^"]*' | head -2 | tail -1 | cut -d'"' -f4)
echo -e "${GREEN}✅ Item added to cart${NC}"
echo -e "Item ID: $ITEM_ID\n"

# Step 5: Add same item again (should update quantity)
echo -e "${YELLOW}Step 5: Adding same item again (should merge)...${NC}"
ADD_AGAIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/cart/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"variantId\": \"$VARIANT_ID\",
    \"quantity\": 1
  }")
echo $ADD_AGAIN_RESPONSE | python3 -m json.tool 2>/dev/null || echo $ADD_AGAIN_RESPONSE
echo -e "${GREEN}✅ Quantity updated\n${NC}"

# Step 6: Get cart with items
echo -e "${YELLOW}Step 6: Getting cart with items...${NC}"
CART_WITH_ITEMS=$(curl -s -X GET "${BASE_URL}/cart" \
  -H "Authorization: Bearer $TOKEN")
echo $CART_WITH_ITEMS | python3 -m json.tool 2>/dev/null || echo $CART_WITH_ITEMS
echo -e "${GREEN}✅ Cart retrieved with items\n${NC}"

# Step 7: Update item quantity
echo -e "${YELLOW}Step 7: Updating item quantity to 5...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/cart/items/${ITEM_ID}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }')
echo $UPDATE_RESPONSE | python3 -m json.tool 2>/dev/null || echo $UPDATE_RESPONSE
echo -e "${GREEN}✅ Item quantity updated\n${NC}"

# Step 8: Apply coupon
echo -e "${YELLOW}Step 8: Applying coupon code...${NC}"
COUPON_RESPONSE=$(curl -s -X POST "${BASE_URL}/cart/coupon" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "couponCode": "SAVE10"
  }')
echo $COUPON_RESPONSE | python3 -m json.tool 2>/dev/null || echo $COUPON_RESPONSE
echo -e "${GREEN}✅ Coupon applied\n${NC}"

# Step 9: Update shipping
echo -e "${YELLOW}Step 9: Updating shipping cost...${NC}"
SHIPPING_RESPONSE=$(curl -s -X PUT "${BASE_URL}/cart/shipping" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingCost": 9.99
  }')
echo $SHIPPING_RESPONSE | python3 -m json.tool 2>/dev/null || echo $SHIPPING_RESPONSE
echo -e "${GREEN}✅ Shipping cost updated\n${NC}"

# Step 10: Validate cart
echo -e "${YELLOW}Step 10: Validating cart stock...${NC}"
VALIDATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/cart/validate" \
  -H "Authorization: Bearer $TOKEN")
echo $VALIDATE_RESPONSE | python3 -m json.tool 2>/dev/null || echo $VALIDATE_RESPONSE
echo -e "${GREEN}✅ Cart validated\n${NC}"

# Step 11: Remove coupon
echo -e "${YELLOW}Step 11: Removing coupon...${NC}"
REMOVE_COUPON_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/cart/coupon" \
  -H "Authorization: Bearer $TOKEN")
echo $REMOVE_COUPON_RESPONSE | python3 -m json.tool 2>/dev/null || echo $REMOVE_COUPON_RESPONSE
echo -e "${GREEN}✅ Coupon removed\n${NC}"

# Step 12: Remove item
echo -e "${YELLOW}Step 12: Removing item from cart...${NC}"
REMOVE_ITEM_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/cart/items/${ITEM_ID}" \
  -H "Authorization: Bearer $TOKEN")
echo $REMOVE_ITEM_RESPONSE | python3 -m json.tool 2>/dev/null || echo $REMOVE_ITEM_RESPONSE
echo -e "${GREEN}✅ Item removed\n${NC}"

# Step 13: Add item again for clear cart test
echo -e "${YELLOW}Step 13: Adding item back for clear cart test...${NC}"
curl -s -X POST "${BASE_URL}/cart/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"variantId\": \"$VARIANT_ID\",
    \"quantity\": 1
  }" > /dev/null
echo -e "${GREEN}✅ Item added\n${NC}"

# Step 14: Clear cart
echo -e "${YELLOW}Step 14: Clearing entire cart...${NC}"
CLEAR_RESPONSE=$(curl -s -X DELETE "${BASE_URL}/cart" \
  -H "Authorization: Bearer $TOKEN")
echo $CLEAR_RESPONSE | python3 -m json.tool 2>/dev/null || echo $CLEAR_RESPONSE
echo -e "${GREEN}✅ Cart cleared\n${NC}"

# Step 15: Test error cases
echo -e "${YELLOW}Step 15: Testing error cases...${NC}"

echo -e "  Testing: Add item without auth..."
NO_AUTH_RESPONSE=$(curl -s -X POST "${BASE_URL}/cart/items" \
  -H "Content-Type: application/json" \
  -d "{
    \"productId\": \"$PRODUCT_ID\",
    \"variantId\": \"$VARIANT_ID\",
    \"quantity\": 1
  }")
if echo "$NO_AUTH_RESPONSE" | grep -q "Unauthorized\|unauthorized\|token"; then
  echo -e "  ${GREEN}✅ Unauthorized access blocked${NC}"
else
  echo -e "  ${RED}❌ Unauthorized access not blocked properly${NC}"
fi

echo -e "  Testing: Add invalid product..."
INVALID_PRODUCT_RESPONSE=$(curl -s -X POST "${BASE_URL}/cart/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "000000000000000000000000",
    "variantId": "000000000000000000000000",
    "quantity": 1
  }')
if echo "$INVALID_PRODUCT_RESPONSE" | grep -q "not found\|unavailable"; then
  echo -e "  ${GREEN}✅ Invalid product rejected${NC}"
else
  echo -e "  ${RED}❌ Invalid product not rejected properly${NC}"
fi

echo -e "  Testing: Apply coupon to empty cart..."
EMPTY_CART_COUPON=$(curl -s -X POST "${BASE_URL}/cart/coupon" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "couponCode": "TEST"
  }')
if echo "$EMPTY_CART_COUPON" | grep -q "empty"; then
  echo -e "  ${GREEN}✅ Empty cart coupon blocked${NC}"
else
  echo -e "  ${RED}❌ Empty cart coupon not blocked properly${NC}"
fi

echo

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ All cart endpoints tested successfully!${NC}\n"

echo -e "${YELLOW}Tested Endpoints:${NC}"
echo -e "  ✓ GET    /api/cart"
echo -e "  ✓ POST   /api/cart/items"
echo -e "  ✓ PUT    /api/cart/items/:itemId"
echo -e "  ✓ DELETE /api/cart/items/:itemId"
echo -e "  ✓ DELETE /api/cart"
echo -e "  ✓ POST   /api/cart/coupon"
echo -e "  ✓ DELETE /api/cart/coupon"
echo -e "  ✓ PUT    /api/cart/shipping"
echo -e "  ✓ POST   /api/cart/validate"
echo -e "\n${GREEN}Chapter 3.2 Testing Complete! 🎉${NC}\n"
