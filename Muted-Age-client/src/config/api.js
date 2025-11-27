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
    SUMMARY: '/cart/summary',
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
    PRODUCT_REVIEWS: '/products/:productId/reviews',
    CREATE: '/products/:productId/reviews',
    UPDATE: '/reviews/:reviewId',
    DELETE: '/reviews/:reviewId',
    MY_REVIEWS: '/reviews/my-reviews',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    DASHBOARD: '/user/dashboard',
    ACTIVITY: '/user/activity',
    
    // Wishlist
    WISHLIST: '/user/wishlist',
    ADD_TO_WISHLIST: '/user/wishlist/:productId',
    REMOVE_FROM_WISHLIST: '/user/wishlist/:productId',
    CHECK_WISHLIST: '/user/wishlist/check/:productId',
    CLEAR_WISHLIST: '/user/wishlist',
    
    // Addresses
    ADDRESSES: '/user/addresses',
    ADD_ADDRESS: '/user/addresses',
    UPDATE_ADDRESS: '/user/addresses/:addressId',
    DELETE_ADDRESS: '/user/addresses/:addressId',
    SET_DEFAULT_ADDRESS: '/user/addresses/:addressId/default',
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
