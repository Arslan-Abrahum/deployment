
import { createSlice } from '@reduxjs/toolkit';
import { cookieStorage } from '../../utils/cookieStorage';
import { registerUser, loginUser, verifyOtp, resendOtp, refreshAccessToken, requestPasswordReset, verifyPasswordOtp, confirmPasswordReset } from '../actions/authActions';

// Initial State
const initialState = {
  user: cookieStorage.getItem(cookieStorage.AUTH_KEYS.USER) || null,
  token: cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN) || null,
  refreshToken: cookieStorage.getItem(cookieStorage.AUTH_KEYS.REFRESH_TOKEN) || null,
  isAuthenticated: !!cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN),
  isLoading: false,
  error: null,
  
  // Registration state
  registrationData: null,
  isRegistering: false,
  registrationError: null,
  
  // OTP state
  isVerifyingOtp: false,
  otpError: null,
  isResendingOtp: false,
  
  // Password reset state
  isRequestingReset: false,
  resetRequestError: null,
  resetToken: null,
  isVerifyingResetOtp: false,
  isConfirmingReset: false,
};


// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      cookieStorage.clear();
      toast.info('Logged out successfully');
    },
    
    clearError: (state) => {
      state.error = null;
      state.registrationError = null;
      state.otpError = null;
      state.resetRequestError = null;
    },
    
    clearRegistrationData: (state) => {
      state.registrationData = null;
      state.registrationError = null;
    },
    
    clearResetToken: (state) => {
      state.resetToken = null;
    },
  },
  extraReducers: (builder) => {
    // Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.registrationError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.registrationData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegistering = false;
        state.registrationError = action.payload;
      });

    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;

        // Save to cookies
        cookieStorage.setItem(cookieStorage.AUTH_KEYS.USER, action.payload.user);
        cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN, action.payload.access);
        cookieStorage.setItem(cookieStorage.AUTH_KEYS.REFRESH_TOKEN, action.payload.refresh);
        cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN_TIMESTAMP, Date.now());
        if (action.payload.user?.role) {
          cookieStorage.setItem(cookieStorage.AUTH_KEYS.ROLE, action.payload.user.role);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isVerifyingOtp = true;
        state.otpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isVerifyingOtp = false;
        // If OTP verification returns tokens, authenticate the user
        if (action.payload.access && action.payload.refresh) {
          state.user = action.payload.user;
          state.token = action.payload.access;
          state.refreshToken = action.payload.refresh;
          state.isAuthenticated = true;

          cookieStorage.setItem(cookieStorage.AUTH_KEYS.USER, action.payload.user);
          cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN, action.payload.access);
          cookieStorage.setItem(cookieStorage.AUTH_KEYS.REFRESH_TOKEN, action.payload.refresh);
          cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN_TIMESTAMP, Date.now());
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isVerifyingOtp = false;
        state.otpError = action.payload;
      });

    // Resend OTP
    builder
      .addCase(resendOtp.pending, (state) => {
        state.isResendingOtp = true;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isResendingOtp = false;
      })
      .addCase(resendOtp.rejected, (state) => {
        state.isResendingOtp = false;
      });

    // Refresh Token
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload.access;
        cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN, action.payload.access);
        cookieStorage.setItem(cookieStorage.AUTH_KEYS.TOKEN_TIMESTAMP, Date.now());
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        cookieStorage.clear();
      });

    // Request Password Reset
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.isRequestingReset = true;
        state.resetRequestError = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isRequestingReset = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isRequestingReset = false;
        state.resetRequestError = action.payload;
      });

    // Verify Password OTP
    builder
      .addCase(verifyPasswordOtp.pending, (state) => {
        state.isVerifyingResetOtp = true;
      })
      .addCase(verifyPasswordOtp.fulfilled, (state, action) => {
        state.isVerifyingResetOtp = false;
        state.resetToken = action.payload.reset_token;
      })
      .addCase(verifyPasswordOtp.rejected, (state) => {
        state.isVerifyingResetOtp = false;
      });

    // Confirm Password Reset
    builder
      .addCase(confirmPasswordReset.pending, (state) => {
        state.isConfirmingReset = true;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.isConfirmingReset = false;
        state.resetToken = null;
      })
      .addCase(confirmPasswordReset.rejected, (state) => {
        state.isConfirmingReset = false;
      });
  },
});

export const { logout, clearError, clearRegistrationData, clearResetToken } = authSlice.actions;
export default authSlice.reducer;
