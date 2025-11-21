#!/bin/bash

# Muted Age Backend API Testing Script
# This script tests all Phase 1 endpoints

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API Base URL
API_URL="http://localhost:5000"

# Token storage
TOKEN=""

echo "======================================"
echo " Muted Age Backend - Phase 1 Testing"
echo "======================================"
echo ""

# Function to print test result
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
  else
    echo -e "${RED}✗ FAILED${NC}"
  fi
}

# Function to make JSON request
json_request() {
  curl -s -w "\n%{http_code}" "$@"
}

# Test 1: Health Check
echo -n "Test 1: Health Check... "
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  print_result 0
  echo "   Response: $BODY"
else
  print_result 1
  echo "   HTTP Code: $HTTP_CODE"
  echo "   Response: $BODY"
fi
echo ""

# Test 2: Register User
echo -n "Test 2: Register User... "
RANDOM_NUM=$RANDOM
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"testuser$RANDOM_NUM\",
    \"email\": \"testuser$RANDOM_NUM@example.com\",
    \"password\": \"password123\"
  }")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
  print_result 0
  # Extract token
  TOKEN=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
  echo "   User created: testuser$RANDOM_NUM@example.com"
  echo "   Token: ${TOKEN:0:20}..."
else
  print_result 1
  echo "   HTTP Code: $HTTP_CODE"
  echo "   Response: $BODY"
fi
echo ""

# Test 3: Login User
echo -n "Test 3: Login User... "
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"testuser$RANDOM_NUM@example.com\",
    \"password\": \"password123\"
  }")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  print_result 0
  # Update token from login
  TOKEN=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
  echo "   Login successful"
else
  print_result 1
  echo "   HTTP Code: $HTTP_CODE"
  echo "   Response: $BODY"
fi
echo ""

# Test 4: Get Current User (Protected Route)
echo -n "Test 4: Get Current User (Protected)... "
if [ -n "$TOKEN" ]; then
  RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/api/auth/me" \
    -H "Authorization: Bearer $TOKEN")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" = "200" ]; then
    print_result 0
    echo "   Protected route accessible"
  else
    print_result 1
    echo "   HTTP Code: $HTTP_CODE"
    echo "   Response: $BODY"
  fi
else
  print_result 1
  echo "   No token available"
fi
echo ""

# Test 5: Invalid Login
echo -n "Test 5: Invalid Login (Should Fail)... "
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"nonexistent@example.com\",
    \"password\": \"wrongpassword\"
  }")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "401" ]; then
  print_result 0
  echo "   Correctly rejected invalid credentials"
else
  print_result 1
  echo "   Expected 401, got: $HTTP_CODE"
fi
echo ""

# Test 6: Protected Route Without Token
echo -n "Test 6: Protected Route Without Token (Should Fail)... "
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/api/auth/me")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "401" ]; then
  print_result 0
  echo "   Correctly rejected request without token"
else
  print_result 1
  echo "   Expected 401, got: $HTTP_CODE"
fi
echo ""

echo "======================================"
echo " Testing Complete!"
echo "======================================"
echo ""
echo "Your token for manual testing:"
echo "$TOKEN"
echo ""
echo "Use this token in Postman/Thunder Client:"
echo "Authorization: Bearer $TOKEN"
