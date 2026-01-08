import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { cookieStorage } from '../utils/cookieStorage';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      cookieStorage.clear();
      window.location.replace('/signin');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
