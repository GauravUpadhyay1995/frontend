import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Loader } from './Loader';
import axios from 'axios';
import SweetAlert2 from './SweetAlert2';
import { Base64 } from 'js-base64';
import { useParams, useNavigate } from 'react-router-dom';
import Page404 from './NotFound404';

// WaiverDetails Component
const WaiverDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [page404, setPage404] = useState(false);
    const decodedId = Base64.decode(id);
    const [loading, setLoading] = useState(true);
    const [updatedPrincipal, setUpdatedPrincipal] = useState(0);
    const [updatedPenal, setUpdatedPenal] = useState(0);
    const [updatedIntrest, setUpdatedIntrest] = useState(0);
    const [principalReq, setPrincipalReq] = useState(0);
    const [penalReq, setPenalReq] = useState(0);
    const [intrestReq, setIntrestReq] = useState(0);
    const [principalRule, setPrincipalRule] = useState(0);
    const [penalRule, setPenalRule] = useState(0);
    const [intrestRule, setIntrestRule] = useState(0);
    const [waiverData, setWaiverData] = useState();

    const hasMounted = useRef(false);
    let customerData = {};

    const showAlert = (data) => {
        SweetAlert2(data);
    };

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        if (!hasMounted.current) {
            setLoading(false);
            getWaiverDetails();
            hasMounted.current = true;
        }
    }, []);

    const getWaiverDetails = async () => {
        setLoading(true);

        try {
            const response = await axios.post(
                '/api/users/waiverDetails', // Ensure the path starts with '/api'
                { id: decodedId },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            customerData = response.data.data[0];
            setWaiverData(customerData)
            setUpdatedPrincipal(customerData.approved_principal)
            setUpdatedPenal(customerData.approved_penal)
            setUpdatedIntrest(customerData.approved_intrest)
            setPrincipalReq(customerData.principal_amt)
            setPenalReq(customerData.penal_amt)
            setIntrestReq(customerData.intrest_amt)
            setIntrestReq(customerData.intrest_amt)
            setPrincipalRule(5)
            setPenalRule(2)
            setIntrestRule(3)
            if (response.data.success == false) {
                const timer = setTimeout(() => {
                    setLoading(false);
                    if (response.data.success) {
                        showAlert({
                            type: "error", title: response.data.message
                        });
                    }
                    setPage404(true);
                }, 1 * 1000); // x is the number of seconds
                return () => clearTimeout(timer);

            } else {


            }

            // Set the state with the fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    if (page404) {
        return <Page404 />;
    }

    const HandlePenal = async (e) => {
        const value = e.target.value;
        setUpdatedPenal(value)
    }
    const HandlePrincipal = async (e) => {
        const value = e.target.value;
        setUpdatedPrincipal(value)
        console.log(value)

    }


    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="flex space-x-4 text-gray-700">
                    {/* Left card for employee details */}
                    <div className="w-1/4 p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Customer Details</h2>
                        <div className="space-y-2">
                            <div className="flex">
                                <p className="font-semibold w-1/2">DOB:</p>
                                <p className="w-3/4">{waiverData.dob ? waiverData.dob : "-"}</p>
                            </div>
                            <div className="flex">
                                <p className="font-semibold w-1/2">AGE:</p>
                                <p className="w-3/4">{waiverData.age ? waiverData.age : "-"}</p>
                            </div>
                            <div className="flex">
                                <p className="font-semibold w-1/2">Phone Number:</p>
                                <p className="w-3/4">{waiverData.phone_number ? waiverData.phone_number : "-"}</p>
                            </div>
                            <div className="flex">
                                <p className="font-semibold w-1/2">LoanID:</p>
                                <p className="w-3/4">{decodedId}</p>
                            </div>
                            <div className="flex">
                                <p className="font-semibold w-1/2">Last EMI:</p>
                                <p className="w-3/4">{waiverData.last_emi_date ? waiverData.last_emi_date : "-"}</p>
                            </div>
                            <div className="flex">
                                <p className="font-semibold w-1/2">Last payment:</p>
                                <p className="w-3/4">{waiverData.date_of_last_payment ? waiverData.date_of_last_payment : "-"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right card for the form */}
                    <div className="w-3/4 p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Waiver Details</h2>
                        <form className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-3/4" htmlFor="name">Principal Request (₹):</label>
                                <input disabled="true" value={principalReq} className="w-1/4 p-2 border rounded" type="text" id="name" name="name" />
                                <label className="w-3/4" htmlFor="name">Principal Rule (%):</label>
                                <input disabled="true" className="w-1/4 p-2 border rounded" type="text" id="name" name="name" value={principalRule} />
                                <label className="w-3/4" htmlFor="name">Principal Approved (₹):</label>
                                <input value={updatedPrincipal} onChange={HandlePrincipal} className="w-1/4 p-2 border rounded" type="text" id="name" name="name" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-3/4" htmlFor="name">Penal Request (₹):</label>
                                <input disabled="true" value={penalReq} className="w-1/4 p-2 border rounded" type="text" id="name" name="name" />
                                <label className="w-3/4" htmlFor="name">Penal Rule (%):</label>
                                <input disabled="true" value={penalRule} className="w-1/4 p-2 border rounded" type="text" id="name" name="name" />
                                <label className="w-3/4" htmlFor="name">Penal Approved (₹):</label>
                                <input value={updatedPenal} onChange={HandlePenal} className="w-1/4 p-2 border rounded" type="text" id="name" name="name" />
                            </div>
                            <div className="flex items-center">

                                <textarea className="w-full p-2 border rounded" type="textarea" placeholder='Enter the reason for approval / rejection the waiver' />

                            </div>

                            <div className="flex items-center justify-end">
                                <button className="p-2 bg-blue-500 text-white rounded" type="submit">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default WaiverDetails;
