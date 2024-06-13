import { useState } from 'react';
import axios from 'axios';
import FilterComponent from './Filter';
import TableComponent from './Table';
import Header from './Header';
import './App.css';

function App() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async (requestData) => {
        setLoading(true);
        try {
            const response = await axios.post('api/report1/getCityData', requestData);
            setLogs(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <Header/>
            <FilterComponent fetchData={fetchData} />
            <TableComponent logs={logs} loading={loading} />
        </div>
    );
}

export default App;
