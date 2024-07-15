import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "./Table";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import "./App.css";
import { downloadExcel } from "./DownLoadExcell";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { format } from "date-fns";
import UserType from "./UserType";
import SweetAlert2 from "./SweetAlert2";
import Select from 'react-select';

function Payments() {
    const showAlert = (data) => {
        SweetAlert2(data);
    };

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 51 }, (_, i) => currentYear - i).map(year => ({ value: year, label: year.toString() }));
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true); // Initialize to true
    const userData = UserType();
    const [agencyOptions, setAgencyOptions] = useState([]);
    const [selectedAgency, setSelectedAgency] = useState(null); // Initialize as null
    const [startDate, setStartDate] = useState([]);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (userData) {
            setLoading(false);
            getAgencyOptions();
        }
    }, [userData]);

    const getAgencyOptions = async () => {
        try {
            const response = await axios.post('api/users/getAgencyList', {},
                { headers: { Authorization: `Bearer ${getToken()}` } });
            const options = response.data.map(option => ({
                value: option.id,
                label: option.nbfc_name,
            }));
            setAgencyOptions(options);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const getToken = () => localStorage.getItem("token");
    const getDATA = async (data) => {
        if (!userData) return; // Ensure userData is not null
        setLoading(true);
        const userApi = "/api/invoice/getPayment";
        try {
            const response = await axios.post(
                userApi,
                data,
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
        const result = await SweetAlert2({ type: "confirm", title: "Are You Sure ???", text: "It will not rollback" });

        if (result.isConfirmed) {
            try {
                const response = await axios.post(
                    "api/invoice/changeInvoiceStatus",
                    { id: data.id, status, ids: data.escalation_ids },
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                setLoading(false);
                if (response.data.success === true) {
                    showAlert({ type: "success", title: response.data.message });
                }
                const requestData = {
                    agency: selectedAgency.value,
                    month: startDate.map(date => date.value),
                    year: endDate?.value,
                };
                getDATA(requestData);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
    };

    const handleDelete = async (data) => {
        const result = await SweetAlert2({ type: "confirm", title: "Are You Sure Want To Delete ???", text: "It will not rollback" });

        if (result.isConfirmed) {
            try {
                const response = await axios.post(
                    "/api/invoice/deleteInvoice",
                    { id: data.id, escalation_ids: data.escalation_ids },
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );
                setLoading(false);
                if (response.data.success === true) {
                    showAlert({ type: "success", title: response.data.message });
                }
                const requestData = {
                    agency: selectedAgency.value,
                    month: startDate.map(date => date.value),
                    year: endDate?.value,
                };
                getDATA(requestData);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
    };

    const handleSelectChange = (selected, setSelected, options) => {
        if (selected && selected.length && selected[selected.length - 1].value === 'selectAll') {
            setSelected(options.filter(option => option.value !== 'selectAll'));
        } else {
            setSelected(selected);
        }
    };

    const handleSubmit = () => {
        if (selectedAgency) {
            const requestData = {
                agency: selectedAgency.value,
                month: startDate.map(date => date.value),
                year: endDate?.value,
            };
            getDATA(requestData);
        } else {
            showAlert({ type: "error", title: "Agency Name Required" });
        }
    };

    const handleReset = () => {
        setLogs([]);
        setSelectedAgency(null);
        setStartDate([]);
        setEndDate(null);
    };

    const columns = [
        {
            name: "Agency Name",
            selector: (row) => row.agency_name,
            sortable: true,
        },
        {
            name: "Created By",
            selector: (row) => row.created_by,
            sortable: true,
        },
        {
            name: "Created Date",
            selector: (row) => row.created_date,
            sortable: true,
        },
        {
            name: "Approved By",
            selector: (row) => row.approved_by,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="justify-center items-center space-x-2 pt-1">
                    {(row.approved === 0 || row.approved === 1) &&(row.paid==0) && (
                        <button onClick={() => handleAction(row, 2)}>
                            Reject
                        </button>
                    )}
                     {(row.paid==0 &&row.approved === 1) && (
                        <button onClick={() => handleAction(row, 2)}>
                            paid
                        </button>
                    )}
                    {(row.paid==1 &&row.approved != 2) && (
                        <button onClick={() => handleAction(row, 2)}>
                            Unpaid
                        </button>
                    )}
                    
                    {row.approved === 2 && (
                        <button>Rejected</button>
                    )}
                    {row.approved === 0 &&(row.paid==0) && (
                        <>
                            <button onClick={() => handleAction(row, 1)}>
                                Approve
                            </button>
                            <button onClick={() => handleDelete(row)}>
                                {row.isActive === 1 ? "Delete" : "Pending"}
                            </button>
                        </>
                    )}
                </div>
            ),
            ignoreRowClick: true,
        }
    ];

    return (
        <div className="container mx-auto my-8 p-4 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-3 gap-4">
                <Select
                    closeMenuOnSelect={false}
                    id="agency"
                    value={selectedAgency}
                    onChange={(selected) => handleSelectChange(selected, setSelectedAgency, agencyOptions)}
                    options={agencyOptions}
                    placeholder="Agency"
                />
                <Select
                    id="start-month"
                    value={startDate}
                    onChange={setStartDate}
                    options={months}
                    placeholder="Select start month"
                    isMulti
                />
                <Select
                    id="end-year"
                    value={endDate}
                    onChange={setEndDate}
                    options={years}
                    placeholder="Select end year"
                />
                <div className="col-span-3 flex justify-end gap-3 mt-3 mb-2">
                    <button
                        onClick={handleSubmit}
                        className="sm:w-auto text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleReset}
                        className="sm:w-auto text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        Reset
                    </button>
                </div>
            </div>
            <CustomTable
                        data={logs}
                        columns={columns}
                        loading={loading}
                        tableName={"Payments"}
                    />
        </div>
    );
}

export default Payments;
