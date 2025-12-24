import api from '../api';

export const userService = {
  requestPasswordReset: (email) =>
    api.post('/auth/password-reset/request', { email }),
  resetPassword: (data) => api.post('/auth/password-reset/verify', data),
  changePassword: (data) => api.post('/users/me/change-password', data),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  updateAvatar: (formData) => api.post('/users/me/avatar', formData),
  searchUsers: (query) => api.get('/users/search', { params: { query } }),
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (preferences) =>
    api.patch('/notifications/preferences', preferences),
};
