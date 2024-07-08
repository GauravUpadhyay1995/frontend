import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SweetAlert2 from './SweetAlert2'; // Ensure SweetAlert2 is correctly imported
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEscalation = () => {
    const showAlert = (data) => {
        SweetAlert2(data);
    };

    const hasMounted = useRef(false);

    const [loading, setLoading] = useState(false); // Initialize to false
    const [agency, setAgency] = useState([]);
    const [selectedAgencyOptions, setSelectedAgencyOptions] = useState([]);
    const [startDate, setStartDateLocal] = useState(null);
    const [endDate, setEndDateLocal] = useState(null);
    const [loanId, setLoanId] = useState('');
    const [error, setError] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [comments, setComments] = useState(null);

    useEffect(() => {
        if (!hasMounted.current) {
            getAgencyOptions();
            hasMounted.current = true;
        }
    }, []);

    const getToken = () => localStorage.getItem('token');

    const getAgencyOptions = async () => {
        const userApi = "api/users/getAgency";
        try {
            const response = await axios.post(
                userApi,
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            const options = response.data.data.map(option => ({
                value: option.id,
                label: option.nbfc_name,
            }));
            setAgency(options);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true); // Start loading

        const formData = new FormData();
        formData.append('fromDate', startDate);
        formData.append('toDate', endDate);
        formData.append('loan_id', loanId);
        formData.append('attachment', attachment);
        formData.append('agency_id', Number(selectedAgencyOptions.value))
        formData.append('comments', comments)

        const userApi = "api/escalation/raiseEscalation";
        try {
            const response = await axios.post(
                userApi,
                formData,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            if (response.data.success) {
                showAlert({ type: "success", title: response.data.message });
            } else {
                showAlert({ type: "error", title: response.data.message });
            }
            setLoading(false); // Start loading
        } catch (error) {
            console.error(error);
            setLoading(false); // Start loading
        }


    };

    const handleSelectChange = (selected, setSelected, options) => {
        if (selected && selected.length && selected[selected.length - 1].value === 'selectAll') {
            setSelected(options.filter(option => option.value !== 'selectAll'));
        } else {
            setSelected(selected);
        }
    };

    const handleFileChange = (event) => {
        setAttachment(event.target.files[0]);
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen">
            <div className="justify-center items-center h-screen">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor="start-date">Start Date</label>
                            <DatePicker
                                id="start-date"
                                selected={startDate}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(date) => setStartDateLocal(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="YYYY-MM-DD"
                                className="text-black border-gray-300 block w-full sm:text-sm border rounded-md p-2"
                                style={{ width: "100%", height: "2.5rem" }}
                            />
                        </div>
                        <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                            <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' htmlFor="end-date">End Date</label>
                            <DatePicker
                                id="endDate"
                                selected={endDate}
                                onChange={(date) => setEndDateLocal(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                className="text-black border-gray-300 block w-full sm:text-sm border rounded-md p-2"
                                placeholderText="YYYY-MM-DD"
                                dateFormat="yyyy-MM-dd"
                                style={{ width: "100%", height: "2.5rem" }}
                            />
                        </div>
                        <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Agency <span>*</span>
                            </label>
                            <Select
                                closeMenuOnSelect={false}
                                id="Agency"
                                onChange={(selected) => handleSelectChange(selected, setSelectedAgencyOptions, agency)}
                                options={agency}
                                className=""
                                placeholder="Select Agency"
                            />
                        </div>
                        <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Loan ID
                            </label>
                            <input onChange={(e) => setLoanId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" id="loanId" type="text" name="loanId" placeholder="Enter Loan ID" />
                        </div>
                        <div className="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Attachment
                            </label>
                            <input onChange={handleFileChange} className="w-full p-3 border border-gray-300 rounded-md" id="Attachment" type="file" name="Attachment" />
                        </div>
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Comments
                            </label>
                            <textarea onChange={(e) => setComments(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" id="Attachment" type="file" name="Attachment" />
                        </div>
                    </div>
                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            className={`focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-12 py-3 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>

                </div>
            </div>
        </form>
    );
};

export default AddEscalation;
