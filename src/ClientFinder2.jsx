import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientFinder = () => {
    const [filter, setFilter] = useState('');
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 10; // Since limit is constant, no need to use useState

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('/api/clientFinder/fetchClients',
                    { filter: filter, page: page, limit: limit },
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                setData(response.data.data); // Adjust based on actual API response structure
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const debounceFetch = setTimeout(fetchData, 300); // Debounce API calls
        return () => clearTimeout(debounceFetch);
    }, [filter, page]); // Removed limit from dependencies

    return (
        <div>
            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter data..."
            />
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.client_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
                <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </div>
        </div>
    );
};

export default ClientFinder;
