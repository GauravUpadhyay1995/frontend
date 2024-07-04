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
                const pending = row.isApproved === 2;
                const approved = row.isApproved === 1;
                const rejected = row.isApproved === 0;
                const buttonClass = classNames({
                    'focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2': true,
                    'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300': pending,
                    'bg-green-700 hover:bg-green-800 focus:ring-green-300': approved,
                    'bg-red-700 hover:bg-red-800 focus:ring-red-300': rejected,
                });

                return (
                    <DetailsButton
                        className={buttonClass}
                        id={row.id}
                        loanId={row.loanId}
                        pending={pending}
                        approved={approved}
                        rejected={rejected}
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

function DetailsButton({ className, id, loanId, pending, approved, rejected }) {
    const navigate = useNavigate();
    const data = JSON.stringify({
        id: id,
        loanId: loanId
    });

    const showDetails = (requestId) => {
        const encodedId = Base64.encode(requestId);
        if (pending) {
            navigate(`/show-waiver-details/${encodedId}`);
        }
        if (approved) {
            navigate(`/approved-waiver-details/${encodedId}`);
        }
        if (rejected) {
            navigate(`/rejected-waiver-details/${encodedId}`);
        }
    };

    return (
        <button
            className={className}
            onClick={() => showDetails(data)}
        >
            Details
        </button>
    );
}


export default App;
