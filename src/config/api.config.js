// export const API_CONFIG = {
//   BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://207.180.233.44:8001',

//   TIMEOUT: 30000,
//   IS_PRODUCTION: import.meta.env.PROD,
//   IS_DEVELOPMENT: import.meta.env.DEV,
//   APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
// };

// export const API_CONFIG = {
//   BASE_URL: import.meta.env.PROD ? '/api' : 'http://207.180.233.44:8001/api',
//   TIMEOUT: 30000,

//   IS_PRODUCTION: import.meta.env.PROD,
//   IS_DEVELOPMENT: import.meta.env.DEV,
//   MEDIA_BASE_URL: import.meta.env.VITE_MEDIA_BASE_URL,
//   APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
// };

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  MEDIA_BASE_URL: import.meta.env.VITE_MEDIA_BASE_URL,

  TIMEOUT: 30000,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
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

  // Admin Routes
  ADMIN_DASHBOARD: '/api/inspections/admin/dashboard/',
  ADMIN_USER_ACTION: '/api/inspections/admin/user-action/',
  ADMIN_ASSIGN_AUCTION: '/api/inspections/admin/assign/',
  ADMIN_USERS_LIST: '/api/inspections/admin/users/',
  ADMIN_UPDATE_USER: '/api/users/admin/', // + userId + /update/
  ADMIN_CREATE_STAFF: '/api/users/admin/create-staff/',
  AUCTION_LISTINGS: '/api/auctions/listings/',
  FETCH_CATEGORIES: '/api/auctions/categories/',
  CREATE_CATEGORY: '/api/auctions/categories/',
  UPDATE_CATEGORY: '/api/auctions/categories/',
  DELETE_CATEGORY: '/api/auctions/categories/',
  TOGGLE_CATEGORY: '/api/auctions/categories/', // + categoryId + /toggle/

  // Manager Routes
  MANAGER_TASKS: '/api/inspections/manager/tasks/',
  MANAGER_INSPECT: '/api/inspections/manager/inspect/', // + auction_id
  INSPECTION_REPORTS: '/api/inspections/reports/',
  INSPECTION_REPORT_DETAIL: '/api/inspections/reports/', // + report_id

  // Checklist/Template Routes
  INSPECTION_TEMPLATES: '/api/inspections/templates/',
  INSPECTION_TEMPLATE_DETAIL: '/api/inspections/templates/', // + template_id

  //// Auction Routes (Common for all)
  AUCTIONS_LIST: '/api/auctions/listings/',
  // AUCTION_DETAIL: '/api/auctions/listings/', // + auction_id
  AUCTION_CATEGORIES: '/api/auctions/categories/',
  AUCTION_CATEGORY_DETAIL: '/api/auctions/categories/', // + category_id

  // Seller Routes
  CREATE_AUCTION: '/api/auctions/listings/',
  UPDATE_AUCTION: '/api/auctions/listings/', // + auction_id
  DELETE_AUCTION: '/api/auctions/listings/', // + auction_id

  AUCTION_APPROVAL_REQUEST: '/api/auctions/listings/',
  AUCTION_ACTION: '/api/auctions/listings/', // + auction_id + /action/

  // Buyer Routes
  PLACE_BID: '/api/auctions/bid/',
  GET_AUCTION_BIDS: '/api/auctions/listings/', // + auction_id + /bids/

  AUCTION_BID_HISTORY: '/api/auctions/listings/', // + auction_id + /bid-history/
  BIDS_LIST: '/api/auctions/bids/my/',
  // BIDS_NO: '/api/auctions/bids//my/',
  WATCH_LIST: '/api/auctions/watchlist/',

};