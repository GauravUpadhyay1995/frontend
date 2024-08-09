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
    if (!formData.account_number.trim())
      newErrors.account_number = "Account Number is required";
    if (!formData.ifsc_code.trim())
      newErrors.ifsc_code = "Ifsc Code is required";
    if (!formData.bank_branch.trim())
      newErrors.bank_branch = "Branch Name is required";
    if (!formData.bank_name.trim())
      newErrors.bank_name = "Bank Name is required";
    if (!formData.beneficiary_name.trim())
      newErrors.beneficiary_name = "Beneficiary is required";
   if (!formData.Pan || formData.Pan.length === 0)
     newErrors.Pan = "Pan Number is Required";
   if (!formData.COI || formData.COI.length === 0)
     newErrors.COI = "COI Number is Required";
   if (!formData.GSTCertificate || formData.GSTCertificate.length === 0)
     newErrors.GSTCertificate = "Gst Certificate is Required";
   if (!formData.Empannelment || formData.Empannelment.length === 0)
     newErrors.Empannelment = "Empannelment is Required";
   if (!formData.SignedAgreement || formData.SignedAgreement.length === 0)
     newErrors.SignedAgreement = "Signed Agreement is Required";
   if (!formData.Profile || formData.Profile.length === 0)
     newErrors.Profile = "Profile is Required";
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
