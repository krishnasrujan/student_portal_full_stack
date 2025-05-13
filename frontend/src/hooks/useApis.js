import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000'; // Backend API URL

const useApi = (endpoint, method = 'get', data = null, initialValue = null) => {
    const [value, setValue] = useState(initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios({
                    method: method.toLowerCase(),
                    url: `${API_BASE_URL}${endpoint}`,
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setValue(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, method, data]);

    return { value, loading, error, setValue };
};

export default useApi;