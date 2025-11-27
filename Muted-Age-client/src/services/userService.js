import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const userService = {
  // === PROFILE ===
  getProfile: async () => {
    try {
      return await api.get(API_ENDPOINTS.USER.PROFILE);
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      return await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
    } catch (error) {
      throw error;
    }
  },

  getDashboard: async () => {
    try {
      return await api.get(API_ENDPOINTS.USER.DASHBOARD);
    } catch (error) {
      throw error;
    }
  },

  getActivity: async () => {
    try {
      return await api.get(API_ENDPOINTS.USER.ACTIVITY);
    } catch (error) {
      throw error;
    }
  },

  // === WISHLIST ===
  getWishlist: async () => {
    try {
      return await api.get(API_ENDPOINTS.USER.WISHLIST);
    } catch (error) {
      throw error;
    }
  },

  addToWishlist: async (productId) => {
    try {
      const url = API_ENDPOINTS.USER.ADD_TO_WISHLIST.replace(':productId', productId);
      return await api.post(url);
    } catch (error) {
      throw error;
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const url = API_ENDPOINTS.USER.REMOVE_FROM_WISHLIST.replace(':productId', productId);
      return await api.delete(url);
    } catch (error) {
      throw error;
    }
  },

  checkWishlist: async (productId) => {
    try {
      const url = API_ENDPOINTS.USER.CHECK_WISHLIST.replace(':productId', productId);
      return await api.get(url);
    } catch (error) {
      throw error;
    }
  },

  clearWishlist: async () => {
    try {
      return await api.delete(API_ENDPOINTS.USER.CLEAR_WISHLIST);
    } catch (error) {
      throw error;
    }
  },

  // === ADDRESSES ===
  getAddresses: async () => {
    try {
      return await api.get(API_ENDPOINTS.USER.ADDRESSES);
    } catch (error) {
      throw error;
    }
  },

  addAddress: async (addressData) => {
    try {
      return await api.post(API_ENDPOINTS.USER.ADD_ADDRESS, addressData);
    } catch (error) {
      throw error;
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      const url = API_ENDPOINTS.USER.UPDATE_ADDRESS.replace(':addressId', addressId);
      return await api.put(url, addressData);
    } catch (error) {
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const url = API_ENDPOINTS.USER.DELETE_ADDRESS.replace(':addressId', addressId);
      return await api.delete(url);
    } catch (error) {
      throw error;
    }
  },

  setDefaultAddress: async (addressId) => {
    try {
      const url = API_ENDPOINTS.USER.SET_DEFAULT_ADDRESS.replace(':addressId', addressId);
      return await api.patch(url);
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
