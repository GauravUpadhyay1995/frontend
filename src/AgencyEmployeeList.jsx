import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CustomTable from './Table';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import { downloadExcel } from './DownLoadExcell';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { format } from 'date-fns';
import UserType from './UserType';
import SweetAlert2 from './SweetAlert2';

// Ensure correct import path

function App() {
    const showAlert = (data) => {
        SweetAlert2(data)
    }
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true); // Initialize to true
    const [isExpanded, setIsExpanded] = useState(false); // Define state for accordion
    const userData = UserType();

    useEffect(() => {
        if (userData) {
            setLoading(false);
            getDATA();
        }
    }, [userData]);

    const getToken = () => localStorage.getItem('token');
    const getDATA = async () => {
        if (!userData) return; // Ensure userData is not null
        setLoading(true);
        const userApi = "api/users/getAgencyEmployees";
        try {
            const response = await axios.post(
                userApi,
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setLogs(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleAction = async (data, status) => {
        try {
            const response = await axios.post(
                'api/users/approveUser',
                { userId: data.id, status: status },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setLoading(false);
            if (response.data.success === true) {
                showAlert({ "type": "success", "title": response.data.message });
            }
            getDATA();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const columns = [
        {
            name: 'Name',
            selector: row => row.nbfc_name,
            sortable: true,
            headerStyle: {
                backgroundColor: 'red',
                color: 'white',
            },
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.isActive === 1 ? 'Active' : 'Inactive',
            sortable: true,
        },

        {
            name: 'Approval Status',
            cell: row => (
                <button
                    className={`focus:outline-none text-white bg-${row.isApproved === 1 ? 'green' : 'red'}-700 hover:bg-${row.isApproved === 1 ? 'green' : 'red'}-800 focus:ring-4 focus:ring-${row.isApproved === 1 ? 'green' : 'red'}-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2`}
                    onClick={() => handleAction(row, row.isApproved === 1 ? 0 : 1)}
                >
                    {row.isApproved === 1 ? 'Approved' : 'Pending'}
                </button>
            ),
            ignoreRowClick: true,
        },
        {
            name: 'UserType',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'Creation Date',
            selector: row => format(new Date(row.created_date), 'dd/MM/yyyy hh:mm a'),
            sortable: true,
        },
    ];



    return (
        <>

            <Tabs>
                <TabList>
                    <Tab>Employee List</Tab>
                </TabList>

                <TabPanel>
                    <CustomTable data={logs} columns={columns} loading={loading} tableName={'Agents'} />
                </TabPanel>
            </Tabs>








        </>
    );
}

export default App;
