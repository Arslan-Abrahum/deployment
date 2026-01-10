
import { createSlice } from '@reduxjs/toolkit';
import { deleteProfile, fetchProfile, updateProfile } from '../actions/profileActions';

const initialState = {
  profile: null,
  loading: false,
  isEditing: false,
  isDeleting: false,
  error: null,
};

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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isEditing = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isEditing = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isEditing = false;
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