import axios from 'axios';

const baseURL = 'http://192.168.1.100:8000'; 
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If skipAuthRedirect is set, do not redirect to login
        if (error.response?.status === 401 && originalRequest?.skipAuthRedirect) {
            return Promise.reject(error);
        }

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
                // if (window.location.pathname !== '/connexion') {
                //     window.location.href = `/connexion?redirect=${window.location.pathname}`;
                // }
                // return Promise.reject(refreshError);
            }
        }
        
        // if (error.response?.status === 401 && window.location.pathname !== '/connexion') {
            // window.location.href = `/connexion?redirect=${window.location.pathname}`;
        // }

        return Promise.reject(error);
    }
);

/**
    isLoggedIn
 */
export async function isLoggedIn({ skipRedirect = false } = {}) {
    // console.log('isLoggedIn called');
    try {
        await axiosInstance.get('/accounts/api/current_user/', { skipAuthRedirect: skipRedirect });
        return true;
    } catch (error) {
        if (error.response?.status === 401) {
            try {
                await axios.post(`${baseURL}/accounts/api/token/refresh/`, {}, { withCredentials: true });
                await axiosInstance.get('/accounts/api/current_user/', { skipAuthRedirect: skipRedirect });
                return true;
            } catch (refreshError) {
                return false;
            }
        }
        return false;
    }
}

export default axiosInstance;
