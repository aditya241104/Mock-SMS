import axios from 'axios';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000/api/auth',
      withCredentials: true
    });

    // Add request interceptor to include access token
    this.api.interceptors.request.use(
      (config) => {
        const token = this._getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If we get a 401 and haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            const newToken = await this.refreshToken();
            
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Retry the original request
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this._clearToken();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async register({ username, email, password }) {
    try {
      const response = await this.api.post('/register', { username, email, password });
      this._storeToken(response.data.token);
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const response = await this.api.post('/login', { email, password });
      this._storeToken(response.data.token);
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  async logout() {
    try {
      // Call logout endpoint (this will clear the refresh token cookie)
      await this.api.post('/logout');
      this._clearToken();
    } catch (error) {
      // Even if logout fails, clear local token
      this._clearToken();
      this._handleError(error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = this._getToken();
      if (!token) return null;

      const response = await this.api.get('/me');
      return response.data.user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this._clearToken();
      }
      this._handleError(error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const response = await this.api.post('/refresh-token');
      this._storeToken(response.data.token);
      return response.data.token;
    } catch (error) {
      this._clearToken();
      this._handleError(error);
      throw error;
    }
  }

  _storeToken(token) {
    localStorage.setItem('authToken', token);
  }

  _getToken() {
    return localStorage.getItem('authToken');
  }

  _clearToken() {
    localStorage.removeItem('authToken');
  }

  _handleError(error) {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
  }
}

export default new AuthService();