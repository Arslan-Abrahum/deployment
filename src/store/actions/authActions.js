import {createAsyncThunk} from '@reduxjs/toolkit'
import { authService } from '../../services/interceptors/auth.service';
import { toast } from 'react-toastify';


export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      toast.success('Registration successful! Please verify your OTP.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Registration failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Login failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(otpData);
      toast.success('OTP verified successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'OTP verification failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp(email);
      toast.success('OTP resent successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Failed to resend OTP';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken(refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Token refresh failed' });
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.requestPasswordReset(email);
      toast.success('Password reset OTP sent to your email!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Failed to send reset email';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const verifyPasswordOtp = createAsyncThunk(
  'auth/verifyPasswordOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyPasswordOtp(otpData);
      toast.success('OTP verified! You can now reset your password.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'OTP verification failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await authService.confirmPasswordReset(resetData);
      toast.success('Password reset successful! Please login.');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Password reset failed';
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);