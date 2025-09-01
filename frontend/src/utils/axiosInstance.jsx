import axios from 'axios';


export const axiosInstance = axios.create({

  baseURL:"http://127.0.0.1:8000/",
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use(
  (config)=>{
    if (config.headers.needAuth) {

      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }else{
        window.location.href = '/login';

      }
      delete config.headers.needAuth;
    }
    return config;
  },
  (error) => Promise.reject(error)
    
  
);

export default axiosInstance;
