import React from 'react';

const AgencyValidation = ({ formData, setLoading, seterrors }) => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!formData.email.includes('@')) newErrors.email = "Email should contain @ symbol";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.nbfc_name.trim()) newErrors.nbfc_name = "NBFC name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
    if (!formData.incorporation_date) newErrors.incorporation_date = "Incorporation date is required";
    if (formData.nbfc_type.length === 0) newErrors.nbfc_type = "NBFC type is required"; // Corrected this line
    if (!formData.registration_number.trim()) newErrors.registration_number = "Registration number is required";
    if (!formData.registered_address.trim()) newErrors.registered_address = "Registered address is required";
    if (!formData.office_address.trim()) newErrors.office_address = "Office address is required";
    if (!formData.gst_number.trim()) newErrors.gst_number = "GST number is required";
    if (!formData.license_number.trim()) newErrors.license_number = "License Number is required";
    if (formData.PoolState.length === 0) newErrors.PoolState = "PoolState field is required"; 
    if (formData.PoolZone.length === 0) newErrors.PoolZone = "PoolZone field is required"; 
    if (formData.PoolProduct.length === 0) newErrors.PoolProduct = "PoolProduct field is required"; 
    if (formData.PoolBucket.length === 0) newErrors.PoolBucket = "PoolBucket field is required"; 
    seterrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
        setLoading(false);
        return false;
    }
    return true;
};

export default AgencyValidation;
