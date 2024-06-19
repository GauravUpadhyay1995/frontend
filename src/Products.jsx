import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CustomTable from './Table';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SweetAlert2 from './SweetAlert2';
import { FaEdit } from 'react-icons/fa';

function App() {
    const showAlert = (data) => {
        SweetAlert2(data)
    }
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true); // Initialize to true
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editedProductName, setEditedProductName] = useState('');
    const inputRef = useRef(null);

    const handleAction = async (data, status) => {
        try {
            const response = await axios.post(
                'api/users/deleteProduct',
                { productId: data.id, status: status },
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

    useEffect(() => {
        getDATA();
    }, []);

    const getToken = () => localStorage.getItem('token');

    const getDATA = async () => {
        setLoading(true);
        const userApi = "api/users/getProducts";
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

    const handleEdit = (index, productName) => {
        setEditingIndex(index);
        setEditedProductName(productName);
        inputRef.current && inputRef.current.focus(); // Focus on input field when editing starts
    };

    const handleBlur = (index) => {
        setEditingIndex(-1);
        if (editedProductName.trim() !== logs[index].product) {
            updateProduct(index, editedProductName.trim());
        }
    };

    const updateProduct = async (index, newName) => {
        try {
            const response = await axios.post(
                'api/users/updateProduct',
                { productId: logs[index].id, newName },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            if (response.data.success) {
                showAlert({ "type": "success", "title": response.data.message });
                getDATA();
            }
        } catch (error) {
            if (error.response.data.success === false) {
                showAlert({ "type": "error", "title": error.response.data.message });
            }

        }
    };

    const columns = [
        {
            name: 'Product Name',
            cell: (row, index) => {
                if (index === editingIndex) {
                    return (
                        <input
                            className="appearance-none block w-full text-gray-700 border rounded mt-1 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            ref={inputRef}
                            type="text"
                            value={editedProductName}
                            onChange={(e) => setEditedProductName(e.target.value)}
                            onBlur={() => handleBlur(index)}
                        />
                    );
                } else {
                    return (
                        <>
                            {row.product}
                            <FaEdit
                                className={`ml-2 text-${row.isActive === 1 ? 'green' : 'red'}-500 cursor-pointer`}
                                onClick={() => handleEdit(index, row.product)}
                            />
                        </>
                    );
                }
            },
            sortable: true,
            headerStyle: {
                backgroundColor: 'red',
                color: 'white',
            },
        },

        {
            name: 'Status',
            selector: row => row.isActive === 1 ? 'Active' : 'Inactive',
            sortable: true,
        },

        {
            name: 'Action',
            cell: row => (
                <button
                    className={`focus:outline-none text-white bg-${row.isActive === 1 ? 'green' : 'red'}-700 hover:bg-${row.isActive === 1 ? 'green' : 'red'}-800 focus:ring-4 focus:ring-${row.isActive === 1 ? 'green' : 'red'}-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2`}
                    onClick={() => handleAction(row, row.isActive === 1 ? 0 : 1)}
                >
                    {row.isActive === 1 ? 'Activated' : 'Pending'}
                </button>
            ),
            ignoreRowClick: true,
        },
    ];

    return (
        <>

            <Tabs>
                <TabList>
                    <Tab>Product List</Tab>
                </TabList>

                <TabPanel>
                    <CustomTable data={logs} columns={columns} loading={loading} tableName={'Products'} />
                </TabPanel>
            </Tabs>
        </>
    );
}

export default App;
