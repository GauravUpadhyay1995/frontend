import { useEffect, useState, useRef } from 'react';
import axios from "../utils/apiclient";
import CustomTable from './Table';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Select from 'react-select';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { downloadExcel } from './DownLoadExcell';

function App() {

    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bucketOptions, setBucketOptions] = useState([]);
    const [selectedBucket, setSelectedBucket] = useState([]);
    const [tool, setTool] = useState({ value: 'Daily', label: 'Daily' });
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMounted = useRef(false);

    const [agencyOptions, setAgencyOptions] = useState([]);
    const [selectedAgency, setSelectedAgency] = useState([]);

    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);

    const [stateOptions, setAllstateOptions] = useState([]);
    const [selectedState, setSelectedState] = useState([]);

    const [cityOptions, setCityOptions] = useState([]); // New state for city options
    const [selectedCity, setSelectedCity] = useState([]); // New state for selected city



    useEffect(() => {
        if (!hasMounted.current) {
            getDATA();

            // getBucket();
            getAgencyOptions();
            getProductOptions();
            getStateOptions();
            getCity([]);
            hasMounted.current = true;
        }
    }, [tool]);

    useEffect(() => {
        if (selectedState.length > 0) {
            getCity(selectedState.map(option => option.value));
        } else {
            setCityOptions([]);
            getCity([]);
        }
    }, [selectedState]);
    const handleDownloadExcel = () => {
        downloadExcel(filteredLogs, 'City'); // Pass the data you want to download
    };

    const handleSubmit = () => {
        const requestData = {

            agency: selectedAgency.map(option => option.value),
            bucket: selectedBucket.map(option => option.value),
            product: selectedProduct.map(option => option.value),
            state: selectedState.map(option => option.value),
            city: selectedCity.map(option => option.value), // Include selected cities
        };
        getDATA(requestData);
    };

    const handleReset = () => {
        setSelectedBucket([]);
        setSelectedAgency([]);
        setSelectedProduct([]);
        setSelectedState([]);
        setSelectedCity([]); // Reset selected cities
        getDATA();
    };

    const getDATA = async (requestData = {}) => {
        setLoading(true);
        try {
            const response = await axios.post('api/report1/getCityData', requestData);
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
            const response = await axios.post('api/report1/getAllBucket');
            const options = response.data.data.map(option => ({
                value: option.bucket,
                label: option.bucket,
            }));
            setBucketOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
        } catch (error) {
            console.log(error);
        }
    };

    const getAgencyOptions = async () => {
        try {
            const response = await axios.post('api/report1/getAllAgency');
            const options = response.data.data.map(option => ({
                value: option.agency_name,
                label: option.agency_name,
            }));
            setAgencyOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
        } catch (error) {
            console.log(error);
        }
    };

    const getStateOptions = async () => {
        try {
            const response = await axios.post('api/report1/getAllState');
            const options = response.data.data.map(option => ({
                value: option.state,
                label: option.state,
            }));
            setAllstateOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
        } catch (error) {
            console.log(error);
        }
    };

    const getProductOptions = async () => {
        try {
            const response = await axios.post('api/report1/getAllProduct');
            const options = response.data.data.map(option => ({
                value: option.product_type,
                label: option.product_type,
            }));
            setProductOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
        } catch (error) {
            console.log(error);
        }
    };

    const getCity = async (states) => {

        try {
            const response = await axios.post('api/report1/getCityByState', { states });
            const options = response.data.data.map(option => ({
                value: option.city,
                label: option.city,
            }));

            setCityOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
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

    const columns = [
        {
            name: 'City',
            selector: row => row.city,
            sortable: true,
            cell: row => (
                <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {row.city}
                </div>
            ),
        },
        {
            name: 'Paid',
            selector: row => row.paid,
            sortable: true,
        },
        {
            name: 'UnPaid',
            selector: row => row.unpaid,
            sortable: true,
        },
        {
            name: 'Total',
            selector: row => row.total,
            sortable: true,
        },
        {
            name: 'Paid(%)',
            selector: row => row.paid_percentage,
            sortable: true,
        },
        {
            name: 'UnPaid(%)',
            selector: row => row.unpaid_percentage,
            sortable: true,
        },
        {
            name: 'Paid Count',
            selector: row => row.paid_count,
            sortable: true,
        },
        {
            name: 'UnPaid Count',
            selector: row => row.unpaid_count,
            sortable: true,
        },
        {
            name: 'Grand Total',
            selector: row => row.grand_sum,
            sortable: true,
        },
    ];

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
                                id="State"
                                value={selectedState}
                                onChange={(selected) => handleSelectChange(selected, setSelectedState, stateOptions)}
                                options={stateOptions}
                                isMulti
                                className=""
                                placeholder="Select State"

                            />
                            <Select
                                closeMenuOnSelect={false}
                                id="city"
                                value={selectedCity}
                                onChange={(selected) => handleSelectChange(selected, setSelectedCity, cityOptions)}
                                options={cityOptions}
                                isMulti
                                className=""
                                placeholder="Select City"
                            />
                            <Select
                                closeMenuOnSelect={false}
                                id="agency"
                                value={selectedAgency}
                                onChange={(selected) => handleSelectChange(selected, setSelectedAgency, agencyOptions)}
                                options={agencyOptions}
                                isMulti
                                className=""
                                placeholder="Allocation"
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
            <CustomTable data={logs} columns={columns} loading={loading} tableName={'City'} />
        </>
    );
}

export default App;
