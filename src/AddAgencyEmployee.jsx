import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Select from 'react-select';
import { Loader } from './Loader';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import UserType from './UserType';
import SweetAlert2 from './SweetAlert2';


// http://localhost:5000/api/users/testing
const App = () => {
    const userData = UserType();
    useEffect(() => {
    }, [userData]);
    const showAlert = (data) => {
        SweetAlert2(data)
    }
    const getToken = () => localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDOB] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [Pan, setPan] = useState();
    const [Adhaar, setAdhaar] = useState();
    const [Profile, setProfile] = useState();
    const [PoliceVerification, setPoliceVerification] = useState();
    const [DRA, setDRA] = useState();
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            setLoading(false)
            hasMounted.current = true;
        }
    }, []);

    const handlePanChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setPan(selectedFile);
        }
    }
    const handleAdhaarChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setAdhaar(selectedFile);
        }
    }
    const handlePoliceVerificationChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setPoliceVerification(selectedFile);
        }
    }
    const handleProfileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setProfile(selectedFile);
        }
    }
    const handleDRAChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setDRA(selectedFile);
        }
    }
    const HandleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        const requestData = new FormData();
        requestData.append('nbfc_name', name);
        requestData.append('email', email);
        requestData.append('password', password);
        requestData.append('type', 'employee');
        requestData.append('isAgency', userData.isAgency);
        requestData.append('mobile', phone);
        requestData.append('dob', dob);
        requestData.append('employeeID', employeeID);


        if (Pan) requestData.append('Pan', Pan);
        if (Adhaar) requestData.append('Adhaar', Adhaar);
        if (Profile) requestData.append('Profile', Profile);
        if (PoliceVerification) requestData.append('PoliceVerification', PoliceVerification);
        if (DRA) requestData.append('DRA', DRA);
        try {
            const response = await axios.post(
                'api/users/addAgencyEmployee',
                requestData,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            if (response.data.success === true) {
                showAlert({ "type": "success", "title": response.data.message });
            }
            setLoading(false);
        } catch (error) {

            setLoading(false);
            if (error.response.data.success === false) {
                showAlert({ "type": "error", "title": error.response.data.message });
            }
        }

    }
    const handleSelectChange = (selected, setSelected, options) => {
        if (selected && selected.length && selected[selected.length - 1].value === 'selectAll') {
            setSelected(options.filter(option => option.value !== 'selectAll'));
        } else {
            setSelected(selected);
        }
    };





    console.log()
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <form onSubmit={HandleSubmit} encType="multipart/form-data">
                    <div className=" justify-center items-center h-screen">
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h3 style={{ color: "green", margin: "20px" }}>BASIC INFO</h3>
                            <div className="flex flex-wrap -mx-3 mb-6">

                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="agency_name">
                                        Employee Name <span>*</span>
                                    </label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="agency_name" type="text" placeholder="Employee Name" />

                                </div>
                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="agency_name">
                                        Employee ID <span>*</span>
                                    </label>
                                    <input value={employeeID} onChange={(e) => setEmployeeID(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="agency_name" type="text" placeholder="Employee ID" />

                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                        Email <span>*</span>
                                    </label>
                                    <input onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="text" placeholder="Email" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                        Phone Number <span>*</span>
                                    </label>
                                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="Phone" type="number" placeholder="Phone Number" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                                        Password <span>*</span>
                                    </label>
                                    <input onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="password" type="passsword" placeholder="Password" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="incorporation_date">
                                        DOB <span>*</span>
                                    </label>

                                    <DatePicker
                                        dateFormat="yyyy-MM-dd"
                                        maxDate={addDays(new Date(), -1)}
                                        selected={dob}
                                        onChange={date => setDOB(date)}
                                        placeholderText="Select start date"
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="dob" type="text" placeholder="DOB Date"
                                    />

                                </div>
                            </div>
                            <h3 style={{ color: "green", margin: "20px" }}>KYC SECTION</h3>
                            <div className="flex flex-wrap -mx-3 mb-6">

                              
                                    <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                            PAN CARD <span>*</span>
                                        </label>
                                        <input onChange={handlePanChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="file" />

                                    </div>
                              
                              
                                    <>

                                        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                ADHAAR <span>*</span>
                                            </label>
                                            <input onChange={handleAdhaarChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="file" placeholder="ADHAAR" />

                                        </div>
                                        <div className="w-full md:w-1/4 px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                Police Verification
                                            </label>
                                            <input onChange={handlePoliceVerificationChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="file" placeholder="Police Verification" />
                                        </div>
                                        <div className="w-full md:w-1/4 px-3">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                DRA
                                            </label>
                                            <input onChange={handleDRAChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="file" placeholder="DRA" />
                                        </div>
                                    </>
                              

                              

                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Profile
                                    </label>
                                    <input onChange={handleProfileChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="file" placeholder="Profile" />
                                </div>



                            </div>


                            <button type="submit" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Save</button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default App;
