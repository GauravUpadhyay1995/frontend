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
import { StateOptions, ZoneOptions, BucketOptions } from './StateOptions'


// http://localhost:5000/api/users/testing
const App = () => {
    const showAlert = (data) => {
        SweetAlert2(data)
    }
    const getToken = () => localStorage.getItem('token');
    const userType = jwtDecode(localStorage.getItem('token')).type;
    const userLevel = userType === "agency" ? "employee" : (userType === "nbfc" ? "agency" : "nbfc");

    const agencyType = [
        { value: 'Proprietorship', label: 'Proprietorship' },
        { value: ' Private Limited', label: ' Private Limited' },
        { value: 'LLP', label: 'LLP' }
    ];


    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorporationDate, setIncorporationDate] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [licenseNumber, setLicenseNumber] = useState("");
    const [registeredAddress, setRegisteredAddress] = useState('');
    const [corporateOfficeAddress, setCorporateOfficeAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [website, setWebsite] = useState('');
    const [faxNumber, setFaxNumber] = useState('');

    const [ceo, setCeo] = useState('');
    const [cfo, setCfo] = useState('');
    const [complianceOfficer, setComplianceOfficer] = useState('');
    const [officeNumber, setOfficeNumber] = useState('');
    const [langugeCovered, setLangugeCovered] = useState('');
    const [keyServices, setKeyServices] = useState('');
    const [selectedNbfcTypes, setSelectedNbfcTypes] = useState('');
    const [selectedPoolState, setSelectedPoolState] = useState([]);
    const [selectedPoolZone, setSelectedPoolZone] = useState('');
    const [PoolProductsOptions, setPoolProductsOptions] = useState('');
    const [SelectedPoolProductsOptions, setSelectedPoolProductsOptions] = useState('');
    const [selectedPoolBucket, setSelectedPoolBucket] = useState('');



    const [Pan, setPan] = useState();
    const [Profile, setProfile] = useState();
    const [COI, setCOI] = useState();
    const [GSTCertificate, setGSTCertificate] = useState();
    const [Empannelment, setEmpannelment] = useState();
    const [SignedAgreement, setSignedAgreement] = useState();
    const handleCOIChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setCOI(selectedFile);
        }
    }
    const handleGSTCertificateChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setGSTCertificate(selectedFile);
        }
    }
    const handleEmpannelmentChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setEmpannelment(selectedFile);
        }
    }
    const handleSignedAgreementChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setSignedAgreement(selectedFile);
        }
    }


    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            setLoading(false)
            getProductOptions()
            hasMounted.current = true;
        }
    }, []);

    const handlePanChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setPan(selectedFile);
        }
    }


    const handleProfileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setProfile(selectedFile);
        }
    }

    const HandleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        const requestData = new FormData();
        requestData.append('nbfc_name', name);
        requestData.append('email', email);
        requestData.append('password', password);
        requestData.append('incorporation_date', incorporationDate);
        requestData.append('registration_number', registrationNumber);
        requestData.append('license_number', licenseNumber);
        requestData.append('nbfc_type', selectedNbfcTypes.map(option => option.value));
        requestData.append('mobile', contactNumber);
        requestData.append('registered_address', registeredAddress);
        requestData.append('office_address', corporateOfficeAddress);
        requestData.append('website', website);
        requestData.append('fax_number', faxNumber);
        requestData.append('ceo', ceo);
        requestData.append('cfo', cfo);
        requestData.append('compliance_officer', complianceOfficer);
        requestData.append('number_of_office', officeNumber);
        requestData.append('language_covered', langugeCovered);
        requestData.append('key_service', keyServices);
        requestData.append('gst_number', gstNumber);

        requestData.append('type', 'agency');

        if (Pan) requestData.append('Pan', Pan);
        if (Profile) requestData.append('Profile', Profile);

        if (COI) requestData.append('COI', COI);
        if (GSTCertificate) requestData.append('GSTCertificate', GSTCertificate);
        if (Empannelment) requestData.append('Empannelment', Empannelment);
        if (SignedAgreement) requestData.append('SignedAgreement', SignedAgreement);

        if (selectedPoolState.length > 0) {
            const poolStateArray = selectedPoolState.map(option => option.value);
            requestData.append('PoolState', JSON.stringify(poolStateArray));
        }

        if (SelectedPoolProductsOptions.length > 0) {
            const productArray = SelectedPoolProductsOptions.map(option => option.value);
            requestData.append('PoolProduct', JSON.stringify(productArray));
        }
        if (selectedPoolZone.length > 0) {
            const productArray = selectedPoolZone.map(option => option.value);
            requestData.append('PoolZone', JSON.stringify(productArray));
        }
        if (selectedPoolBucket.length > 0) {
            const productArray = selectedPoolBucket.map(option => option.value);
            requestData.append('PoolBucket', JSON.stringify(productArray));
        }

        try {
            const response = await axios.post(
                'api/users/addAgency',
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

    function Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const userData = UserType();
    useEffect(() => {
    }, [userData]);


    const getProductOptions = async () => {
        try {
            const response = await axios.post(
                'api/users/getProducts',
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            const options = response.data.data.map(option => ({
                value: option.product,
                label: option.product,
            }));

            setPoolProductsOptions(options)
            setLoading(false);
        } catch (error) {

            console.log(error)
        }
    }
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
                                        {Capitalize(userLevel)} Name  <span>*</span>
                                    </label>
                                    <input onChange={(e) => setName(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="agency_name" type="text" placeholder={`${Capitalize(userLevel)} Name`} />

                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                        Email <span>*</span>
                                    </label>
                                    <input onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="text" placeholder="Email" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                                        Password <span>*</span>
                                    </label>
                                    <input onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="password" type="passsword" placeholder="Password" />
                                </div>


                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="incorporation_date">
                                        Incorporation Date <span>*</span>
                                    </label>

                                    <DatePicker
                                    dateFormat="yyyy-MM-dd"
                                        maxDate={addDays(new Date(), -1)}
                                        selected={incorporationDate}
                                        onChange={date => setIncorporationDate(date)}
                                        placeholderText="Select start date"
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="incorporation_date" type="text" placeholder="Incorporation Date"
                                    />

                                </div>

                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="incorporation_date">
                                        TYPE <span>*</span>
                                    </label>
                                    <Select

                                        closeMenuOnSelect={false}
                                        id="product"
                                        onChange={(selected) => handleSelectChange(selected, setSelectedNbfcTypes, agencyType)}

                                        options={agencyType}
                                        isMulti
                                        className=""
                                        placeholder="Select Type"
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="registration_number">
                                        Registration Number <span>*</span>
                                    </label>
                                    <input onChange={(e) => setRegistrationNumber(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="registration_number" type="text" placeholder="Registration Number" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="gst_number">
                                        GST Number <span>*</span>
                                    </label>
                                    <input onChange={(e) => setGstNumber(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="gst_number" type="text" placeholder="GST Number" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        License Number <span>*</span>
                                    </label>
                                    <input onChange={(e) => setLicenseNumber(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="registration_number" type="text" placeholder="License Number" />
                                </div>


                            </div>
                            <h3 style={{ color: "green", margin: "20px" }}>CONTACT INFO</h3>
                            <div className="flex flex-wrap -mx-3 mb-6">

                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Registered Address <span>*</span>
                                    </label>
                                    <input onChange={(e) => setRegisteredAddress(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Registered Address" />

                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Corporate Office Address <span>*</span>
                                    </label>
                                    <input onChange={(e) => setCorporateOfficeAddress(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Corporate Office Address" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Contact Number <span>*</span>
                                    </label>
                                    <input onChange={(e) => setContactNumber(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Contact Number" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Website
                                    </label>
                                    <input onChange={(e) => setWebsite(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Website" />
                                </div>


                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Fax Number
                                    </label>
                                    <input onChange={(e) => setFaxNumber(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder=" Fax Number" />
                                </div>


                            </div>
                            <h3 style={{ color: "green", margin: "20px" }}>KEY PERSONNEL</h3>
                            <div className="flex flex-wrap -mx-3 mb-6">

                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        CEO
                                    </label>
                                    <input onChange={(e) => setCeo(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="CEO" />

                                </div>
                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        CFO
                                    </label>
                                    <input onChange={(e) => setCfo(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="CFO" />

                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Compliance Officer
                                    </label>
                                    <input onChange={(e) => setComplianceOfficer(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Compliance Officer" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Number of Offices
                                    </label>
                                    <input onChange={(e) => setOfficeNumber(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Number of Offices" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Language Covered
                                    </label>
                                    <input onChange={(e) => setLangugeCovered(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Language Covered" />
                                </div>


                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Key Services
                                    </label>
                                    <input onChange={(e) => setKeyServices(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" placeholder="Key Services" />
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





                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        COI <span>*</span>
                                    </label>
                                    <input onChange={handleCOIChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="file" />

                                </div>

                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        GST Certificate <span>*</span>
                                    </label>
                                    <input onChange={handleGSTCertificateChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="file" />

                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Empannelment  Request <span>*</span>
                                    </label>
                                    <input onChange={handleEmpannelmentChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="file" />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Signed Agreement <span>*</span>
                                    </label>
                                    <input onChange={handleSignedAgreementChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="file" />
                                </div>



                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Profile
                                    </label>
                                    <input onChange={handleProfileChange} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="file" placeholder="Profile" />
                                </div>



                            </div>

                            <h3 style={{ color: "green", margin: "20px" }}>Pool Allocation</h3>
                            <div className="flex flex-wrap -mx-3 mb-6">

                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="incorporation_date">
                                        State <span>*</span>
                                    </label>
                                    <Select

                                        closeMenuOnSelect={false}
                                        id="state"
                                        onChange={(selected) => handleSelectChange(selected, setSelectedPoolState, StateOptions)}
                                        options={StateOptions}
                                        isMulti
                                        className=""
                                        placeholder="Select Type"
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="incorporation_date">
                                        Zone <span>*</span>
                                    </label>
                                    <Select

                                        closeMenuOnSelect={false}
                                        id="Zone"
                                        onChange={(selected) => handleSelectChange(selected, setSelectedPoolZone, ZoneOptions)}
                                        options={ZoneOptions}
                                        isMulti
                                        className=""
                                        placeholder="Select Zone"
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="incorporation_date">
                                        Product <span>*</span>
                                    </label>
                                    <Select

                                        closeMenuOnSelect={false}
                                        id="Product"
                                        onChange={(selected) => handleSelectChange(selected, setSelectedPoolProductsOptions, PoolProductsOptions)}
                                        options={PoolProductsOptions}
                                        isMulti
                                        className=""
                                        placeholder="Select Product"
                                    />
                                </div>
                                <div className="w-full md:w-1/4 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="incorporation_date">
                                        Bucket <span>*</span>
                                    </label>
                                    <Select

                                        closeMenuOnSelect={false}
                                        id="Bucket"
                                        onChange={(selected) => handleSelectChange(selected, setSelectedPoolBucket, BucketOptions)}
                                        options={BucketOptions}
                                        isMulti
                                        className=""
                                        placeholder="Select Bucket"
                                    />
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
