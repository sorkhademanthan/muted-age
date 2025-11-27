import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const supportService = {
  // Create ticket
  createTicket: async (ticketData) => {
    try {
      return await api.post(API_ENDPOINTS.SUPPORT.CREATE_TICKET, {
        subject: ticketData.subject,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority || 'medium',
        relatedOrderId: ticketData.relatedOrderId,
        relatedProductId: ticketData.relatedProductId,
      });
    } catch (error) {
      throw error;
    }
  },

  // Get user tickets
  getTickets: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      
      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.SUPPORT.LIST_TICKETS}?${queryString}` : API_ENDPOINTS.SUPPORT.LIST_TICKETS;
      
      return await api.get(url);
    } catch (error) {
      throw error;
    }
  },

  // Get ticket details
  getTicketById: async (ticketId) => {
    try {
      const url = API_ENDPOINTS.SUPPORT.TICKET_DETAIL.replace(':ticketId', ticketId);
      return await api.get(url);
    } catch (error) {
      throw error;
    }
  },

  // Add message to ticket
  addMessage: async (ticketId, message) => {
    try {
      const url = API_ENDPOINTS.SUPPORT.ADD_MESSAGE.replace(':ticketId', ticketId);
      return await api.post(url, { message });
    } catch (error) {
      throw error;
    }
  },

  // Reopen ticket
  reopenTicket: async (ticketId, reason) => {
    try {
      const url = API_ENDPOINTS.SUPPORT.REOPEN.replace(':ticketId', ticketId);
      return await api.post(url, { reason });
    } catch (error) {
      throw error;
    }
  },

  // Get summary
  getSummary: async () => {
    try {
      return await api.get(API_ENDPOINTS.SUPPORT.SUMMARY);
    } catch (error) {
      throw error;
    }
  },
};

export default supportService;
