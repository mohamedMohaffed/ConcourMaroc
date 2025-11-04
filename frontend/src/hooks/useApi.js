import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useApi = (url) => {
    // console.log('useApi rendered');

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!url) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(url);
                setData(response.data);
                setError(null);
            } catch (e) {
                setError(e);
                setData(null);
                // Let axiosInstance handle the redirect
                if (e.response?.status === 401) {
                    console.log('Unauthorized access, handling in axios interceptor');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, error, loading };
};

export default useApi;
