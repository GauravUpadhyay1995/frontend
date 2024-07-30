import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { downloadExcel } from '../DownLoadExcell';
import 'react-datepicker/dist/react-datepicker.css';
import { BucketOptions } from '../StateOptions';


const InvoiceFilter = ({ setLogs}) => {
    const getToken = () => localStorage.getItem('token');



    return (
        <div style={{ background: '#e5e5e526' }} className="w-full bg-white border border-gray-200 rounded-lg shadow sm:p-3 dark:bg-gray-800 dark:border-gray-700 mb-4">
            <div data-accordion className="accordion">
                <span className="flex justify-end mb-2" onClick={toggleAccordionContent}>
                    {isExpanded ? <SlArrowUp /> : <SlArrowDown />}
                </span>
                <div id="accordion-content" className="hidden" data-accordion-content>



                    <div className="grid grid-cols-8 gap-3">


                        <Select
                            closeMenuOnSelect={false}
                            id="bucket"
                            value={selectedBucket}
                            onChange={(selected) => handleSelectChange(selected, setSelectedBucket, bucketOptions)}
                            options={bucketOptions}
                          
                            className=""
                            placeholder="Bucket"
                        />
                        <Select
                            closeMenuOnSelect={false}
                            id="agency"
                            value={selectedAgency}
                            onChange={(selected) => handleSelectChange(selected, setSelectedAgency, agencyOptions)}
                            options={agencyOptions}
                            isMulti
                            className=""
                            placeholder="Agency"
                        />



                        <Select
                            closeMenuOnSelect={false}
                            id="product"
                            value={selectedProduct}
                            onChange={(selected) => handleSelectChange(selected, setSelectedProduct, productOptions)}
                            options={productOptions}
                            isMulti
                            className=""
                            placeholder="Product"
                        />
                        <Select
                            closeMenuOnSelect={false}
                            id="campaign"
                            value={selectedCampaign}
                            onChange={(selected) => handleSelectChange(selected, setSelectedCampaign, campaignOptions)}
                            options={campaignOptions}
                            isMulti
                            className=""
                            placeholder="Camapaign"
                        />



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
        </div >
    );
};

export default InvoiceFilter;
