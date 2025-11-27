import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const orderService = {
  // Create order from cart
  createOrder: async (orderData) => {
    try {
      return await api.post(API_ENDPOINTS.ORDERS.CREATE, {
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        paymentMethod: orderData.paymentMethod || 'COD',
        shippingCost: orderData.shippingCost || 0,
        orderNotes: orderData.orderNotes || '',
      });
    } catch (error) {
      throw error;
    }
  },

  // Get user orders
  getOrders: async (page = 1, limit = 10) => {
    try {
      return await api.get(`${API_ENDPOINTS.ORDERS.LIST}?page=${page}&limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },

  // Get order details
  getOrderById: async (orderId) => {
    try {
      return await api.get(
        API_ENDPOINTS.ORDERS.DETAIL.replace(':id', orderId)
      );
    } catch (error) {
      throw error;
    }
  },

  // Track order
  trackOrder: async (orderId) => {
    try {
      return await api.get(
        API_ENDPOINTS.ORDERS.TRACK.replace(':id', orderId)
      );
    } catch (error) {
      throw error;
    }
  },
};

export default orderService;
