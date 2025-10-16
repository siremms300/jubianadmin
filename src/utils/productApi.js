import { api } from './api';

export const productApi = {
    // Get all products with filters
    getProducts: async (params = {}) => {
        try {
            const response = await api.get('/api/products', { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch products');
        }
    },

    // Get single product
    getProduct: async (id) => {
        try {
            const response = await api.get(`/api/products/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch product');
        }
    },

    // Create product
    createProduct: async (formData) => {
        try {
            const response = await api.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create product');
        }
    },

    // Update product
    updateProduct: async (id, formData) => {
        try {
            const response = await api.put(`/api/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update product');
        }
    },

    // Delete product
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`/api/products/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete product');
        }
    },

    // Delete product image
    deleteProductImage: async (productId, imageId, type = 'images') => {
        try {
            let url;
            if (type === 'banners') {
                url = `/api/products/${productId}/banners/${imageId}`;
            } else {
                url = `/api/products/${productId}/images/${imageId}`;
            }
            const response = await api.delete(url);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete image');
        }
    },

    // Get product statistics
    getProductStats: async () => {
        try {
            const response = await api.get('/api/products/stats');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch product statistics');
        }
    }
};





