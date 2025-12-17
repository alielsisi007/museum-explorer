import axios from 'axios';

// Backend live URL
const API_BASE_URL = 'https://mern-product-production.up.railway.app';

// Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies-based auth
});

// Request interceptor (optional: for localStorage fallback if cookie not present)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // fallback
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // app-level handling of unauthorized requests
    }
    return Promise.reject(error);
  }
);

// ======================== AUTH ========================
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/logIn', { email, password }),
  
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/register', data),
  
  getProfile: () => api.get('/profile'), // will use cookie token if HttpOnly
  
  updateProfile: (data: { name?: string; email?: string; password?: string }) =>
    api.put('/profile', data),
};

// ======================== TICKETS ========================
export const ticketsAPI = {
  getTypes: () => api.get('/tickets'),
  getById: (id: string) => api.get(`/tickets/${id}`),
};

// ======================== EXHIBITS / POSTS ========================
export const exhibitsAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/posts', { params }),
  
  getById: (id: string) => api.get(`/posts/${id}`),
  
  // Admin routes
  create: (data: FormData) => 
    api.post('/admin/createPost', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  
  update: (id: string, data: FormData) =>
    api.put(`/admin/updatePost/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  
  delete: (id: string) => api.delete(`/admin/deletePost/${id}`),
};

// ======================== BOOKINGS ========================
export const bookingsAPI = {
  getMyBookings: () => api.get('/bookings'), // user route
  create: (data: { ticketType?: string; quantity: number; visitDate: string; totalPrice: number }) =>
    api.post('/bookings', data),
  update: (id: string, data: object) => api.put(`/bookings/${id}`, data),
  cancel: (id: string) => api.delete(`/bookings/${id}`),
  getAll: (params?: { page?: number; limit?: number }) => api.get('/admin/bookings', { params }), // admin
};

// ======================== ADMIN ========================
export const adminAPI = {
  getUsers: (params?: { page?: number; limit?: number; role?: string }) =>
    api.get('/admin/users', { params }),
  deleteUser: (userId: string) => api.delete('/admin/deleteUserAccount', { data: { userId } }),
  updateUserToAdmin: (userId: string) => api.put('/admin/updateUserToAdmin', { userId }),
  getStats: () => api.get('/admin/stats'),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
