
import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';

export const profileService = {
  getProfile: async () => {
    const { data } = await apiClient.get(API_ROUTES.PROFILE);
    return data;
  },

  updateProfile: async (profileData) => {
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        if (profileData[key] instanceof File) {
          formData.append(key, profileData[key]);
        } else {
          formData.append(key, profileData[key]);
        }
      }
    });
    const { data } = await apiClient.patch(API_ROUTES.PROFILE_UPDATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteProfile: async () => {
    const { data } = await apiClient.delete(API_ROUTES.PROFILE_DELETE);
    return data;
  },
};