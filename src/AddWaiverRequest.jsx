import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { Loader } from './Loader';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import SweetAlert2 from './SweetAlert2';

const App = () => {
    const navigate = useNavigate(); // Use the useNavigate hook

    const showAlert = (data) => {
        SweetAlert2(data)
    }

    const getToken = () => localStorage.getItem('token');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  // Initially false since you are not loading on mount
    const [loanId, setLoanId] = useState('');
    const [customerData, setCustomerData] = useState('');
    const [principalAmt, setPrincipalAmt] = useState(0);
    const [principalPercentage, setPrincipalPercentage] = useState(0);
    const [penalAmt, setPenalAmt] = useState(0);
    const [totalAmt, setTotalAmt] = useState(0);
    const [penalPercentage, setPenalPercentage] = useState(0);
    const [intrestAmt, setIntrestAmt] = useState(0);
    const [intrestPercentage, setIntrestPercentage] = useState(0);
    const [disabledPrincipalAmt, setDisabledPrincipalAmt] = useState(0);
    const [disabledPrincipalPercentage, setDisabledPrincipalPercentage] = useState(0);

    const [disabledPenalAmt, setDisabledPenalAmt] = useState(0);
    const [disabledPenalPercentage, setDisabledPenalPercentage] = useState(0);

    const [disabledIntrestAmt, setDisabledIntrestAmt] = useState(0);
    const [disabledIntrestPercentage, setDisabledIntrestPercentage] = useState(0);




    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        if (loanId) {
            GetUserDetails(loanId);
        }

    }, [loanId]);
    useEffect(() => {
        const principal = parseFloat(principalAmt) || 0;
        const penal = parseFloat(penalAmt) || 0;
        const interest = parseFloat(intrestAmt) || 0;
        setTotalAmt(principal + penal + interest)
    }, [principalAmt, penalAmt, intrestAmt]);
    const calculateAmount = (totalAmount, percentage) => {
        return (totalAmount * percentage) / 100;
    };

    const calculatePercentage = (totalAmount, amount) => {
        return (amount / totalAmount) * 100;
    };
    const handlePrincipalAmtChange = (e) => {
        setError("")

        const value = e.target.value;
        const regex = /^-?\d*\.?\d*$/;
        if (regex.test(value) && value <= customerData[0].prin_overdue && value > 0) {
            const convertedAmt = calculatePercentage(customerData[0].prin_overdue, value);
            setPrincipalPercentage(convertedAmt);
            setPrincipalAmt(value);
            setDisabledPrincipalPercentage(1)
        } else {
            setError(`Amount should be >= 1 or <= ${customerData[0].prin_overdue}`)

            setPrincipalPercentage(0);
            setPrincipalAmt(0);
            setDisabledPrincipalPercentage(0)
            setDisabledPrincipalAmt(0)

        }
    };
    const handlePrincipalPercentageChange = (e) => {
        setError("")

        const value = e.target.value;
        const regex = /^-?\d*\.?\d*$/;
        if (regex.test(value) && value <= 100 && value > 0) {
            const convertedAmt = calculateAmount(customerData[0].prin_overdue, value)
            setPrincipalAmt(convertedAmt);
            setPrincipalPercentage(value);
            setDisabledPrincipalAmt(1)

        } else {
            setError("% sholud be in between 1>=or<=100")

            setPrincipalPercentage(0);
            setPrincipalAmt(0);
            setDisabledPrincipalPercentage(0)
            setDisabledPrincipalAmt(0)

        }
    };
    const handleIntrestPercentageChange = (e) => {
        setError("")

        const value = e.target.value;
        const regex = /^-?\d*\.?\d*$/;
        if (regex.test(value) && value <= 100 && value > 0) {
            const convertedAmt = calculateAmount(customerData[0].overdue_int, value)
            setIntrestAmt(convertedAmt);
            setIntrestPercentage(value);
            setDisabledIntrestAmt(1)

        } else {
            setError("% sholud be in between 1>=or<=100")

            setIntrestPercentage(0);
            setIntrestAmt(0);
            setDisabledIntrestAmt(0)
            setDisabledIntrestPercentage(0)

        }

    }
    const handleIntrestAmtChange = (e) => {
        setError("")

        const value = e.target.value;
        const regex = /^-?\d*\.?\d*$/;
        if (regex.test(value) && value <= customerData[0].overdue_int && value > 0) {
            const convertedAmt = calculatePercentage(customerData[0].overdue_int, value)
            setIntrestAmt(value);
            setIntrestPercentage(convertedAmt);
            setDisabledIntrestPercentage(1)

        } else {
            setError(`Amount should be >= 1 or <= ${customerData[0].overdue_int}`)

            setIntrestPercentage(0);
            setIntrestAmt(0);
            setDisabledIntrestPercentage(0)
            setDisabledIntrestAmt(0)

        }
    }

    const handlePenalPercentageChange = (e) => {
        setError("")

        const value = e.target.value;
        const regex = /^-?\d*\.?\d*$/;
        if (regex.test(value) && value <= 100 && value > 0) {
            const convertedAmt = calculateAmount(customerData[0].penal_due, value)
            setPenalAmt(convertedAmt);
            setPenalPercentage(value);
            setDisabledPenalAmt(1)

        } else {
            setError("% sholud be in between 1>=or<=100")

            setPenalPercentage(0);
            setPenalAmt(0);
            setDisabledPenalAmt(0)
            setDisabledPenalPercentage(0)

        }

    }
    const handlePenalAmtChange = (e) => {
        setError("")

        const value = e.target.value;
        const regex = /^-?\d*\.?\d*$/;
        if (regex.test(value) && value <= customerData[0].penal_due && value > 0) {
            const convertedAmt = calculatePercentage(customerData[0].penal_due, value)
            setPenalAmt(value);
            setPenalPercentage(convertedAmt);
            setDisabledPenalPercentage(1)

        } else {
            setError(`Amount should be >= 1 or <= ${customerData[0].penal_due}`)
            setPenalPercentage(0);
            setPenalAmt(0);
            setDisabledPenalPercentage(0)
            setDisabledPenalAmt(0)

        }
    }
    const HandleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (intrestAmt <= 0 && penalAmt <= 0 && principalAmt <= 0) {
            setError("Can't Request this Waiver.")
            setLoading(false);
        } else {


            const requestData = {
                LoanId: loanId,
                principalAmt: principalAmt,
                penalAmt: penalAmt,
                intrestAmt: intrestAmt,
                principalPercentage: principalPercentage,
                penalPercentage: penalPercentage,
                intrestPercentage: intrestPercentage,
                totalAmt: totalAmt
            };
            try {
                const response = await axios.post(
                    'api/users/addWaiverRequest',
                    requestData,
                    { headers: { Authorization: `Bearer ${getToken()}` } }
                );


                const timer = setTimeout(() => {
                    setLoading(false);
                    if (response.data.success) {
                        showAlert({ type: "success", title: response.data.message });
                    }
                    navigate('/');
                }, 2 * 1000); // x is the number of seconds
                return () => clearTimeout(timer);

            } catch (error) {
                setLoading(false);
                if (error.response && error.response.data && error.response.data.success === false) {
                    showAlert({ type: "error", title: error.response.data.message });
                }
            }
        }
    };
    const HandleReset = async () => {
        setLoading(true);
        const timer = setTimeout(() => {

            setPenalPercentage(0);
            setPenalAmt(0);
            setDisabledPenalPercentage(0)
            setDisabledPenalAmt(0)
            setIntrestPercentage(0);
            setIntrestAmt(0);
            setDisabledIntrestPercentage(0)
            setDisabledIntrestAmt(0)
            setPrincipalPercentage(0);
            setPrincipalAmt(0);
            setDisabledPrincipalPercentage(0)
            setDisabledPrincipalAmt(0)
            setLoading(false);
        }, 2 * 1000); // x is the number of seconds

        // Clean up the timer on component unmount
        return () => clearTimeout(timer);




    };

    const handleLoanIdChange = (e) => {
        const value = e.target.value;
        setLoanId(value);
    };

    const GetUserDetails = async (loanId) => {
        setLoading(true);

        const requestData = {
            LoanId: loanId,
        };

        try {
            const response = await axios.post(
                'api/users/getCustomerDetails',
                requestData,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            if (response.data.success) {
                showAlert({ type: "success", title: response.data.message });
            } else {
                showAlert({ type: "error", title: response.data.message });
            }
            setCustomerData(response.data.data)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data && error.response.data.success === false) {
                showAlert({ type: "error", title: error.response.data.message });
            }
        }
    };
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <form onSubmit={HandleSubmit}>

                    <div className="justify-center items-center h-screen">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full px-3 mb-6 md:mb-0">
                                            <label
                                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                                htmlFor="agency_name"
                                            >
                                                Loan ID <span>*</span>
                                            </label>
                                            <input
                                                value={loanId}
                                                onChange={handleLoanIdChange}
                                                className="text-gray-700 block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"

                                                type="text"
                                                placeholder="Loan ID"
                                            />
                                        </div>
                                    </div>


                                </div>
                            </div>
                            {customerData[0] && (
                                <>
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <div className="bg-white shadow-md rounded px-8 pt-6 relative"> {/* Added relative positioning */}
                                            <div className="flex flex-wrap -mx-3 mb-6">
                                                <div className="user-card-content text-gray-700 p-2" style={{ padding: '21px' }}>
                                                    <div className="user-card-content text-gray-700">
                                                        <div className="flex flex-wrap">
                                                            <p>Principal Waiver :</p>
                                                        </div>
                                                        <div className="flex flex-wrap">
                                                            <p>Penal Waiver :</p>
                                                        </div>
                                                        <div className="flex flex-wrap">
                                                            <p>Intrest Waiver :</p>
                                                        </div>
                                                        <div className="flex flex-wrap">
                                                            <p>Total Amount :</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ padding: '21px' }} className="user-card-content text-gray-700 p-2">
                                                    <div className="user-card-content text-gray-700">
                                                        <div className="flex flex-wrap">
                                                            <p>{principalAmt}</p>
                                                        </div>
                                                        <div className="flex flex-wrap">
                                                            <p>{penalAmt}</p>
                                                        </div>
                                                        <div className="flex flex-wrap">
                                                            <p>{intrestAmt}</p>
                                                        </div>
                                                        <div className="flex flex-wrap">
                                                            <p>{totalAmt}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ position: 'absolute', bottom: '0', right: '0', margin: '10px' }} > <button
                                                    type="button"
                                                    onClick={HandleReset}
                                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                // Added absolute positioning  style={{ position: 'absolute', bottom: '0', right: '0', margin: '10px' }}
                                                >
                                                    Reset
                                                </button>
                                                    <button
                                                        type="submit"
                                                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                    // Added absolute positioning
                                                    >
                                                        Submit
                                                    </button>
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                </>
                            )}
                            {customerData[0] && (
                                <>

                                    <div className="w-full px-3 mb-6 md:mb-0">

                                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                            {error && <div className="text-red-500 mb-4">{error}</div>}
                                            <div className=" flex flex-wrap user-card">
                                                <div className="user-card-content text-gray-700 p-2">
                                                    <div className="user-card-content text-gray-700">
                                                        <div className=" flex flex-wrap ">
                                                            <p>Phone No :  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>Loan Id :  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>State :  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>City :  </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="user-card-content text-gray-700  p-2" style={{ marginRight: '8rem' }}>
                                                    <div className="user-card-content text-gray-700">
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? customerData[0].phone_number : "-"}  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? customerData[0].loan_id : "-"}  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? customerData[0].state : "-"}  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? customerData[0].city : "-"}  </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="user-card-content text-gray-700 p-2">
                                                    <div className="user-card-content text-gray-700">
                                                        <div className=" flex flex-wrap ">
                                                            <p>Principal Amt :  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>Overdue Intrest Amt :  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>Penal Due :  </p>
                                                        </div>


                                                        <div className=" flex flex-wrap ">
                                                            <p>Total OverDue :  </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ marginRight: '14rem' }} className="user-card-content text-gray-700 p-2">
                                                    <div className="user-card-content text-gray-700">
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? parseFloat(customerData[0].prin_overdue).toFixed(2) : "-"}  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? parseFloat(customerData[0].overdue_int).toFixed(2) : "-"}  </p>

                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? parseFloat(customerData[0].penal_due).toFixed(2) : "-"}  </p>

                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? parseFloat(customerData[0].total_overdue).toFixed(2) : "-"}  </p>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="user-card-content text-gray-700 p-2">
                                                    <div className="user-card-content text-gray-700">
                                                        <div className=" flex flex-wrap ">
                                                            <p>DOB :  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>Occupation :  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>Credit Score :  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>Age :  </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="user-card-content text-gray-700  p-2">
                                                    <div className="user-card-content text-gray-700">
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? customerData[0].dob : "-"}  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? customerData[0].occupation : "-"}  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? customerData[0].credit_score : "-"}  </p>
                                                        </div>
                                                        <div className=" flex flex-wrap ">
                                                            <p>{customerData[0] ? customerData[0].age : "-"}  </p>
                                                        </div>
                                                    </div>
                                                </div>




                                            </div>
                                            <hr className='mb-2' />
                                            <h3 style={{ color: "green", margin: "20px" }}>Principal Waiver</h3>
                                            <div className="flex flex-wrap -mx-3 mb-6">

                                                <div className="w-full  md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label
                                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                                        htmlFor="agency_name"
                                                    >
                                                        In Amount
                                                    </label>
                                                    <input
                                                        value={principalAmt}
                                                        onChange={handlePrincipalAmtChange}
                                                        className="text-gray-700 block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"

                                                        type="text"
                                                        placeholder="Enter Amount"
                                                        disabled={disabledPrincipalAmt}
                                                    />

                                                </div>
                                                <div className="w-full  md:w-1/2 px-3 mb-6 md:mb-0">
                                                    <label
                                                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                                        htmlFor="agency_name"
                                                    >
                                                        In Percentage
                                                    </label>

                                                    <input
                                                        value={principalPercentage}
                                                        onChange={handlePrincipalPercentageChange}
                                                        className="text-gray-700 block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"

                                                        type="text"
                                                        placeholder="Enter %"
                                                        disabled={disabledPrincipalPercentage}
                                                    />

                                                </div>

                                            </div>
                                            <h3 style={{ color: "green", margin: "20px" }}>Intrest Waiver</h3>
                                            <div className="flex flex-wrap -mx-3 mb-6">

                                                <div className="w-full  md:w-1/2 px-3 mb-6 md:mb-0">

                                                    <input
                                                        value={intrestAmt}
                                                        // onChange={(e) => setIntrestAmt(e.target.value)}
                                                        onChange={handleIntrestAmtChange}
                                                        className="text-gray-700 block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                        disabled={disabledIntrestAmt}
                                                        type="text"
                                                        placeholder="Enter Amount"
                                                    />

                                                </div>
                                                <div className="w-full  md:w-1/2 px-3 mb-6 md:mb-0">


                                                    <input
                                                        value={intrestPercentage}
                                                        onChange={handleIntrestPercentageChange}
                                                        className="text-gray-700 block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                        disabled={disabledIntrestPercentage}
                                                        type="text"
                                                        placeholder="Enter %"
                                                    />

                                                </div>

                                            </div>
                                            <h3 style={{ color: "green", margin: "20px" }}>Penal Waiver</h3>
                                            <div className="flex flex-wrap -mx-3 mb-6">

                                                <div className="w-full  md:w-1/2 px-3 mb-6 md:mb-0">

                                                    <input
                                                        value={penalAmt}
                                                        onChange={handlePenalAmtChange}
                                                        className="text-gray-700 block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                        disabled={disabledPenalAmt}
                                                        type="text"
                                                        placeholder="Enter Amount"
                                                    />

                                                </div>
                                                <div className="w-full  md:w-1/2 px-3 mb-6 md:mb-0">


                                                    <input
                                                        value={penalPercentage}
                                                        onChange={handlePenalPercentageChange}
                                                        className="text-gray-700 block w-full border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                        disabled={disabledPenalPercentage}
                                                        type="text"
                                                        placeholder="Enter %"
                                                    />

                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default App;
