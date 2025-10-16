// utils/userApi.js
import { api } from './api';

export const userApi = {
  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('User API Error - updateProfile:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  // Update user password
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/api/users/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('User API Error - updatePassword:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  },

  // Upload avatar
  uploadAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await api.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('User API Error - uploadAvatar:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to upload avatar');
    }
  },

  // Delete avatar
  deleteAvatar: async () => {
    try {
      const response = await api.delete('/api/users/avatar');
      return response.data;
    } catch (error) {
      console.error('User API Error - deleteAvatar:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to delete avatar');
    }
  },

  // Admin functions
  admin: {
    // Get all users
    getUsers: async (params = {}) => {
      try {
        const response = await api.get('/api/users/admin/users', { params });
        return response.data;
      } catch (error) {
        console.error('Admin User API Error - getUsers:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
      }
    },

    // Get user stats
    getUserStats: async () => {
      try {
        const response = await api.get('/api/users/admin/users/stats');
        return response.data;
      } catch (error) {
        console.error('Admin User API Error - getUserStats:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
      }
    },

    // Get user by ID
    getUserById: async (id) => {
      try {
        const response = await api.get(`/api/users/admin/users/${id}`);
        return response.data;
      } catch (error) {
        console.error('Admin User API Error - getUserById:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to fetch user');
      }
    },

    // Update user status
    updateUserStatus: async (id, status) => {
      try {
        const response = await api.put(`/api/users/admin/users/${id}/status`, { status });
        return response.data;
      } catch (error) {
        console.error('Admin User API Error - updateUserStatus:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to update user status');
      }
    },

    // Update user role
    updateUserRole: async (id, role) => {
      try {
        const response = await api.put(`/api/users/admin/users/${id}/role`, { role });
        return response.data;
      } catch (error) {
        console.error('Admin User API Error - updateUserRole:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to update user role');
      }
    },

    // Delete user
    deleteUser: async (id) => {
      try {
        const response = await api.delete(`/api/users/admin/users/${id}`);
        return response.data;
      } catch (error) {
        console.error('Admin User API Error - deleteUser:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  }
};