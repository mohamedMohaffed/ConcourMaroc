import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const useApi = (url, needAuth = false) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(url, {
                    headers: { needAuth }
                }); 
                setData(response.data);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, needAuth]);

    return { data, error, loading };
};

export default useApi;







