
import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';

export const authService = {
  register: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });
    const { data } = await apiClient.post(API_ROUTES.REGISTER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('data: ', data);
    return data;
  },

  login: async (credentials) => {
    console.log("Credentials: ", credentials);
    
    const { data } = await apiClient.post(API_ROUTES.LOGIN, credentials);
    console.log("Data: ", data);
    
    return data;
  },

  verifyOtp: async (otpData) => {
    const formData = new FormData();
    formData.append('email', otpData.email);
    formData.append('code', otpData.code);
    const { data } = await apiClient.post(API_ROUTES.VERIFY_OTP, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  resendOtp: async (email) => {
    const { data } = await apiClient.post(API_ROUTES.RESEND_OTP, { email });
    return data;
  },

  refreshToken: async (refreshToken) => {
    const { data } = await apiClient.post(API_ROUTES.REFRESH_TOKEN, {
      refresh: refreshToken,
    });
    return data;
  },

  requestPasswordReset: async (email) => {
    const { data } = await apiClient.post(API_ROUTES.PASSWORD_RESET_REQUEST, {
      email,
    });
    return data;
  },

  verifyPasswordOtp: async (otpData) => {
    const { data } = await apiClient.post(
      API_ROUTES.PASSWORD_OTP_VERIFY,
      otpData
    );
    return data;
  },

  confirmPasswordReset: async (resetData) => {
    const { data } = await apiClient.post(
      API_ROUTES.PASSWORD_RESET_CONFIRM,
      resetData
    );
    return data;
  },
};