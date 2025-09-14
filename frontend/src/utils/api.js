import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
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

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Quiz API calls
export const quizAPI = {
  getQuizzes: () => api.get('/quizzes'),
  getQuiz: (id) => api.get(`/quiz/${id}`),
  submitQuiz: (id, data) => api.post(`/quiz/${id}/submit`, data),
  getResults: () => api.get('/results'),
  getResult: (id) => api.get(`/result/${id}`),
};

// Certificate API calls
export const certificateAPI = {
  downloadCertificate: (resultId) => {
    return api.get(`/certificate/${resultId}`, {
      responseType: 'blob',
    });
  },
};

export default api;
