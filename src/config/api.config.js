export const API_CONFIG = {
  BASE_URL: 'http://207.180.233.44:8001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const API_ROUTES = {
  // Authentication
  REGISTER: '/api/users/register/',
  LOGIN: '/api/users/login/',
  VERIFY_OTP: '/api/users/verify-otp/',
  RESEND_OTP: '/api/users/resend-otp/',
  REFRESH_TOKEN: '/api/users/token/refresh/',
  PASSWORD_RESET_REQUEST: '/api/users/password-reset-request/',
  PASSWORD_OTP_VERIFY: '/api/users/password-OTP-verify/',
  PASSWORD_RESET_CONFIRM: '/api/users/password-reset-confirm/',
  
  // Profile
  PROFILE: '/api/users/profile/',
  PROFILE_DELETE: '/api/users/profile/delete/',
  PROFILE_UPDATE: '/api/users/profile/',
};