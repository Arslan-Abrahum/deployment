import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '../../services/interceptors/profile.service';
import { toast } from 'react-toastify';


// Async Thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Failed to fetch profile';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (profileData, { rejectWithValue }) => {
    console.log('Updating profile with data:', profileData);
    
    try {
      const response = await profileService.updateProfile(profileData);
      toast.success('Profile updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Failed to update profile';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'profile/delete',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.deleteProfile();
      toast.success('Profile deleted successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Failed to delete profile';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);