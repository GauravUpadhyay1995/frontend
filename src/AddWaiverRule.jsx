import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Loader } from './Loader';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import UserType from './UserType';
import SweetAlert2 from './SweetAlert2';


// http://localhost:5000/api/users/testing
const App = () => {
    const showAlert = (data) => {
        SweetAlert2(data)
    }
    const getToken = () => localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            setLoading(false)
            hasMounted.current = true;
        }
    }, []);


    const HandleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        const requestData = {
            nbfc_name: name,
            email: email,
            password: password,
            type: 'super admin'

        }
        try {
            const response = await axios.post(
                'api/users/addWaiverRule',
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



    const userData = UserType();
    useEffect(() => {
    }, [userData]);


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
                                        Wavier Scheme Name  <span>*</span>
                                    </label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="agency_name" type="text" placeholder='Employee Name' />

                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                        Principal %  <span>*</span>
                                    </label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="text" placeholder="Email" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                        Int %  <span>*</span>
                                    </label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="text" placeholder="Email" />
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
