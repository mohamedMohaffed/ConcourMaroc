import axios from 'axios';
import refreshToken from './RefreshToken';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.100:8000/', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url} - Token: ${token.substring(0, 20)}...`);
    } else {
      console.warn('[Request] ⚠️ No access_token token found in localStorage');
    }
    console.log('[Request] Full config:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('[Request] Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Response] Success: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log the error details
    console.error('[Response] Request failed:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('[Response] Request timeout');
      return Promise.reject(new Error('Request timeout - Please check your connection'));
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('[Response] Network error - Cannot reach server');
      return Promise.reject(new Error('Network error - Please check if the backend server is running'));
    }

    if (!originalRequest) {
      console.error('[Response] No originalRequest config available');
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('[Response] 401 detected - Attempting token refresh_token...');

      try {
        const newToken = await refreshToken();

        if (newToken) {
          console.log('[Response] Token refreshed successfully');
          localStorage.setItem('access_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log(`[Response] Retrying original request with new token: ${originalRequest.url}`);
          return axiosInstance(originalRequest);
        } else {
          console.warn('[Response] Token refresh_token failed - logging out');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('[Response] Error during token refresh_token:', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;