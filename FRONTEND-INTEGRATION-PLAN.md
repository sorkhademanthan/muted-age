# Frontend-Backend Integration Plan
**Muted Age E-commerce Platform**

**Goal:** Integrate all 81 backend endpoints with frontend for seamless user experience

---

## 📊 Overview

### Backend Ready:
- ✅ 81 API endpoints
- ✅ Authentication (JWT)
- ✅ Products & Cart
- ✅ Orders & Reviews
- ✅ Support System
- ✅ User Profile & Wishlist

### Frontend Pages Found:
- Account.jsx, Profile.jsx
- Shop.jsx, Catalog.jsx, NewArrivals.jsx
- Cart.jsx, Checkout.jsx
- Orders.jsx, TrackOrders.jsx
- Reviews.jsx
- Support.jsx
- Contact.jsx

---

## 🎯 Integration Strategy (Step-by-Step)

### Phase 1: Setup API Services Layer (Day 1)
### Phase 2: Authentication Flow (Day 1-2)
### Phase 3: Product Browsing (Day 2)
### Phase 4: Shopping Cart (Day 3)
### Phase 5: Checkout & Orders (Day 4)
### Phase 6: User Features (Day 5)
### Phase 7: Support System (Day 5)
### Phase 8: Testing & Bug Fixes (Day 6-7)

---

## 📁 PHASE 1: Setup API Services Layer

### Step 1.1: Create API Configuration

**File:** `src/config/api.js`
```javascript
// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  
  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:slug',
    SEARCH: '/products/search',
  },
  
  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: '/cart/items/:itemId',
    REMOVE_ITEM: '/cart/items/:itemId',
    CLEAR: '/cart',
    APPLY_COUPON: '/cart/coupon',
    REMOVE_COUPON: '/cart/coupon',
    VALIDATE: '/cart/validate/checkout',
  },
  
  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: '/orders/:id',
    TRACK: '/orders/:id/tracking',
  },
  
  // Reviews
  REVIEWS: {
    LIST: '/products/:productId/reviews',
    CREATE: '/products/:productId/reviews',
    UPDATE: '/reviews/:reviewId',
    DELETE: '/reviews/:reviewId',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    WISHLIST: '/user/wishlist',
    ADD_TO_WISHLIST: '/user/wishlist/:productId',
    REMOVE_FROM_WISHLIST: '/user/wishlist/:productId',
    ADDRESSES: '/user/addresses',
    ADD_ADDRESS: '/user/addresses',
    UPDATE_ADDRESS: '/user/addresses/:addressId',
    DELETE_ADDRESS: '/user/addresses/:addressId',
  },
  
  // Support
  SUPPORT: {
    CREATE_TICKET: '/support/tickets',
    LIST_TICKETS: '/support/tickets',
    TICKET_DETAIL: '/support/tickets/:ticketId',
    ADD_MESSAGE: '/support/tickets/:ticketId/messages',
    REOPEN: '/support/tickets/:ticketId/reopen',
    SUMMARY: '/support/my-tickets/summary',
  },
};
```

---

### Step 1.2: Create API Service Utility

**File:** `src/services/api.js`
```javascript
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with error
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({ error: 'Network error. Please try again.' });
    } else {
      // Something else happened
      return Promise.reject({ error: 'An error occurred. Please try again.' });
    }
  }
);

export default api;
```

---

### Step 1.3: Create Service Files

**Create these files in `src/services/`:**

1. **authService.js** - Authentication
2. **productService.js** - Products
3. **cartService.js** - Shopping cart
4. **orderService.js** - Orders
5. **reviewService.js** - Reviews
6. **userService.js** - User profile/wishlist
7. **supportService.js** - Support tickets

---

## 📝 PHASE 2: Authentication Flow

### Backend Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Frontend Pages:
- Login/Register modal or page
- Account.jsx
- Profile.jsx

### Implementation:

**File:** `src/services/authService.js`
```javascript
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return await api.get(API_ENDPOINTS.AUTH.ME);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Check if logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
```

### User Flow:
1. User clicks "Login" → Show login modal
2. User enters credentials → Call `authService.login()`
3. On success → Store token, redirect to account
4. On protected pages → Check `authService.isAuthenticated()`
5. Auto-attach token to all API requests

---

## 🛍️ PHASE 3: Product Browsing

### Backend Endpoints:
- GET /api/products (with filters)
- GET /api/products/:slug
- GET /api/products/search?q=...

### Frontend Pages:
- Shop.jsx
- Catalog.jsx
- NewArrivals.jsx
- Product detail page

### Implementation:

**File:** `src/services/productService.js`
```javascript
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const productService = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?${params}`);
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    return await api.get(API_ENDPOINTS.PRODUCTS.DETAIL.replace(':slug', slug));
  },

  // Search products
  searchProducts: async (query) => {
    return await api.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}?q=${query}`);
  },

  // Get new arrivals
  getNewArrivals: async () => {
    return await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?sortBy=newest&limit=20`);
  },

  // Get by category
  getByCategory: async (category) => {
    return await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?category=${category}`);
  },
};
```

### User Flow:
1. User visits /shop → Load products with `productService.getProducts()`
2. User filters (category, price, etc.) → Update filters and reload
3. User clicks product → Get slug, call `productService.getProductBySlug(slug)`
4. Display product details, variants, images
5. User searches → Call `productService.searchProducts(query)`

---

## 🛒 PHASE 4: Shopping Cart

### Backend Endpoints:
- GET /api/cart
- POST /api/cart/items
- PUT /api/cart/items/:itemId
- DELETE /api/cart/items/:itemId
- DELETE /api/cart
- POST /api/cart/coupon
- POST /api/cart/validate/checkout

### Frontend Pages:
- Cart.jsx
- CartDrawer.jsx (mini cart)

### Implementation:

**File:** `src/services/cartService.js`
```javascript
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const cartService = {
  // Get cart
  getCart: async () => {
    return await api.get(API_ENDPOINTS.CART.GET);
  },

  // Add item to cart
  addItem: async (productId, variantId, quantity = 1) => {
    return await api.post(API_ENDPOINTS.CART.ADD_ITEM, {
      productId,
      variantId,
      quantity,
    });
  },

  // Update item quantity
  updateItem: async (itemId, quantity) => {
    return await api.put(
      API_ENDPOINTS.CART.UPDATE_ITEM.replace(':itemId', itemId),
      { quantity }
    );
  },

  // Remove item
  removeItem: async (itemId) => {
    return await api.delete(
      API_ENDPOINTS.CART.REMOVE_ITEM.replace(':itemId', itemId)
    );
  },

  // Clear cart
  clearCart: async () => {
    return await api.delete(API_ENDPOINTS.CART.CLEAR);
  },

  // Apply coupon
  applyCoupon: async (code) => {
    return await api.post(API_ENDPOINTS.CART.APPLY_COUPON, { code });
  },

  // Remove coupon
  removeCoupon: async () => {
    return await api.delete(API_ENDPOINTS.CART.REMOVE_COUPON);
  },

  // Validate cart for checkout
  validateCart: async () => {
    return await api.post(API_ENDPOINTS.CART.VALIDATE);
  },
};
```

### User Flow:
1. User adds product → Call `cartService.addItem()`
2. Show success notification, update cart count
3. User opens cart drawer → Call `cartService.getCart()`
4. Display items with images, prices, totals
5. User updates quantity → Call `cartService.updateItem()`
6. User removes item → Call `cartService.removeItem()`
7. User applies coupon → Call `cartService.applyCoupon(code)`
8. Before checkout → Call `cartService.validateCart()`

---

## 📦 PHASE 5: Checkout & Orders

### Backend Endpoints:
- POST /api/orders (create from cart)
- GET /api/orders
- GET /api/orders/:id
- GET /api/orders/:id/tracking

### Frontend Pages:
- Checkout.jsx
- OrderConfirmation.jsx
- Orders.jsx
- TrackOrders.jsx

### Implementation:

**File:** `src/services/orderService.js`
```javascript
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const orderService = {
  // Create order from cart
  createOrder: async (orderData) => {
    return await api.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
  },

  // Get user orders
  getOrders: async () => {
    return await api.get(API_ENDPOINTS.ORDERS.LIST);
  },

  // Get order details
  getOrderById: async (orderId) => {
    return await api.get(
      API_ENDPOINTS.ORDERS.DETAIL.replace(':id', orderId)
    );
  },

  // Track order
  trackOrder: async (orderId) => {
    return await api.get(
      API_ENDPOINTS.ORDERS.TRACK.replace(':id', orderId)
    );
  },
};
```

### User Flow:
1. User at checkout → Enters shipping address
2. User confirms order → Call `cartService.validateCart()`
3. If valid → Call `orderService.createOrder(orderData)`
4. On success → Show OrderConfirmation with order number
5. Cart is automatically cleared
6. User views orders → Call `orderService.getOrders()`
7. User tracks order → Call `orderService.trackOrder(orderId)`

---

## ⭐ PHASE 6: Reviews

### Backend Endpoints:
- GET /api/products/:productId/reviews
- POST /api/products/:productId/reviews
- PUT /api/reviews/:reviewId
- DELETE /api/reviews/:reviewId

### Frontend Pages:
- Product detail page (show reviews)
- Reviews.jsx (user's reviews)

### Implementation:

**File:** `src/services/reviewService.js`
```javascript
import api from './api';

export const reviewService = {
  // Get product reviews
  getProductReviews: async (productId, page = 1) => {
    return await api.get(`/products/${productId}/reviews?page=${page}`);
  },

  // Submit review
  submitReview: async (productId, reviewData) => {
    return await api.post(`/products/${productId}/reviews`, reviewData);
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    return await api.put(`/reviews/${reviewId}`, reviewData);
  },

  // Delete review
  deleteReview: async (reviewId) => {
    return await api.delete(`/reviews/${reviewId}`);
  },

  // Get user reviews
  getUserReviews: async () => {
    return await api.get('/reviews/my-reviews');
  },
};
```

### User Flow:
1. User views product → Load reviews with `reviewService.getProductReviews()`
2. Display ratings, review count, breakdown
3. User writes review (if purchased) → Call `reviewService.submitReview()`
4. User edits review → Call `reviewService.updateReview()`
5. User views all their reviews → Call `reviewService.getUserReviews()`

---

## 👤 PHASE 7: User Profile & Wishlist

### Backend Endpoints:
- GET /api/user/profile
- PUT /api/user/profile
- GET /api/user/wishlist
- POST /api/user/wishlist/:productId
- DELETE /api/user/wishlist/:productId
- GET /api/user/addresses
- POST /api/user/addresses
- PUT /api/user/addresses/:addressId

### Frontend Pages:
- Profile.jsx
- Account.jsx

### Implementation:

**File:** `src/services/userService.js`
```javascript
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const userService = {
  // Profile
  getProfile: async () => {
    return await api.get(API_ENDPOINTS.USER.PROFILE);
  },

  updateProfile: async (profileData) => {
    return await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
  },

  // Wishlist
  getWishlist: async () => {
    return await api.get(API_ENDPOINTS.USER.WISHLIST);
  },

  addToWishlist: async (productId) => {
    return await api.post(
      API_ENDPOINTS.USER.ADD_TO_WISHLIST.replace(':productId', productId)
    );
  },

  removeFromWishlist: async (productId) => {
    return await api.delete(
      API_ENDPOINTS.USER.REMOVE_FROM_WISHLIST.replace(':productId', productId)
    );
  },

  // Addresses
  getAddresses: async () => {
    return await api.get(API_ENDPOINTS.USER.ADDRESSES);
  },

  addAddress: async (addressData) => {
    return await api.post(API_ENDPOINTS.USER.ADD_ADDRESS, addressData);
  },

  updateAddress: async (addressId, addressData) => {
    return await api.put(
      API_ENDPOINTS.USER.UPDATE_ADDRESS.replace(':addressId', addressId),
      addressData
    );
  },

  deleteAddress: async (addressId) => {
    return await api.delete(
      API_ENDPOINTS.USER.DELETE_ADDRESS.replace(':addressId', addressId)
    );
  },
};
```

### User Flow:
1. User clicks profile → Load with `userService.getProfile()`
2. User updates profile → Call `userService.updateProfile()`
3. User adds to wishlist → Call `userService.addToWishlist()`
4. User views wishlist → Call `userService.getWishlist()`
5. User manages addresses → CRUD operations

---

## 🎫 PHASE 8: Support System

### Backend Endpoints:
- POST /api/support/tickets
- GET /api/support/tickets
- GET /api/support/tickets/:ticketId
- POST /api/support/tickets/:ticketId/messages
- POST /api/support/tickets/:ticketId/reopen
- GET /api/support/my-tickets/summary

### Frontend Pages:
- Support.jsx
- Contact.jsx (can link to support)

### Implementation:

**File:** `src/services/supportService.js`
```javascript
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const supportService = {
  // Create ticket
  createTicket: async (ticketData) => {
    return await api.post(API_ENDPOINTS.SUPPORT.CREATE_TICKET, ticketData);
  },

  // Get user tickets
  getTickets: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await api.get(`${API_ENDPOINTS.SUPPORT.LIST_TICKETS}?${params}`);
  },

  // Get ticket details
  getTicketById: async (ticketId) => {
    return await api.get(
      API_ENDPOINTS.SUPPORT.TICKET_DETAIL.replace(':ticketId', ticketId)
    );
  },

  // Add message to ticket
  addMessage: async (ticketId, message) => {
    return await api.post(
      API_ENDPOINTS.SUPPORT.ADD_MESSAGE.replace(':ticketId', ticketId),
      { message }
    );
  },

  // Reopen ticket
  reopenTicket: async (ticketId, reason) => {
    return await api.post(
      API_ENDPOINTS.SUPPORT.REOPEN.replace(':ticketId', ticketId),
      { reason }
    );
  },

  // Get summary
  getSummary: async () => {
    return await api.get(API_ENDPOINTS.SUPPORT.SUMMARY);
  },
};
```

### User Flow:
1. User needs help → Goes to Support.jsx
2. User creates ticket → Call `supportService.createTicket()`
3. Show ticket number (MUTED-2025-XXXX)
4. User views tickets → Call `supportService.getTickets()`
5. User opens ticket → Call `supportService.getTicketById()`
6. Display conversation thread
7. User replies → Call `supportService.addMessage()`
8. Real-time updates via polling or websockets (optional)

---

## 🧪 PHASE 9: Testing Strategy

### Test Each Feature:

1. **Authentication**
   - [ ] Register new user
   - [ ] Login with credentials
   - [ ] Token stored in localStorage
   - [ ] Protected routes redirect if not logged in
   - [ ] Logout clears token

2. **Products**
   - [ ] Load products list
   - [ ] Filter by category, price
   - [ ] Search functionality
   - [ ] Product detail loads correctly
   - [ ] Images display
   - [ ] Variants selectable

3. **Cart**
   - [ ] Add to cart works
   - [ ] Cart count updates
   - [ ] Update quantity works
   - [ ] Remove item works
   - [ ] Coupon applies correctly
   - [ ] Totals calculate correctly

4. **Checkout**
   - [ ] Cart validation works
   - [ ] Address form saves
   - [ ] Order creates successfully
   - [ ] Order number displayed
   - [ ] Cart clears after order

5. **Orders**
   - [ ] Order history loads
   - [ ] Order details show correctly
   - [ ] Track order works

6. **Reviews**
   - [ ] Reviews load on product page
   - [ ] Submit review works
   - [ ] Can edit own review
   - [ ] Star rating displays

7. **User Profile**
   - [ ] Profile loads
   - [ ] Update profile works
   - [ ] Wishlist add/remove works
   - [ ] Addresses CRUD works

8. **Support**
   - [ ] Create ticket works
   - [ ] Tickets list displays
   - [ ] Conversation thread shows
   - [ ] Reply to ticket works
   - [ ] Reopen works

---

## 🔧 Environment Setup

**File:** `.env` (in frontend root)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SITE_NAME=Muted Age
```

**For production:**
```env
REACT_APP_API_URL=https://yourdomain.com/api
```

---

## 📋 Implementation Checklist

### Setup (Day 1)
- [ ] Create `src/config/api.js`
- [ ] Create `src/services/api.js`
- [ ] Install axios: `npm install axios`
- [ ] Create all service files
- [ ] Test API connection

### Integration (Days 2-6)
- [ ] Phase 2: Authentication (1 day)
- [ ] Phase 3: Products (1 day)
- [ ] Phase 4: Cart (1 day)
- [ ] Phase 5: Orders (1 day)
- [ ] Phase 6: Reviews (0.5 day)
- [ ] Phase 7: User Features (0.5 day)
- [ ] Phase 8: Support (0.5 day)

### Testing (Days 6-7)
- [ ] Test all user flows
- [ ] Fix bugs
- [ ] Handle edge cases
- [ ] Test on mobile
- [ ] Performance optimization

### Polish (Day 7)
- [ ] Loading states
- [ ] Error messages
- [ ] Success notifications
- [ ] Empty states
- [ ] Responsive design check

---

## 🎯 Success Criteria

✅ **User can:**
- Register and login
- Browse and search products
- Add items to cart
- Complete checkout
- View order history
- Leave reviews
- Manage profile and wishlist
- Contact support
- Track tickets

✅ **No errors in:**
- Console logs
- Network requests
- User flows

✅ **Performance:**
- Fast load times
- Smooth interactions
- Proper loading states

---

## 🚀 Next Steps

1. **Review this plan** with your frontend developer
2. **Start with Phase 1** (API setup)
3. **Implement phase by phase** (don't skip!)
4. **Test each phase** before moving to next
5. **Fix bugs immediately** as you find them

**Estimated Timeline:** 5-7 days for complete integration

---

## 💡 Tips

1. **Use React Context** for global state (user, cart)
2. **Add loading spinners** for all API calls
3. **Handle errors gracefully** with toast notifications
4. **Use React Query** for caching (optional but recommended)
5. **Test on real devices**, not just browser
6. **Start simple**, add features incrementally

---

**Ready to start?** Begin with Phase 1 tomorrow! 🎯
