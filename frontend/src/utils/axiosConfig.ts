import axios, { AxiosError } from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add loading state
apiClient.interceptors.request.use(
  (config) => {
    // You can add loading indicators here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        // If successful, retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login only if we're not already on the home page
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other common errors
    if (error.response?.status === 403) {
      // Forbidden access
      console.warn('Access forbidden');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
