#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5000/api"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Order Routes Testing Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Login as user to get token
echo -e "${YELLOW}Step 1: Logging in as user...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }')

USER_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$USER_TOKEN" ]; then
  echo -e "${RED}❌ Login failed. Please ensure user exists.${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Logged in successfully${NC}\n"

# Step 2: Add items to cart
echo -e "${YELLOW}Step 2: Adding items to cart...${NC}"
# You'll need to replace PRODUCT_ID and VARIANT_ID with actual IDs from your database
echo -e "${BLUE}(Make sure you have products in your database and update PRODUCT_ID/VARIANT_ID in this script)${NC}\n"

# Step 3: Get cart to verify items
echo -e "${YELLOW}Step 3: Checking cart...${NC}"
CART_RESPONSE=$(curl -s -X GET "$BASE_URL/cart" \
  -H "Authorization: Bearer $USER_TOKEN")

echo "$CART_RESPONSE" | head -20
echo -e "\n"

# Step 4: Create order from cart (with sample shipping address)
echo -e "${YELLOW}Step 4: Creating order from cart...${NC}"
ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/orders" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "street": "123 Main Street",
      "apartment": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "phone": "+1-555-0123"
    }
  }')

echo "$ORDER_RESPONSE"

ORDER_NUMBER=$(echo $ORDER_RESPONSE | grep -o '"orderNumber":"[^"]*' | sed 's/"orderNumber":"//')

if [ -z "$ORDER_NUMBER" ]; then
  echo -e "${YELLOW}⚠️  Could not create order. Make sure cart has items.${NC}\n"
else
  echo -e "${GREEN}✅ Order created: $ORDER_NUMBER${NC}\n"
  
  # Step 5: Get order history
  echo -e "${YELLOW}Step 5: Getting order history...${NC}"
  curl -s -X GET "$BASE_URL/orders?page=1&limit=5" \
    -H "Authorization: Bearer $USER_TOKEN" | head -30
  echo -e "\n"
  
  # Step 6: Get specific order details
  echo -e "${YELLOW}Step 6: Getting order details for $ORDER_NUMBER...${NC}"
  curl -s -X GET "$BASE_URL/orders/$ORDER_NUMBER" \
    -H "Authorization: Bearer $USER_TOKEN" | head -50
  echo -e "\n"
fi

# Step 7: Test admin functions - Login as admin
echo -e "${YELLOW}Step 7: Testing admin functions...${NC}"
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mutedage.com",
    "password": "Admin@123"
  }')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}❌ Admin login failed${NC}\n"
else
  echo -e "${GREEN}✅ Admin logged in${NC}"
  
  if [ ! -z "$ORDER_NUMBER" ]; then
    # Get order ID
    ORDER_ID=$(echo $ORDER_RESPONSE | grep -o '"_id":"[^"]*' | sed 's/"_id":"//' | head -1)
    
    echo -e "${YELLOW}Updating order status to 'processing'...${NC}"
    curl -s -X PATCH "$BASE_URL/orders/$ORDER_ID/status" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "status": "processing",
        "note": "Order is being processed"
      }' | head -20
    echo -e "\n"
  fi
fi

# Step 8: Get order statistics
echo -e "${YELLOW}Step 8: Getting order statistics...${NC}"
curl -s -X GET "$BASE_URL/orders/stats/summary" \
  -H "Authorization: Bearer $USER_TOKEN"
echo -e "\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Order Routes Testing Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "\n${YELLOW}Available Endpoints:${NC}"
echo "1. POST   /api/orders                    - Create order from cart"
echo "2. GET    /api/orders                    - Get order history"
echo "3. GET    /api/orders/:orderNumber       - Get order details"
echo "4. PATCH  /api/orders/:id/status         - Update order status (admin)"
echo "5. GET    /api/orders/stats/summary      - Get order statistics"
