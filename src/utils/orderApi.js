// utils/orderApi.js - Following the exact same pattern as productApi
import { api } from './api';

export const orderApi = {
  // Client functions - following productApi pattern
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/api/orders/create', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  getUserOrders: async () => {
    try {
      const response = await api.get('/api/orders');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/status`, { order_status: status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  // Admin functions - following the same clean pattern
  admin: {
    // Get all orders with filters (like productApi.getProducts)
    getOrders: async (params = {}) => {
      try {
        const response = await api.get('/api/orders/admin/all', { params });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch orders');
      }
    },

    // Get order by ID (like productApi.getProduct)
    getOrder: async (id) => {
      try {
        const response = await api.get(`/api/orders/admin/orders/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch order');
      }
    },

    // Update order status (like productApi.updateProduct)
    updateOrderStatus: async (id, status) => {
      try {
        const response = await api.put(`/api/orders/admin/orders/${id}/status`, { order_status: status });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update order status');
      }
    },

    // Delete order (like productApi.deleteProduct)
    deleteOrder: async (id) => {
      try {
        const response = await api.delete(`/api/orders/admin/orders/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete order');
      }
    },

    // Get order statistics (like productApi.getProductStats)
    getOrderStats: async () => {
      try {
        const response = await api.get('/api/orders/admin/stats');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch order statistics');
      }
    }
  }
};




































// // utils/orderApi.js - Add admin functions following client pattern
// export const orderApi = {
//   // ... existing client functions ...

//   // Admin functions - following the same pattern as client
//   admin: {
//     // Get all orders (admin only)
//     getAllOrders: async () => {
//       try {
//         const response = await api.get('/api/orders/admin/all');
//         return response.data;
//       } catch (error) {
//         console.error('Admin Order API Error - getAllOrders:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to fetch orders');
//       }
//     },

//     // Update order status (admin only)
//     updateOrderStatus: async (orderId, status) => {
//       try {
//         const response = await api.put(`/api/orders/admin/orders/${orderId}/status`, { order_status: status });
//         return response.data;
//       } catch (error) {
//         console.error('Admin Order API Error - updateOrderStatus:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to update order status');
//       }
//     },

//     // Delete order (admin only)
//     deleteOrder: async (orderId) => {
//       try {
//         const response = await api.delete(`/api/orders/admin/orders/${orderId}`);
//         return response.data;
//       } catch (error) {
//         console.error('Admin Order API Error - deleteOrder:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to delete order');
//       }
//     },

//     // Get order statistics (admin only)
//     getOrderStats: async () => {
//       try {
//         const response = await api.get('/api/orders/admin/stats');
//         return response.data;
//       } catch (error) {
//         console.error('Admin Order API Error - getOrderStats:', error.response?.data);
//         throw new Error(error.response?.data?.message || 'Failed to fetch order statistics');
//       }
//     }
//   }
// };












































// // // utils/orderApi.js - Updated with correct endpoints
// // export const orderApi = {
// //   // Create new order
// //   createOrder: async (orderData) => {
// //     try {
// //       const response = await api.post('/api/orders/create', orderData);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Order API Error - createOrder:', error.response?.data);
// //       throw new Error(error.response?.data?.message || 'Failed to create order');
// //     }
// //   },

// //   // Get user's orders
// //   getUserOrders: async () => {
// //     try {
// //       const response = await api.get('/api/orders');
// //       return response.data;
// //     } catch (error) {
// //       console.error('Order API Error - getUserOrders:', error.response?.data);
// //       throw new Error(error.response?.data?.message || 'Failed to fetch orders');
// //     }
// //   },

// //   // Get single order
// //   getOrder: async (orderId) => {
// //     try {
// //       const response = await api.get(`/api/orders/${orderId}`);
// //       return response.data;
// //     } catch (error) {
// //       console.error('Order API Error - getOrder:', error.response?.data);
// //       throw new Error(error.response?.data?.message || 'Failed to fetch order');
// //     }
// //   },

// //   // Admin functions
// //   admin: {
// //     // Get all orders (admin only) - CORRECTED ENDPOINT
// //     getAllOrders: async (params = {}) => {
// //       try {
// //         const response = await api.get('/api/orders/admin/all', { params });
// //         return response.data;
// //       } catch (error) {
// //         console.error('Admin Order API Error - getAllOrders:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to fetch orders');
// //       }
// //     },

// //     // Update order status (admin only) - CORRECTED ENDPOINT
// //     updateOrderStatus: async (orderId, status) => {
// //       try {
// //         const response = await api.put(`/api/orders/admin/orders/${orderId}/status`, { order_status: status });
// //         return response.data;
// //       } catch (error) {
// //         console.error('Admin Order API Error - updateOrderStatus:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to update order status');
// //       }
// //     },

// //     // Delete order (admin only) - CORRECTED ENDPOINT
// //     deleteOrder: async (orderId) => {
// //       try {
// //         const response = await api.delete(`/api/orders/admin/orders/${orderId}`);
// //         return response.data;
// //       } catch (error) {
// //         console.error('Admin Order API Error - deleteOrder:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to delete order');
// //       }
// //     },

// //     // Get order statistics (admin only) - CORRECTED ENDPOINT
// //     getOrderStats: async () => {
// //       try {
// //         const response = await api.get('/api/orders/admin/stats');
// //         return response.data;
// //       } catch (error) {
// //         console.error('Admin Order API Error - getOrderStats:', error.response?.data);
// //         throw new Error(error.response?.data?.message || 'Failed to fetch order statistics');
// //       }
// //     }
// //   }
// // };


































// // // // utils/orderApi.js - Fix the admin functions
// // // export const orderApi = {
// // //   // ... existing client functions ...

// // //   // Admin functions
// // //   admin: {
// // //     // Get all orders (admin only) - FIXED ENDPOINT
// // //     getAllOrders: async (params = {}) => {
// // //       try {
// // //         const response = await api.get('/api/orders/all', { params });
// // //         return response.data;
// // //       } catch (error) {
// // //         console.error('Admin Order API Error - getAllOrders:', error.response?.data);
// // //         throw new Error(error.response?.data?.message || 'Failed to fetch orders');
// // //       }
// // //     },

// // //     // Update order status (admin only) - FIXED ENDPOINT
// // //     updateOrderStatus: async (orderId, status) => {
// // //       try {
// // //         const response = await api.put(`/api/orders/orders/${orderId}/status`, { order_status: status });
// // //         return response.data;
// // //       } catch (error) {
// // //         console.error('Admin Order API Error - updateOrderStatus:', error.response?.data);
// // //         throw new Error(error.response?.data?.message || 'Failed to update order status');
// // //       }
// // //     },

// // //     // Delete order (admin only) - FIXED ENDPOINT
// // //     deleteOrder: async (orderId) => {
// // //       try {
// // //         const response = await api.delete(`/api/orders/orders/${orderId}`);
// // //         return response.data;
// // //       } catch (error) {
// // //         console.error('Admin Order API Error - deleteOrder:', error.response?.data);
// // //         throw new Error(error.response?.data?.message || 'Failed to delete order');
// // //       }
// // //     },

// // //     // Get order statistics (admin only) - FIXED ENDPOINT
// // //     getOrderStats: async () => {
// // //       try {
// // //         const response = await api.get('/api/orders/orders/stats');
// // //         return response.data;
// // //       } catch (error) {
// // //         console.error('Admin Order API Error - getOrderStats:', error.response?.data);
// // //         throw new Error(error.response?.data?.message || 'Failed to fetch order statistics');
// // //       }
// // //     }
// // //   }
// // // };
































// // // // // utils/orderApi.js - Add admin functions
// // // // import { api } from './api';

// // // // export const orderApi = {
// // // //   // Create new order
// // // //   createOrder: async (orderData) => {
// // // //     try {
// // // //       const response = await api.post('/api/orders/create', orderData);
// // // //       return response.data;
// // // //     } catch (error) {
// // // //       console.error('Order API Error - createOrder:', error.response?.data);
// // // //       throw new Error(error.response?.data?.message || 'Failed to create order');
// // // //     }
// // // //   },

// // // //   // Get user's orders
// // // //   getUserOrders: async () => {
// // // //     try {
// // // //       const response = await api.get('/api/orders');
// // // //       return response.data;
// // // //     } catch (error) {
// // // //       console.error('Order API Error - getUserOrders:', error.response?.data);
// // // //       throw new Error(error.response?.data?.message || 'Failed to fetch orders');
// // // //     }
// // // //   },

// // // //   // Get single order
// // // //   getOrder: async (orderId) => {
// // // //     try {
// // // //       const response = await api.get(`/api/orders/${orderId}`);
// // // //       return response.data;
// // // //     } catch (error) {
// // // //       console.error('Order API Error - getOrder:', error.response?.data);
// // // //       throw new Error(error.response?.data?.message || 'Failed to fetch order');
// // // //     }
// // // //   },

// // // //   // Admin functions
// // // //   admin: {
// // // //     // Get all orders (admin only)
// // // //     getAllOrders: async (params = {}) => {
// // // //       try {
// // // //         const response = await api.get('/api/orders/all', { params });
// // // //         return response.data;
// // // //       } catch (error) {
// // // //         console.error('Admin Order API Error - getAllOrders:', error.response?.data);
// // // //         throw new Error(error.response?.data?.message || 'Failed to fetch orders');
// // // //       }
// // // //     },

// // // //     // Update order status (admin only)
// // // //     updateOrderStatus: async (orderId, status) => {
// // // //       try {
// // // //         const response = await api.put(`/api/orders/${orderId}/status`, { order_status: status });
// // // //         return response.data;
// // // //       } catch (error) {
// // // //         console.error('Admin Order API Error - updateOrderStatus:', error.response?.data);
// // // //         throw new Error(error.response?.data?.message || 'Failed to update order status');
// // // //       }
// // // //     },

// // // //     // Delete order (admin only)
// // // //     deleteOrder: async (orderId) => {
// // // //       try {
// // // //         const response = await api.delete(`/api/orders/${orderId}`);
// // // //         return response.data;
// // // //       } catch (error) {
// // // //         console.error('Admin Order API Error - deleteOrder:', error.response?.data);
// // // //         throw new Error(error.response?.data?.message || 'Failed to delete order');
// // // //       }
// // // //     },

// // // //     // Get order statistics (admin only)
// // // //     getOrderStats: async () => {
// // // //       try {
// // // //         const response = await api.get('/api/orders/stats');
// // // //         return response.data;
// // // //       } catch (error) {
// // // //         console.error('Admin Order API Error - getOrderStats:', error.response?.data);
// // // //         throw new Error(error.response?.data?.message || 'Failed to fetch order statistics');
// // // //       }
// // // //     }
// // // //   }
// // // // };
