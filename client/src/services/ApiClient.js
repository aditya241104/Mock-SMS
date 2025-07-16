import axios from 'axios';
import AuthService from './AuthService';

class ApiClient {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      withCredentials: true
    });

    // Add request interceptor for token injection
    this.api.interceptors.request.use(
      async (config) => {
        const token = AuthService._getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Attempt to refresh token
            const newToken = await AuthService.refreshToken();
            
            // Update Authorization header
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Retry the original request
            return this.api(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear token and redirect to login
            AuthService._clearToken();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }


  async get(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async post(url, data = {}) {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async put(url, data = {}) {
    try {
      const response = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async delete(url, params = {}) {
    try {
      const response = await this.api.delete(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiClient();