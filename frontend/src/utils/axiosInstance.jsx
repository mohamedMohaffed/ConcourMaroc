import axios from 'axios';

const baseURL = 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors that are not refresh attempts
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('Token expired, attempting to refresh...');

            try {
                await axios.post(`${baseURL}/accounts/api/token/refresh/`, {}, { withCredentials: true });
                console.log('Token refresh successful');
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Redirect to login
                if (window.location.pathname !== '/login') {
                    window.location.href = `/login?redirect=${window.location.pathname}`;
                }
                return Promise.reject(refreshError);
            }
        }
        
        // Handle other 401 errors (like failed login attempts)
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
            window.location.href = `/login?redirect=${window.location.pathname}`;
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
