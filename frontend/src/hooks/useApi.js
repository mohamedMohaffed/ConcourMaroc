import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useApi = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!url) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                // Add artificial delay for testing loading component
                // await new Promise(resolve => setTimeout(resolve, 12000));
                
                const response = await axiosInstance.get(url);
                setData(response.data);
                // console.log("call dabase",data);
            } catch (e) {
                setError(e);
              
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, error, loading };
};

export default useApi;
