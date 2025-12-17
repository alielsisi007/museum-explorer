import axios from 'axios';

const API_BASE_URL = 'https://mern-product-production.up.railway.app';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/users/login', { email, password }),
  
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/api/users/register', data),
  
  getProfile: () => api.get('/api/users/profile'),
  
  updateProfile: (data: { name?: string; email?: string; password?: string }) =>
    api.put('/api/users/profile', data),
};

// Exhibits API
export const exhibitsAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/api/exhibits', { params }),
  
  getById: (id: string) => api.get(`/api/exhibits/${id}`),
  
  create: (data: FormData | object) => api.post('/api/exhibits', data),
  
  update: (id: string, data: FormData | object) =>
    api.put(`/api/exhibits/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/exhibits/${id}`),
};

// Tickets API
export const ticketsAPI = {
  getTypes: () => api.get('/api/tickets'),
  
  getById: (id: string) => api.get(`/api/tickets/${id}`),
  
  create: (data: { name: string; price: number; description?: string }) =>
    api.post('/api/tickets', data),
  
  update: (id: string, data: { name?: string; price?: number; description?: string }) =>
    api.put(`/api/tickets/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/tickets/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/api/bookings', { params }),
  
  getMyBookings: () => api.get('/api/bookings/my'),
  
  getById: (id: string) => api.get(`/api/bookings/${id}`),
  
  create: (data: {
    ticketType: string;
    quantity: number;
    visitDate: string;
    totalPrice: number;
  }) => api.post('/api/bookings', data),
  
  cancel: (id: string) => api.put(`/api/bookings/${id}/cancel`),
};

// Admin API
export const adminAPI = {
  getUsers: (params?: { page?: number; limit?: number }) =>
    api.get('/api/admin/users', { params }),
  
  getUserById: (id: string) => api.get(`/api/admin/users/${id}`),
  
  updateUser: (id: string, data: { role?: string; isActive?: boolean }) =>
    api.put(`/api/admin/users/${id}`, data),
  
  deleteUser: (id: string) => api.delete(`/api/admin/users/${id}`),
  
  getStats: () => api.get('/api/admin/stats'),
  
  getAnalytics: () => api.get('/api/admin/analytics'),
};

export default api;
