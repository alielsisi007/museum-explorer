import axios from 'axios';

const API_BASE_URL = 'https://mern-product-production.up.railway.app';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies-based auth
});

// Request interceptor to add auth token (for localStorage fallback)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect automatically, let the app handle it
    }
    return Promise.reject(error);
  }
);

// Auth API - matches your backend routes
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/logIn', { email, password }),
  
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/register', data),
  
  getProfile: () => api.get('/profile'),
  
  updateProfile: (data: { name?: string; email?: string; password?: string }) =>
    api.put('/profile', data),
};

// Tickets API (for ticket types)
export const ticketsAPI = {
  getTypes: () => api.get('/tickets'),
  getById: (id: string) => api.get(`/tickets/${id}`),
};

// Posts/Exhibits API - matches your backend routes
export const exhibitsAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/posts', { params }),
  
  getById: (id: string) => api.get(`/posts/${id}`),
  
  // Admin routes
  create: (data: FormData) => 
    api.post('/admin/createPost', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, data: FormData) =>
    api.put(`/admin/updatePost/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: string) => api.delete(`/admin/deletePost/${id}`),
};

// Bookings API - matches your backend routes
export const bookingsAPI = {
  // User routes (requires verifyUser middleware)
  getMyBookings: () => api.get('/bookings'),
  
  create: (data: {
    ticketType?: string;
    quantity: number;
    visitDate: string;
    totalPrice: number;
  }) => api.post('/bookings', data),
  
  update: (id: string, data: object) => api.put(`/bookings/${id}`, data),
  
  cancel: (id: string) => api.delete(`/bookings/${id}`),
  
  // Admin route (requires verifyAdmin middleware)
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/bookings', { params }),
};

// Admin API - matches your backend routes
export const adminAPI = {
  getUsers: (params?: { page?: number; limit?: number; role?: string }) =>
    api.get('/admin/users', { params }),
  
  deleteUser: (userId: string) => 
    api.delete('/admin/deleteUserAccount', { data: { userId } }),
  
  updateUserToAdmin: (userId: string) => 
    api.put('/admin/updateUserToAdmin', { userId }),
  
  // Stats endpoint (if available, otherwise we'll use fallback)
  getStats: () => api.get('/admin/stats'),
  
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
