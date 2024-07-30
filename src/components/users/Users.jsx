import { useEffect, useState, useRef } from 'react';
import axios from "../../utils/apiclient";
import CustomTable from '../Table';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css';
import { downloadExcel } from '../DownLoadExcell';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { format } from 'date-fns';
import UserType from '../UserType';
import { jwtDecode } from 'jwt-decode';

// Ensure correct import path

function App() {
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
    const userType = jwtDecode(localStorage.getItem('token')).type;
    const getDATA = async () => {
        if (!userData) return; // Ensure userData is not null
        setLoading(true);
        const userApi = userType === "super admin" ? "api/users/getNBFC" : "api/users/getAgents";
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
            selector: row => row.isApproved === 1 ? 'Approved' : 'UnApproved',
            sortable: true,
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
                    <Tab>List</Tab>
                </TabList>

                <TabPanel>
                    <CustomTable data={logs} columns={columns} loading={loading} tableName={'Agents'} />
                </TabPanel>
            </Tabs>
               





           
          
        </>
    );
}

export default App;
