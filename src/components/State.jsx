import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CustomTable from './Table';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Select from 'react-select';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { downloadExcel } from './DownLoadExcell';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Authenticate from "./Authenticate";

function App() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bucketOptions, setBucketOptions] = useState([]);
    const [selectedBucket, setSelectedBucket] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMounted = useRef(false);

    const [allocationOptions, setAllocationOptions] = useState([]);
    const [selectedAllocation, setSelectedAllocation] = useState([]);

    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    Authenticate();

    useEffect(() => {
        if (!hasMounted.current) {
            getDATA();
            // getBucket();
            getAllocationOptions();
            getProductOptions();
            hasMounted.current = true;
        }
    }, []);

    const handleSubmit = () => {
        const requestData = {
            allocation: selectedAllocation.map(option => option.value),
            bucket: selectedBucket.map(option => option.value),
            start_date: startDate,
            end_date: endDate,
            product: selectedProduct.map(option => option.value),
        };
        getDATA(requestData);
    };

    const handleReset = () => {
        setSelectedBucket([]);
        setStartDate(null);
        setEndDate(null);
        getDATA();
        setSelectedAllocation([]);
        setSelectedProduct([]);
    };

    const getToken = () => localStorage.getItem('token');

    const getDATA = async (requestData = {}) => {
        setLoading(true);
        try {
            const response = await axios.post(
                'api/report1/getStateData',
                requestData,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setLogs(response.data.data);
            setFilteredLogs(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const getBucket = async () => {
        try {
            const response = await axios.post(
                'api/report1/getAllBucket',
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            const options = response.data.data.map(option => ({
                value: option.bucket,
                label: option.bucket,
            }));
            setBucketOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllocationOptions = async () => {
        try {
            const response = await axios.post(
                'api/report1/getAllAllocation',
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            const options = response.data.data.map(option => ({
                value: option.agency_name,
                label: option.agency_name,
            }));
            setAllocationOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
        } catch (error) {
            console.log(error);
        }
    };

    const getProductOptions = async () => {
        try {
            const response = await axios.post(
                'api/report1/getAllProduct',
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            const options = response.data.data.map(option => ({
                value: option.product_type,
                label: option.product_type,
            }));
            setProductOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectChange = (selected, setSelected, options) => {
        if (selected && selected.length && selected[selected.length - 1].value === 'selectAll') {
            setSelected(options.filter(option => option.value !== 'selectAll'));
        } else {
            setSelected(selected);
        }
    };

    const resolvedColor = "#00ff1817";
    const unResolvedColor = "#ffff0024";

    const columns = [
        {
            name: 'State',
            selector: row => row.state,
            sortable: true,
            headerStyle: {
                backgroundColor: 'red',
                color: 'white',
            },
        },
        {
            name: 'Total Count',
            selector: row => row.total_count,
            sortable: true,
        },
        {
            name: 'Total Pos',
            selector: row => row.total_pos,
            sortable: true,
        },
        {
            name: 'Resolved Pos',
            selector: row => row.resolved_pos,
            sortable: true,
            style: {
                backgroundColor: resolvedColor,
            },
        },
        {
            name: 'Resolved count',
            selector: row => row.resolved_count,
            sortable: true,
            style: {
                backgroundColor: resolvedColor,
            },
        },
        {
            name: 'Percentage POS',
            selector: row => row.percentage_pos,
            sortable: true,
            style: {
                backgroundColor: resolvedColor,
            },
        },
        {
            name: 'Percentage Count',
            selector: row => row.resolved_percentage_count,
            sortable: true,
            style: {
                backgroundColor: resolvedColor,
            },
        },
        {
            name: 'Unresolved POS',
            selector: row => row.unresolved_pos,
            sortable: true,
            style: {
                backgroundColor: unResolvedColor,
            },
        },
        {
            name: 'Unresolved Count',
            selector: row => row.unresolved_count,
            sortable: true,
            style: {
                backgroundColor: unResolvedColor,
            },
        },
        {
            name: 'Unresolved percentage pos',
            selector: row => row.unresolved_percentage_pos,
            sortable: true,
            style: {
                backgroundColor: unResolvedColor,
            },
        },
        {
            name: 'Unresolved percentage count',
            selector: row => row.unresolved_percentage_count,
            sortable: true,
            style: {
                backgroundColor: unResolvedColor,
            },
        },
    ];

    const handleDownloadExcel = () => {
        downloadExcel(filteredLogs, 'State');
    };

    const toggleAccordionContent = () => {
        const accordionContent = document.querySelector('#accordion-content');
        if (accordionContent) {
            accordionContent.classList.toggle('hidden');
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <>
            <div style={{ background: '#e5e5e526' }} className="w-full bg-white border border-gray-200 rounded-lg shadow sm:p-3 dark:bg-gray-800 dark:border-gray-700 mb-4">
                <div data-accordion className="accordion">
                    <span className="flex justify-end mb-2" onClick={toggleAccordionContent}>
                        {isExpanded ? <SlArrowUp /> : <SlArrowDown />}
                    </span>
                    <div id="accordion-content" className="hidden" data-accordion-content>
                        <div className="grid grid-cols-3 gap-4">
                            <Select
                                closeMenuOnSelect={false}
                                id="allocation"
                                value={selectedAllocation}
                                onChange={(selected) => handleSelectChange(selected, setSelectedAllocation, allocationOptions)}
                                options={allocationOptions}
                                isMulti
                                className=""
                                placeholder="Select Allocation"
                            />
                            {/* <Select
                                closeMenuOnSelect={false}
                                id="dropdown"
                                value={selectedBucket}
                                onChange={(selected) => handleSelectChange(selected, setSelectedBucket, bucketOptions)}
                                options={bucketOptions}
                                isMulti
                                className=""
                                placeholder="Select Bucket"
                            /> */}
                            <Select
                                closeMenuOnSelect={false}
                                id="product"
                                value={selectedProduct}
                                onChange={(selected) => handleSelectChange(selected, setSelectedProduct, productOptions)}
                                options={productOptions}
                                isMulti
                                className=""
                                placeholder="Select Product"
                            />
                            <div className="col-span-3 flex justify-end gap-3">
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
                    </div>
                </div>
            </div>
            <Tabs>
                <TabList>
                    <Tab>State Wise Resolution</Tab>

                </TabList>

                <TabPanel>
                    <CustomTable data={logs} columns={columns} loading={loading} tableName={'State'} />
                </TabPanel>
            </Tabs>
        </>
    );
}

export default App;
