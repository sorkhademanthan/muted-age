import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const cartService = {
  // Get cart
  getCart: async () => {
    try {
      return await api.get(API_ENDPOINTS.CART.GET);
    } catch (error) {
      throw error;
    }
  },

  // Add item to cart
  addItem: async (productId, variantId, quantity = 1) => {
    try {
      return await api.post(API_ENDPOINTS.CART.ADD_ITEM, {
        productId,
        variantId,
        quantity,
      });
    } catch (error) {
      throw error;
    }
  },

  // Update item quantity
  updateItem: async (itemId, quantity) => {
    try {
      return await api.put(
        API_ENDPOINTS.CART.UPDATE_ITEM.replace(':itemId', itemId),
        { quantity }
      );
    } catch (error) {
      throw error;
    }
  },

  // Remove item
  removeItem: async (itemId) => {
    try {
      return await api.delete(
        API_ENDPOINTS.CART.REMOVE_ITEM.replace(':itemId', itemId)
      );
    } catch (error) {
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      return await api.delete(API_ENDPOINTS.CART.CLEAR);
    } catch (error) {
      throw error;
    }
  },

  // Apply coupon
  applyCoupon: async (code) => {
    try {
      return await api.post(API_ENDPOINTS.CART.APPLY_COUPON, { code });
    } catch (error) {
      throw error;
    }
  },

  // Remove coupon
  removeCoupon: async () => {
    try {
      return await api.delete(API_ENDPOINTS.CART.REMOVE_COUPON);
    } catch (error) {
      throw error;
    }
  },

  // Validate cart for checkout
  validateCart: async () => {
    try {
      return await api.post(API_ENDPOINTS.CART.VALIDATE);
    } catch (error) {
      throw error;
    }
  },

  // Get cart summary
  getSummary: async () => {
    try {
      return await api.get(API_ENDPOINTS.CART.SUMMARY);
    } catch (error) {
      throw error;
    }
  },
};

export default cartService;
