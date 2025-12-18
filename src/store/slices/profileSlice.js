
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '../../services/interceptors/profile.service';
import { toast } from 'react-toastify';

const initialState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

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

// Profile Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });

    // Delete Profile
    builder
      .addCase(deleteProfile.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.isDeleting = false;
        state.profile = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;