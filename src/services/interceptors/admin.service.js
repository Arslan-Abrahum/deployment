
import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';

export const adminService = {
  // Get Admin Dashboard Data
  getDashboard: async () => {
    try {
      const { data } = await apiClient.get(API_ROUTES.ADMIN_DASHBOARD);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // User Actions (Verify Seller, Promote to Manager, etc.)
  performUserAction: async (actionData) => {
    try {
      const { data } = await apiClient.post(
        API_ROUTES.ADMIN_USER_ACTION,
        actionData
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Assign Auction to Manager
  assignAuctionToManager: async (assignmentData) => {
    try {
      const { data } = await apiClient.post(
        API_ROUTES.ADMIN_ASSIGN_AUCTION,
        assignmentData
      );
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get List of Users
  getUsersList: async (params = {}) => {
    try {
      const { data } = await apiClient.get(API_ROUTES.ADMIN_USERS_LIST, {
        params,
      });
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get Categories List
  getCategories: async () => {
    try {
      const { data } = await apiClient.get('/api/auctions/categories/');
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Create Category
  createCategory: async (categoryData) => {
    try {
      const { data } = await apiClient.post('/api/auctions/categories/', categoryData);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Update Category
  updateCategory: async (categoryId, categoryData) => {
    try {
      const { data } = await apiClient.post(`/api/auctions/categories/${categoryId}/`, categoryData);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Delete Category
  deleteCategory: async (categoryId) => {
    try {
      const { data } = await apiClient.delete(`/api/auctions/categories/${categoryId}/`);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get Auction Listings
  getAuctionListings: async (params = {}) => {
    try {
      const { data } = await apiClient.get(API_ROUTES.AUCTION_LISTINGS, {
        params,
      });
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },

  // Get Single Auction by ID
  getAuctionById: async (auctionId) => {
    try {
      const { data } = await apiClient.get(`${API_ROUTES.AUCTION_LISTINGS}${auctionId}/`);
      return data;
    } catch (error) {
      if (error.isNetworkError) {
        throw new Error('Unable to connect to server. Please try again later.');
      }
      throw error;
    }
  },
};