import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Base64 } from 'js-base64';
import axios from 'axios';
import classNames from 'classnames';
import CustomTable from './Table';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import 'react-tabs/style/react-tabs.css';

const App = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const getToken = () => localStorage.getItem('token');

    const getDATA = async () => {
        setLoading(true);

        try {
            const response = await axios.post(
                'api/users/nbfcWaiverList',
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            console.log("Fetched Data:", response.data.data);
            setLogs(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDATA();
    }, []);

    const columns = [
        {
            name: 'Loan Id',
            selector: row => row.loanId,
            sortable: true,
            cell: row => <div onClick={() => handleAction(row.loanId)} className="wrap-text cursor-pointer">{row.loanId}</div>,
        },
        {
            name: 'Agency',
            selector: row => row.nbfc_name,
            sortable: true,
            cell: row => <div className="wrap-text">{row.nbfc_name}</div>,
        },
        { name: 'Total Amount', selector: row => row.total_amt, sortable: true },
        {
            name: 'Requested date',
            selector: row => row.formatted_created_date,
            sortable: true,
            cell: row => <div className="wrap-text">{row.formatted_created_date}</div>,
        },
        {
            name: 'Response date',
            selector: row => row.formatted_approved_date,
            sortable: true,
            cell: row => <div className="wrap-text">{row.formatted_approved_date}</div>,
        },
        {
            name: 'Status',
            selector: row => row.isApproved === 1 ? 'Approved' : row.isApproved === 0 ? "Rejected" : "Pending",
            sortable: true
        },
        {
            name: 'Action',
            cell: row => {
                const isApproved = row.isApproved === 2;
                const buttonClass = classNames({
                    'focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2': true,
                    'bg-red-700 hover:bg-red-800 focus:ring-red-300': isApproved,
                });

                return (
                    <DetailsButton
                        className={buttonClass}
                        id={row.loanId}
                    />
                );
            },
            ignoreRowClick: true,
        }
    ];

    return (
        <div className="App">
            <CustomTable data={logs} columns={columns} loading={loading} tableName={'WaiverList'} />

        </div>
    );
}

function DetailsButton({ className, id }) {
    const navigate = useNavigate();

    const showDetails = (requestId) => {
        const encodedId = Base64.encode(requestId);
        navigate(`/showWaiverDetails/${encodedId}`);
    };

    return (
        <button
            className={className}
            onClick={() => showDetails(id)}
        >
            Details
        </button>
    );
}


export default App;
