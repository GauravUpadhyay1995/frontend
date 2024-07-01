import React, { useState, useEffect, Suspense, useRef } from 'react';
import './App.css';
import { Loader } from './Loader';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import UserType from './UserType';
import SweetAlert2 from './SweetAlert2';
import InputValidation from './NbfcValidations';
import AddAgencyForm from './AddAgencyForm';
import FileHandling from './FileHandling';
import AgencyValidation from './AgencyValidations';



const App = () => {
    const showAlert = (data) => {
        SweetAlert2(data);
    };


    const getToken = () => localStorage.getItem('token');
    const userType = jwtDecode(localStorage.getItem('token')).typ;
    const userLevel = userType === "agency" ? "employee" : (userType === "nbfc" ? "agency" : "nbfc");

    const agencyType = [
        { value: 'Proprietorship', label: 'Proprietorship' },
        { value: 'Private Limited', label: 'Private Limited' },
        { value: 'LLP', label: 'LLP' }
    ];

    const inititalFormData = {
        nbfc_name: '',
        email: '',
        incorporation_date: '',
        registration_number: '',
        gst_number: '',
        license_number: '',
        nbfc_type: [],
        mobile: '',
        registered_address: '',
        office_address: '',
        website: '',
        fax_number: '',
        ceo: '',
        cfo: '',
        Profile: null,
        Pan: null,
        COI: null,
        GSTCertificate: null,
        Empannelment: null,
        SignedAgreement: null,
        compliance_officer: '',
        number_of_office: '',
        language_covered: '',
        key_service: '',
        password: '',
        type: 'agency',
        PoolState: [],
        PoolZone: [],
        PoolBucket: [],
        PoolProduct: []

    }
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(inititalFormData)
    const [poolProducts, setPoolProductsOptions] = useState([])
    const [errors, seterrors] = useState({})
    const [ poolErrors,setPoolErrors] = useState({})
    const [fileError,setfileError] = useState(false)

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        console.log(name,files,value)
         const result = FileHandling( { files ,name ,seterrors ,errors})
         setfileError(result)
         seterrors((prevErrors) => ({
            ...prevErrors,
            [name]: null
          }));
        if (name === "PoolProduct") {
            setFormData({ ...formData, PoolProduct: value })
            

        }
        else if (name === "PoolState") {
            setFormData({ ...formData, PoolState: value })
        }
        else if (name === "PoolZone") {
            setFormData({ ...formData, PoolZone: value })
        }
        else if (name === "PoolBucket") {
            setFormData({ ...formData, PoolBucket: value })
        }

        else {
            const newValue = ['Profile', 'Pan', 'COI', 'GSTCertificate', 'Empannelment', 'SignedAgreement'].includes(name) ? files[0] : value;
            setFormData({ ...formData, [name]: newValue });
        }

    };
    // console.log(formData)
    const handleDateChange = (date) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            incorporation_date: date,
        }));
        seterrors( (prevErrors)=>({
            ...prevErrors,
            incorporation_date:null
        }))
    };
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            setLoading(false);
            getProductOptions();
            hasMounted.current = true;
        }
    }, []);

    const HandleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();       
        const poolValid = AgencyValidation({formData,setLoading,seterrors})
   
        if (!poolValid) return;
        
       
       
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    formDataToSubmit.append(key, item);
                });
            } else {
                formDataToSubmit.append(key, value);
            }
        });
        try {
            const response = await axios.post(
                'api/users/addAgency',
                formDataToSubmit,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            if (response.data.success) {
                showAlert({ type: "success", title: response.data.message });
            } else {
                showAlert({ type: "error", title: response.data.message });
            }
        } catch (error) {
            showAlert({ type: "error", title: error.response.data.message });
        } finally {
            setLoading(false);
        }
    };

    console.log(errors)

    // const handleSelectChange = (selected, setSelected, options) => {
    //     if (selected && selected.length && selected[selected.length - 1].value === 'selectAll') {
    //         setSelected(options.filter(option => option.value !== 'selectAll'));
    //     } else {
    //         setSelected(selected);
    //     }
    // };



    const userData = UserType();

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

            setPoolProductsOptions(options);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {loading ? (
                <Loader />
            ) : (

                <AddAgencyForm submitData={HandleSubmit} handleChange={handleChange} handleDateChange={handleDateChange} agencyType={agencyType} userLevel={userLevel} formData={formData} poolProducts={poolProducts} errors={errors}  fileError = {fileError}  />


            )}
        </>
    );
};

export default App;
