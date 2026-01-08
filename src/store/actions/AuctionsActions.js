// fetchAuctionDetail, fetchCategories, getAuctions, getCategoryDetail
import { createAsyncThunk } from '@reduxjs/toolkit';
import { auctionService } from '../../services/interceptors/auction.service';
import { toast } from 'react-toastify';


export const fetchAuctionsList = createAsyncThunk(
  'auctions/fetchAuctionsList',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Transform filter parameters for backend
      const queryParams = {
        page: params.page || 1,
        ...params
      };

      // Handle category filtering (could be array or single value)
      if (params.category) {
        if (Array.isArray(params.category)) {
          queryParams.category = params.category.join(',');
        }
      }

      // Handle status filtering
      if (params.status) {
        if (Array.isArray(params.status)) {
          queryParams.status = params.status.join(',');
        }
      }

      // Remove undefined values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await auctionService.getAuctions(queryParams);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to fetch auctions list';
      
      // Don't show toast for 401 errors (handled by interceptor)
      if (error.response?.status !== 401) {
        toast.error(message);
      }
      
      return rejectWithValue({ 
        message, 
        status: error.response?.status,
        data: error.response?.data 
      });
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'seller/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await auctionService.getCategories();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch categories';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const fetchCategoryDetail = createAsyncThunk(
  'all/fetchCategoryDetail',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await auctionService.getCategoryDetail(categoryId);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch category details';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);