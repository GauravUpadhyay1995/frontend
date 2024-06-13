import { useState, useEffect } from 'react';
import axios from 'axios';

export const useDataFetching = (apiUrl,requestData) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.post(apiUrl,requestData);
                setData(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup function if needed
        return () => {
            // Any cleanup logic can go here
        };
    }, [apiUrl]);

    return { data, loading };
};


