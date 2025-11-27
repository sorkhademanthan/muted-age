import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const reviewService = {
  // Get product reviews
  getProductReviews: async (productId, page = 1, limit = 10) => {
    try {
      const url = API_ENDPOINTS.REVIEWS.PRODUCT_REVIEWS.replace(':productId', productId);
      return await api.get(`${url}?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },

  // Submit review
  submitReview: async (productId, reviewData) => {
    try {
      const url = API_ENDPOINTS.REVIEWS.CREATE.replace(':productId', productId);
      return await api.post(url, {
        orderId: reviewData.orderId,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
      });
    } catch (error) {
      throw error;
    }
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const url = API_ENDPOINTS.REVIEWS.UPDATE.replace(':reviewId', reviewId);
      return await api.put(url, {
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
      });
    } catch (error) {
      throw error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const url = API_ENDPOINTS.REVIEWS.DELETE.replace(':reviewId', reviewId);
      return await api.delete(url);
    } catch (error) {
      throw error;
    }
  },

  // Get user reviews
  getUserReviews: async () => {
    try {
      return await api.get(API_ENDPOINTS.REVIEWS.MY_REVIEWS);
    } catch (error) {
      throw error;
    }
  },
};

export default reviewService;
