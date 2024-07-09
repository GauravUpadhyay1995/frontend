import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Base64 } from 'js-base64';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload } from "react-icons/fa";


const Accordion = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { id1 } = useParams();
    const decodedId = Base64.decode(id);
    const PassingData = JSON.parse(decodedId);

    const decodedId1 = Base64.decode(id1);
    const PassingData1 = JSON.parse(decodedId1);
    const [activeIndex, setActiveIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [escalationData, setEscalationData] = useState({});
    const [visibleMessages, setVisibleMessages] = useState(10);
    const [closingData, setClosingData] = useState({});
    const hasMounted = useRef(false);

    const getToken = () => localStorage.getItem('token');
    const handleToggle = (index, escalation_id) => {
        const isNULL = activeIndex === index ? null : index;
        console.log(decodedId1 == 0, isNULL)
        if (decodedId1 == 0 && isNULL >=1) {
            console.log(escalation_id)

            getClosedEscalationDetails(escalation_id)
        }
        setActiveIndex(activeIndex === index ? null : index);
    };

    useEffect(() => {
        if (!hasMounted.current) {
            setLoading(false);
            getEscalationDetails();
            hasMounted.current = true;
        }
    }, [id]);

    const getEscalationDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                '/api/escalation/getEscalationByAgencyId',
                {
                    agency_id: PassingData,
                    status: PassingData1
                },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setEscalationData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    const getClosedEscalationDetails = async (escalation_id) => {
        setLoading(true);
        try {
            const response = await axios.post(
                '/api/escalation/getClosedEscalationById',
                {
                    escalation_id: escalation_id,
                    status: 0
                },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setClosingData(response.data.data[0]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(new Blob([blob]));
            const filename = url.split("/").pop();
            const aTag = document.createElement("a");
            aTag.href = blobUrl;
            aTag.setAttribute("download", filename);
            document.body.appendChild(aTag);
            aTag.click();
            aTag.remove();
            window.URL.revokeObjectURL(blobUrl); // Clean up the object URL
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const formatDate = (dateString) => {
        // Convert dateString to Date object
        const date = new Date(dateString);

        // Get current date and yesterday
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Function to format time
        const formatTime = (date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        // Function to format date
        const formatDate = (date) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return date.toLocaleDateString(undefined, options);
        };

        // Check if the date is today
        if (isSameDay(date, today)) {
            return formatTime(date);
        }

        // Check if the date is yesterday
        if (isSameDay(date, yesterday)) {
            return 'Yesterday ' + formatTime(date);
        }

        // Otherwise, return full date and time
        return formatDate(date);
    };

    // Function to check if two dates are on the same day
    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };



    return (
        <>
            <div id="accordion-collapse" data-accordion="collapse">
                {Object.keys(escalationData).map((key, index) => (
                    <div key={index}>
                        <h2 id={`accordion-collapse-heading-${index + 1}`}>
                            <button
                                type="button"
                                className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                                onClick={() => handleToggle(index + 1, escalationData[key][0].escalation_id)}
                                aria-expanded={activeIndex === index + 1}
                                aria-controls={`accordion-collapse-body-${index + 1}`}
                            >
                                {key}
                                <svg
                                    data-accordion-icon
                                    className={`w-3 h-3 ${activeIndex === index + 1 ? 'rotate-180' : ''} shrink-0`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5 5 1 1 5"
                                    />
                                </svg>
                            </button>
                        </h2>
                        <div
                            id={`accordion-collapse-body-${index + 1}`}
                            className={`${activeIndex === index + 1 ? 'block' : 'hidden'}`}
                            aria-labelledby={`accordion-collapse-heading-${index + 1}`}
                        >


                            <main className="shadow-md rounded px-8 pt-6 pb-8 mb-4" style={{ background: '#80808070' }}>
                                {PassingData1 == 0 && (

                                    <>
                                        <div style={{ background: 'white' }} className="text-black-500 rounded px-8 pt-6 pb-8 mb-4">

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                                                <div>
                                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="agency_name">
                                                        Final Comments :
                                                    </label>
                                                    <textarea disabled value={closingData.final_comments} name="" id="">{closingData.final_comments}</textarea>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="agency_name">
                                                        Penalty Type :
                                                    </label>
                                                    <input disabled type="text" value={closingData.penalty_type == 2 ? 'Percentage' : "Fixed"} />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="agency_name">
                                                        Penalty :
                                                    </label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        value={closingData.penalty + (closingData.penalty_type == 2 ? '%' : '₹')}
                                                    />

                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="agency_name">
                                                        Duration :
                                                    </label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        value={closingData.fromDate}
                                                    />
                                                    <input
                                                        disabled
                                                        type="text"
                                                        value={(closingData.toDate)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>

                                )}

                                <div className="container mx-auto p-0">
                                    <div className="shadow-lg rounded-lg overflow-hidden">
                                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-0">
                                            <div className="col-span-3">
                                                <div className="relative">
                                                    <div className="chat-messages p-4 overflow-auto " key={index}>

                                                        {escalationData[key].slice(0, visibleMessages).map((item, itemIndex) =>
                                                            item.isAgency === 1 ? (
                                                                <div className="flex justify-end mb-4" key={itemIndex}>
                                                                    <div className="bg-gray-200 rounded-lg py-2 px-3 ml-3">
                                                                        <div className="font-semibold mb-1 text-right">You</div>
                                                                        <div className="flex justify-between items-center">
                                                                            <div className="message-content" style={{ whiteSpace: 'pre-line', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                                                                                {(item.comments)}
                                                                            </div>

                                                                            {item.attachments && (
                                                                                <p>
                                                                                    <FaDownload onClick={() => downloadFile(item.attachments)} className="ml-2 cursor-pointer" />
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col items-end ml-2">
                                                                        <img
                                                                            src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                                            className="rounded-full mb-1"
                                                                            alt="User Avatar"
                                                                            width="40"
                                                                            height="40"
                                                                        />
                                                                        <div className="text-black-500 text-xs mt-2">{formatDate(item.created_date)}</div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex justify-start mb-4" key={itemIndex}>
                                                                    <div className="flex flex-col items-start">
                                                                        <img
                                                                            src="https://bootdey.com/img/Content/avatar/avatar3.png"
                                                                            className="rounded-full mb-1"
                                                                            alt="Sharon Lessman"
                                                                            width="40"
                                                                            height="40"
                                                                        />
                                                                        <div className="text-black-500 text-xs mt-2">{formatDate(item.created_date)}</div>
                                                                    </div>
                                                                    <div className="bg-gray-200 rounded-lg py-2 px-3 ml-3">
                                                                        <div className="font-semibold mb-1">Sharon Lessman</div>
                                                                        <div className="message-content" style={{ whiteSpace: 'pre-line', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                                                                            {(item.comments)}
                                                                        </div>

                                                                        {item.attachments && (
                                                                            <p>
                                                                                <FaDownload onClick={() => downloadFile(item.attachments)} className="ml-2 cursor-pointer" />
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                    {escalationData[key].length > visibleMessages && (
                                                        <div className="flex justify-center my-4">
                                                            <button
                                                                className="bg-blue-500 text-white rounded-lg px-4 py-2"
                                                                onClick={loadMoreMessages}
                                                            >
                                                                Load More
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                ))}
            </div>

        </>

    );
};

export default Accordion;
