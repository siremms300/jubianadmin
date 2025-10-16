import { api } from './api';

export const categoryApi = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/api/categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  // Create category with image - ADD DEBUGGING
  createCategory: async (formData) => {
    try {
      console.log('FormData contents:');
      
      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await api.post('/api/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Response:', response);
      return response.data;
    } catch (error) {
      console.error('Upload error details:', error);
      console.error('Error response:', error.response);
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  },

  // Update category with image - ADD DEBUGGING
  updateCategory: async (id, formData) => {
    try {
      console.log('Update FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await api.put(`/api/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Update response:', response);
      return response.data;
    } catch (error) {
      console.error('Update error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  },

  
  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  },

  // Get main categories for client
  getMainCategories: async () => {
    try {
      const response = await api.get('/api/categories/client/main');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch main categories');
    }
  }, 

  getCategoriesForProducts: async () => {
      try {
          const response = await api.get('/api/categories');
          return response.data;
      } catch (error) {
          throw new Error(error.response?.data?.message || 'Failed to fetch categories');
      }
    },

  // Get categories with full hierarchy
    getCategoryHierarchy: async () => {
      try {
          const response = await api.get('/api/categories/hierarchy');
          return response.data;
      } catch (error) {
          throw new Error(error.response?.data?.message || 'Failed to fetch category hierarchy');
      }
    }

  
};









    

    






























// import { api } from "./api";

// export const categoryApi = {
//   // Get all categories
//   getCategories: async () => {
//     try {
//       const response = await api.get('/api/categories');
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch categories');
//     }
//   },

//   // Get single category
//   getCategory: async (id) => {
//     try {
//       const response = await api.get(`/api/categories/${id}`);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch category');
//     }
//   },

//   // Create category with image
//   createCategory: async (formData) => {
//     try {
//       const response = await api.post('/api/categories', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to create category');
//     }
//   },

//   // Update category with image
//   updateCategory: async (id, formData) => {
//     try {
//       const response = await api.put(`/api/categories/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to update category');
//     }
//   },

//   // Delete category
//   deleteCategory: async (id) => {
//     try {
//       const response = await api.delete(`/api/categories/${id}`);
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to delete category');
//     }
//   },

//   // Get main categories for client
//   getMainCategories: async () => {
//     try {
//       const response = await api.get('/api/categories/client/main');
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch main categories');
//     }
//   }
// };