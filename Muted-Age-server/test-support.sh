#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5000/api"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print test headers
print_header() {
  echo ""
  echo -e "${BLUE}================================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}================================================${NC}"
  echo ""
}

# Function to print test results
print_result() {
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASS:${NC} $2"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}✗ FAIL:${NC} $2"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
}

# Function to print info
print_info() {
  echo -e "${YELLOW}ℹ INFO:${NC} $1"
}

# Variables to store data across tests
USER_TOKEN=""
ADMIN_TOKEN=""
TICKET_ID=""
TICKET_NUMBER=""
PRODUCT_ID=""
ORDER_ID=""

print_header "SUPPORT & COMPLAINTS SYSTEM TEST SUITE"
echo "This script will test all support/complaint endpoints"
echo "Make sure the server is running on port 5000"
echo ""
read -p "Press Enter to continue..."

# ============================================
# PHASE 1: AUTHENTICATION
# ============================================

print_header "PHASE 1: Authentication Setup"

# 1. Login as User
print_info "Logging in as regular user..."
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }')

USER_TOKEN=$(echo $USER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$USER_TOKEN" ]; then
  print_result 0 "User login successful"
  print_info "User Token: ${USER_TOKEN:0:20}..."
else
  print_result 1 "User login failed"
  echo "Response: $USER_RESPONSE"
  echo "Please ensure test user exists. Run: npm run seed"
  exit 1
fi

# 2. Login as Admin
print_info "Logging in as admin..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mutedage.com",
    "password": "Admin123!"
  }')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$ADMIN_TOKEN" ]; then
  print_result 0 "Admin login successful"
  print_info "Admin Token: ${ADMIN_TOKEN:0:20}..."
else
  print_result 1 "Admin login failed"
  echo "Response: $ADMIN_RESPONSE"
  echo "Please ensure admin user exists"
  exit 1
fi

# Get a product ID for testing
print_info "Fetching a product for related product test..."
PRODUCT_RESPONSE=$(curl -s "$BASE_URL/products?limit=1")
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
if [ -n "$PRODUCT_ID" ]; then
  print_info "Product ID: $PRODUCT_ID"
fi

# ============================================
# PHASE 2: USER - CREATE TICKET
# ============================================

print_header "PHASE 2: User Creates Support Ticket"

# 3. Create a ticket
print_info "Creating a support ticket..."
CREATE_TICKET_RESPONSE=$(curl -s -X POST "$BASE_URL/support/tickets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "subject": "Product quality issue with my recent order",
    "description": "I received a t-shirt but the print quality is not as expected. The colors are faded and the fabric feels cheap.",
    "category": "Product Quality",
    "priority": "high",
    "relatedProductId": "'"$PRODUCT_ID"'"
  }')

TICKET_ID=$(echo $CREATE_TICKET_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
TICKET_NUMBER=$(echo $CREATE_TICKET_RESPONSE | grep -o '"ticketNumber":"[^"]*' | cut -d'"' -f4)

if [ -n "$TICKET_ID" ]; then
  print_result 0 "Ticket created successfully"
  print_info "Ticket ID: $TICKET_ID"
  print_info "Ticket Number: $TICKET_NUMBER"
else
  print_result 1 "Failed to create ticket"
  echo "Response: $CREATE_TICKET_RESPONSE"
fi

# 4. Get user's tickets
print_info "Fetching user's tickets..."
USER_TICKETS_RESPONSE=$(curl -s "$BASE_URL/support/tickets" \
  -H "Authorization: Bearer $USER_TOKEN")

TICKET_COUNT=$(echo $USER_TICKETS_RESPONSE | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ "$TICKET_COUNT" -gt 0 ]; then
  print_result 0 "Retrieved user tickets (Count: $TICKET_COUNT)"
else
  print_result 1 "Failed to retrieve user tickets"
fi

# 5. Get ticket details
print_info "Fetching ticket details..."
TICKET_DETAILS_RESPONSE=$(curl -s "$BASE_URL/support/tickets/$TICKET_ID" \
  -H "Authorization: Bearer $USER_TOKEN")

SUBJECT=$(echo $TICKET_DETAILS_RESPONSE | grep -o '"subject":"[^"]*' | cut -d'"' -f4)
if [ -n "$SUBJECT" ]; then
  print_result 0 "Retrieved ticket details"
  print_info "Subject: $SUBJECT"
else
  print_result 1 "Failed to retrieve ticket details"
fi

# 6. Add a reply to ticket
print_info "User adding reply to ticket..."
USER_REPLY_RESPONSE=$(curl -s -X POST "$BASE_URL/support/tickets/$TICKET_ID/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "message": "I can provide photos if that would help. When can I expect a response?"
  }')

if echo "$USER_REPLY_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "User reply added successfully"
else
  print_result 1 "Failed to add user reply"
fi

# 7. Get user tickets summary
print_info "Fetching user tickets summary..."
SUMMARY_RESPONSE=$(curl -s "$BASE_URL/support/my-tickets/summary" \
  -H "Authorization: Bearer $USER_TOKEN")

if echo "$SUMMARY_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Retrieved tickets summary"
  echo "$SUMMARY_RESPONSE" | grep -o '"total":[0-9]*' | head -1
else
  print_result 1 "Failed to retrieve summary"
fi

# ============================================
# PHASE 3: ADMIN - MANAGE TICKETS
# ============================================

print_header "PHASE 3: Admin Manages Tickets"

# 8. Admin views all tickets
print_info "Admin fetching all tickets..."
ADMIN_TICKETS_RESPONSE=$(curl -s "$BASE_URL/support/admin/tickets" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

ADMIN_TICKET_COUNT=$(echo $ADMIN_TICKETS_RESPONSE | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ "$ADMIN_TICKET_COUNT" -gt 0 ]; then
  print_result 0 "Admin retrieved all tickets (Count: $ADMIN_TICKET_COUNT)"
else
  print_result 1 "Failed to retrieve admin tickets"
fi

# 9. Admin views ticket details (including internal notes)
print_info "Admin fetching ticket details..."
ADMIN_TICKET_DETAILS=$(curl -s "$BASE_URL/support/admin/tickets/$TICKET_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$ADMIN_TICKET_DETAILS" | grep -q '"ticketNumber"'; then
  print_result 0 "Admin retrieved ticket details"
else
  print_result 1 "Failed to retrieve ticket details as admin"
fi

# 10. Assign ticket to admin
print_info "Assigning ticket to admin..."
ASSIGN_RESPONSE=$(curl -s -X PATCH "$BASE_URL/support/admin/tickets/$TICKET_ID/assign" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{}')

if echo "$ASSIGN_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Ticket assigned to admin"
else
  print_result 1 "Failed to assign ticket"
fi

# 11. Update priority
print_info "Updating ticket priority to urgent..."
PRIORITY_RESPONSE=$(curl -s -X PATCH "$BASE_URL/support/admin/tickets/$TICKET_ID/priority" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "priority": "urgent"
  }')

if echo "$PRIORITY_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Ticket priority updated"
else
  print_result 1 "Failed to update priority"
fi

# 12. Update status to in-progress
print_info "Updating ticket status to in-progress..."
STATUS_RESPONSE=$(curl -s -X PATCH "$BASE_URL/support/admin/tickets/$TICKET_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "status": "in-progress"
  }')

if echo "$STATUS_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Ticket status updated to in-progress"
else
  print_result 1 "Failed to update status"
fi

# 13. Admin adds reply
print_info "Admin replying to ticket..."
ADMIN_REPLY_RESPONSE=$(curl -s -X POST "$BASE_URL/support/admin/tickets/$TICKET_ID/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "message": "Thank you for contacting us. We are very sorry about the quality issue. We would like to offer you a replacement or full refund. Please let us know your preference.",
    "isInternal": false
  }')

if echo "$ADMIN_REPLY_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Admin reply sent"
else
  print_result 1 "Failed to send admin reply"
fi

# 14. Admin adds internal note
print_info "Admin adding internal note..."
INTERNAL_NOTE_RESPONSE=$(curl -s -X POST "$BASE_URL/support/admin/tickets/$TICKET_ID/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "message": "Customer is a VIP. Prioritize this issue and offer expedited shipping for replacement.",
    "isInternal": true
  }')

if echo "$INTERNAL_NOTE_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Internal note added"
else
  print_result 1 "Failed to add internal note"
fi

# 15. Update internal notes field
print_info "Updating internal notes..."
NOTES_RESPONSE=$(curl -s -X PATCH "$BASE_URL/support/admin/tickets/$TICKET_ID/notes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "notes": "Replacement sent via expedited shipping. Tracking: ABC123XYZ"
  }')

if echo "$NOTES_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Internal notes updated"
else
  print_result 1 "Failed to update internal notes"
fi

# 16. Get admin statistics
print_info "Fetching admin statistics..."
STATS_RESPONSE=$(curl -s "$BASE_URL/support/admin/statistics" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$STATS_RESPONSE" | grep -q '"total"'; then
  print_result 0 "Admin statistics retrieved"
  echo "$STATS_RESPONSE" | grep -o '"total":[0-9]*'
else
  print_result 1 "Failed to retrieve statistics"
fi

# ============================================
# PHASE 4: TICKET RESOLUTION & REOPENING
# ============================================

print_header "PHASE 4: Ticket Resolution & Reopening"

# 17. Admin resolves ticket
print_info "Admin resolving ticket..."
RESOLVE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/support/admin/tickets/$TICKET_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "status": "resolved"
  }')

if echo "$RESOLVE_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Ticket resolved"
else
  print_result 1 "Failed to resolve ticket"
fi

sleep 1

# 18. User reopens ticket
print_info "User attempting to reopen ticket..."
REOPEN_RESPONSE=$(curl -s -X POST "$BASE_URL/support/tickets/$TICKET_ID/reopen" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "reason": "Replacement received but still has the same quality issues."
  }')

if echo "$REOPEN_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Ticket reopened successfully"
else
  print_result 1 "Failed to reopen ticket"
fi

# 19. Admin closes ticket
print_info "Admin closing ticket..."
CLOSE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/support/admin/tickets/$TICKET_ID/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "status": "closed"
  }')

if echo "$CLOSE_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Ticket closed"
else
  print_result 1 "Failed to close ticket"
fi

# ============================================
# PHASE 5: FILTERING & SEARCH
# ============================================

print_header "PHASE 5: Filtering & Search Tests"

# 20. Filter by status
print_info "Filtering tickets by status..."
FILTER_STATUS_RESPONSE=$(curl -s "$BASE_URL/support/admin/tickets?status=open" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$FILTER_STATUS_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Filtered tickets by status"
else
  print_result 1 "Failed to filter by status"
fi

# 21. Filter by priority
print_info "Filtering tickets by priority..."
FILTER_PRIORITY_RESPONSE=$(curl -s "$BASE_URL/support/admin/tickets?priority=urgent" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$FILTER_PRIORITY_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Filtered tickets by priority"
else
  print_result 1 "Failed to filter by priority"
fi

# 22. Search tickets
print_info "Searching tickets..."
SEARCH_RESPONSE=$(curl -s "$BASE_URL/support/admin/tickets?search=quality" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$SEARCH_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Searched tickets successfully"
else
  print_result 1 "Failed to search tickets"
fi

# 23. Get unassigned tickets
print_info "Fetching unassigned tickets..."
UNASSIGNED_RESPONSE=$(curl -s "$BASE_URL/support/admin/tickets?unassigned=true" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$UNASSIGNED_RESPONSE" | grep -q '"success":true'; then
  print_result 0 "Retrieved unassigned tickets"
else
  print_result 1 "Failed to retrieve unassigned tickets"
fi

# ============================================
# PHASE 6: CREATE ADDITIONAL TICKETS
# ============================================

print_header "PHASE 6: Creating Additional Test Tickets"

# Create tickets in different categories
CATEGORIES=("Delivery Issue" "Payment Problem" "Return/Refund" "General Inquiry")

for CATEGORY in "${CATEGORIES[@]}"; do
  print_info "Creating ticket with category: $CATEGORY..."
  
  CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/support/tickets" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -d '{
      "subject": "Test ticket for '"$CATEGORY"'",
      "description": "This is a test ticket for the '"$CATEGORY"' category",
      "category": "'"$CATEGORY"'",
      "priority": "medium"
    }')
  
  if echo "$CREATE_RESPONSE" | grep -q '"success":true'; then
    print_result 0 "Created ticket for $CATEGORY"
  else
    print_result 1 "Failed to create ticket for $CATEGORY"
  fi
done

# ============================================
# FINAL SUMMARY
# ============================================

print_header "TEST SUMMARY"
echo ""
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED! Support system is working correctly.${NC}"
  echo ""
  echo "📧 Email Notifications:"
  echo "   - If nodemailer is configured, check your email inbox"
  echo "   - User should receive: ticket creation confirmation, admin replies, status updates"
  echo "   - Admin should receive: new ticket alerts, user replies, reopen notifications"
  echo ""
  echo "Next steps:"
  echo "1. Configure nodemailer in .env file"
  echo "2. Test email notifications"
  echo "3. Integrate with frontend"
  exit 0
else
  echo -e "${RED}✗ SOME TESTS FAILED${NC}"
  echo "Please check the errors above and fix the issues."
  exit 1
fi
