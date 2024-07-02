import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CustomTable from './Table';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SweetAlert2 from './SweetAlert2';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { BucketOptions } from './StateOptions';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaEdit } from 'react-icons/fa';
import Invoice from './InvoiceFormate';
import image1 from '../public/assistfin.png'

function App() {
    const getToken = () => localStorage.getItem('token');

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true); // Initialize to true
    const [editingIndex, setEditingIndex] = useState(-1);
    const [editedProductName, setEditedProductName] = useState('');
    const inputRef = useRef(null);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [bucketOptions, setBucketOptions] = useState(BucketOptions);
    const [selectedBucket, setSelectedBucket] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMounted = useRef(false);
    const [agencyOptions, setAgencyOptions] = useState([]);
    const [selectedAgency, setSelectedAgency] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [campaignOptions, setCampaignOptions] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);





    useEffect(() => {
        if (!hasMounted.current) {
            getAgencyOptions();
            getProductOptions();
            // getCampaign([]);
            hasMounted.current = true;
        }
    }, []);
    const handleSubmit = () => {
        if(selectedAgency.value){
            const requestData = {

                bucket: selectedBucket.value,
                agency: selectedAgency.value,
                product: selectedProduct.value,
                campaign: selectedCampaign.value,
                start_date: startDate,
                end_date: endDate,
    
    
            };
            getDATA(requestData);
        }else{
            showAlert({type:"error",title:"Agency Name Required"})
        }
       
    };
    const handleReset = () => {

        setSelectedBucket([]);
        setSelectedAgency([]);
        setSelectedProduct([]);
        setSelectedCampaign([]);
        setStartDate(null);
        setEndDate(null);

    };
    const getDATA = async (requestData = {}) => {

        setLoading(true);
        try {
            const response = await axios.post(`api/invoice/getInvoice`, requestData,

                { headers: { Authorization: `Bearer ${getToken()}` } });
            setLogs(response.data.data);
            setFilteredLogs(response.data.data);
            setLoading(false);


        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const showAlert = (data) => {
        SweetAlert2(data)
    }

    const getAgencyOptions = async () => {
        try {
            const response = await axios.post('api/report1/getAllAgency',
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } });
            const options = response.data.data.map(option => ({
                value: option.agency_name,
                label: option.agency_name,
            }));
            setAgencyOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
        } catch (error) {
            console.log(error);
        }
    };
    const getProductOptions = async () => {
        try {
            const response = await axios.post('api/report1/getAllProduct',
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } });
            const options = response.data.data.map(option => ({
                value: option.product_type,
                label: option.product_type,
            }));
            setProductOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
        } catch (error) {
            console.log(error);
        }
    };
    // const getCampaign = async () => {

    //     try {
    //         const response = await axios.post('api/report1/getAllCampaign',
    //             {},
    //             { headers: { Authorization: `Bearer ${getToken()}` } });
    //         const options = response.data.data.map(option => ({
    //             value: option.campaign,
    //             label: option.campaign,
    //         }));

    //         setCampaignOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);

    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const handleSelectChange = (selected, setSelected, options) => {
        if (selected && selected.length && selected[selected.length - 1].value === 'selectAll') {
            setSelected(options.filter(option => option.value !== 'selectAll'));
        } else {
            setSelected(selected);
        }
    };

    const toggleAccordionContent = () => {
        const accordionContent = document.querySelector('#accordion-content');
        if (accordionContent) {
            accordionContent.classList.toggle('hidden');
            setIsExpanded(!isExpanded);
        }
    };


    const invoiceRef = useRef();

    const generatePDF = () => {
        const input = invoiceRef.current;
       
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL(image1);
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('invoice.pdf');
            })
            .catch((error) => {
                console.error('Error generating PDF: ', error);
            });
    };

    return (
        <>
            <div style={{ background: '#e5e5e526' }} className="w-full bg-white border border-gray-200 rounded-lg shadow sm:p-3 dark:bg-gray-800 dark:border-gray-700 mb-4">
                <div data-accordion className="accordion">
                    <span className="flex justify-end mb-2" onClick={toggleAccordionContent}>
                        {isExpanded ? <SlArrowUp /> : <SlArrowDown />}
                    </span>
                    <div id="accordion-content" className="hidden" data-accordion-content>



                        <div className="grid grid-cols-5 gap-3">


                           
                            <Select
                                closeMenuOnSelect={false}
                                id="agency"
                                value={selectedAgency}
                                onChange={(selected) => handleSelectChange(selected, setSelectedAgency, agencyOptions)}
                                options={agencyOptions}

                                className=""
                                placeholder="Agency"
                            />



                            <Select
                                closeMenuOnSelect={false}
                                id="product"
                                value={selectedProduct}
                                onChange={(selected) => handleSelectChange(selected, setSelectedProduct, productOptions)}
                                options={productOptions}

                                className=""
                                placeholder="Product"
                            />
                             <Select
                                closeMenuOnSelect={false}
                                id="bucket"
                                value={selectedBucket}
                                onChange={(selected) => handleSelectChange(selected, setSelectedBucket, bucketOptions)}
                                options={bucketOptions}

                                className=""
                                placeholder="Bucket"
                            />
                            {/* <Select
                                closeMenuOnSelect={false}
                                id="campaign"
                                value={selectedCampaign}
                                onChange={(selected) => handleSelectChange(selected, setSelectedCampaign, campaignOptions)}
                                options={campaignOptions}

                                className=""
                                placeholder="Camapaign"
                            /> */}



                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Select start date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Select end date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            />




                        </div>
                        <div className="col-span-3 flex justify-end gap-3 mt-3">
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
            </div >
            <div>
                <Invoice ref={invoiceRef} />
                <button onClick={generatePDF}>Generate PDF</button>
            </div>


        </>
    );
}

export default App;
