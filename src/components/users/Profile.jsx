import React, { useState, useEffect, useRef } from 'react';
import '../App.css';

import { Loader } from '../Loader';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import UserType from '../UserType'; // Ensure correct import path
import SweetAlert2 from '../SweetAlert2';
import ModalComponent from '../Modal';
import { FaEdit } from 'react-icons/fa';

const App = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate(); // Use the useNavigate hook
    const [loading, setLoading] = useState(true);
    const userData = UserType();
    let data = {};
    const openModal = () => {

        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const showAlert = (data) => {
        SweetAlert2(data)
    }

    useEffect(() => {
        if (userData) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [userData]);
    let ProfileImage = '';
    const profileDoc = userData?.doc?.find(doc => doc.document_name === "Profile");
    let flag = 1;

    // if (userData && userData.type === "employee") {

    //     const requiredDocuments = [
    //         "Profile",
    //         "Pan",
    //         "Adhaar",

    //     ];
    //     checkMandateDoc(requiredDocuments)
    // }

    // if (userData && userData.type === "agency") {
    //     const requiredDocuments = [
    //         "Profile",
    //         "Pan1",
    //         "COI",
    //         "Empannelment",
    //         "GSTCertificate",
    //         "SignedAgreement"
    //     ];
    //     checkMandateDoc(requiredDocuments)
    // }
    // function checkMandateDoc(mandateArray) {
    //     for (const requiredDoc of mandateArray) {
    //         if (!userData.doc.some(doc => doc.document_name === requiredDoc)) {
    //             flag = 0;
    //             break;
    //         }
    //     }
    // }


    if (profileDoc && profileDoc.url) {
        ProfileImage = profileDoc.url

    } else {
        ProfileImage = "data:image/png;base64,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";
    }
    // data = {
    //     Profile: ProfileImage,
    //     flag: flag
    // }


    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {/* <ModalComponent
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        data={data}
                    /> */}
                    <div className="p-8 bg-white  shadow mt-24 max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto py-8 px-4 ">
                        <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl shadow-md p-8">
                            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                                {userData?.type === "super admin" && (
                                    <div>
                                        <p className="font-bold text-gray-700 text-xl">  {userData?.nbfc?.counts ?? 0}</p>

                                        <p className="text-gray-400"><NavLink to="/Users" className="">NBFC</NavLink></p>
                                    </div>
                                )}
                                {(userData?.type === "nbfc" || userData?.type === "super admin") && (
                                    <div>
                                        <p className="font-bold text-gray-700 text-xl">  {userData?.agent?.counts ?? 0}</p>
                                        <p className="text-gray-400"><NavLink to="/Users" className="">Agency</NavLink></p>
                                    </div>
                                )}
                                {(userData?.type === "nbfc" || userData?.type === "super admin" || userData?.type === "agency") && (
                                    <div>
                                        <p className="font-bold text-gray-700 text-xl">  {userData?.employee?.counts ?? 0}</p>
                                        <p className="text-gray-400">Employee</p>
                                    </div>
                                )}



                            </div>
                            <div className="relative">

                                <img className='w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500' src={ProfileImage} alt="" />
                                <FaEdit className={`absolute top-14 right-14 -mt-2 mr-2 ml-2 text-green-500 cursor-pointer`} />

                            </div>

                            <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                                <button
                                    // onClick={openModal}
                                    className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"

                                >
                                    Message  {/* {(flag) ? "KYC Done" : "KYC Pending"} */}
                                </button>
                                <button
                                    className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                >
                                    Message
                                </button>
                            </div>
                        </div>

                        <div className="mt-20 text-center border-b pb-12">
                            <h1 className="text-4xl font-medium text-gray-700">
                                {userData?.nbfc_name}<span className="font-light text-gray-500"> ( {userData?.type})</span></h1>
                            <p className="font-light text-gray-600 mt-3">{userData?.email}</p>

                            <p className="mt-8 text-gray-500">Solution Manager - Creative Tim Officer</p>
                            <p className="mt-2 text-gray-500">University of Computer Science</p>
                        </div>

                        <div className="mt-12 flex flex-col justify-center">
                            <p className="text-gray-600 text-center font-light lg:px-16">An artist of considerable range, Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.</p>
                            <button
                                className="text-indigo-500 py-2 px-4  font-medium mt-4"
                            >
                                Show more
                            </button>
                        </div>

                    </div>
                </>
            )}
        </>
    );
};

export default App;
