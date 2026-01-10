
import apiClient from '../api.service';
import { API_ROUTES } from '../../config/api.config';

function appendFormData(formData, data, parentKey = null) {
  Object.keys(data).forEach(key => {
    const value = data[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File) {
      formData.append(formKey, value);
    } else if (value !== null && typeof value === 'object') {
      appendFormData(formData, value, formKey); // recursive for nested objects
    } else if (value !== undefined && value !== null) {
      formData.append(formKey, value);
    }
  });
}

export const profileService = {
  getProfile: async () => {
    const { data } = await apiClient.get(API_ROUTES.PROFILE);
    return data;
  },

  updateProfile: async (profileData) => {
    const formData = new FormData();
    // Object.keys(profileData).forEach((key) => {
    //   if (profileData[key] !== null && profileData[key] !== undefined) {
    //     if (profileData[key] instanceof File) {
    //       formData.append(key, profileData[key]);
    //     } else {
    //       formData.append(key, profileData[key]);
    //     }
    //   }
    // });

    appendFormData(formData, profileData);

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