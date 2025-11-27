import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const productService = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock);
      
      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.PRODUCTS.LIST}?${queryString}` : API_ENDPOINTS.PRODUCTS.LIST;
      
      return await api.get(url);
    } catch (error) {
      throw error;
    }
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    try {
      return await api.get(API_ENDPOINTS.PRODUCTS.DETAIL.replace(':slug', slug));
    } catch (error) {
      throw error;
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      return await api.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}`);
    } catch (error) {
      throw error;
    }
  },

  // Get new arrivals
  getNewArrivals: async (limit = 20) => {
    try {
      return await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?sortBy=newest&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },

  // Get by category
  getByCategory: async (category, filters = {}) => {
    try {
      return await productService.getProducts({ ...filters, category });
    } catch (error) {
      throw error;
    }
  },

  // Get featured products
  getFeatured: async (limit = 8) => {
    try {
      return await api.get(`${API_ENDPOINTS.PRODUCTS.LIST}?featured=true&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },
};

export default productService;
