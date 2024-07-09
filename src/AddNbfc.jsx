import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Select from "react-select";
import { Loader } from "./Loader";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";
import UserType from "./UserType";
import { addDays, format } from "date-fns";
import SweetAlert2 from "./SweetAlert2";
import NbfcValidation from "./NbfcValidations";

const App = () => {
  const showAlert = (data) => {
    SweetAlert2(data);
  };

  const getToken = () => localStorage.getItem("token");
  const userType = jwtDecode(localStorage.getItem("token")).type;
  const userLevel = "NBFC";
  const [loading, setLoading] = useState(true);
  const agencyType = [
    { value: "Proprietorship", label: "Proprietorship" },
    { value: "Private Limited", label: "Private Limited" },
    { value: "LLP", label: "LLP" },
  ];

  const [errors, seterrors] = useState({});
  const [formData, setFormData] = useState({
    nbfc_name: "",
    email: "",
    mobile: "",
    password: "",
    incorporation_date: "",
    nbfc_type: "",
    registration_number: "",
    gst_number: "",
    license_number: "",
    registered_address: "",
    office_address: "",
    website: "",
    fax_number: "",
    ceo: "",
    cfo: "",
    compliance_officer: "",
    number_of_office: "",
    language_covered: "",
    key_service: "",
  });

  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      setLoading(false);
      hasMounted.current = true;
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    seterrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused
        ? "2px solid #D1D5DB"
        : errors.nbfc_type
        ? "1px solid #E3342F" // Error border color
        : "1px solid #E5E7EB",
      boxShadow: state.isFocused ? null : null,
      padding: "0.2rem", // Adjusted padding
      marginTop: "-9px", // Proper syntax for margin-top
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
  };

  const handleSelectChange = (selected, options) => {
    if (
      selected &&
      selected.length &&
      selected[selected.length - 1].value === "selectAll"
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nbfc_type: options.filter((option) => option.value !== "selectAll"),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nbfc_type: selected,
      }));
      seterrors((prevErrors) => ({
        ...prevErrors,
        nbfc_type: null,
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      incorporation_date: date,
    }));
    seterrors((prevErrors) => ({
      ...prevErrors,
      incorporation_date: null,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const isValid = NbfcValidation({ formData, setLoading, seterrors });
    if (!isValid) return;

    const requestData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "nbfc_type") {
        requestData.append(
          "nbfc_type",
          formData.nbfc_type.map((option) => option.value)
        );
      } else if (key === "incorporation_date") {
        requestData.append(
          "incorporation_date",
          format(new Date(formData.incorporation_date), "yyyy-MM-dd")
        );
      } else {
        requestData.append(key, formData[key]);
      }
    });
    requestData.append("type", "nbfc");

    try {
      const response = await axios.post("api/users/AddNbfc", requestData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.data.success === true) {
        showAlert({ type: "success", title: response.data.message });
      }
      setLoading(false);
      setFormData("");
    } catch (error) {
      setLoading(false);
      if (error.response.data.success === false) {
        showAlert({ type: "error", title: error.response.data.message });
      }
    }
  };

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const userData = UserType();
  useEffect(() => {}, [userData]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className=" mx-auto py-8 px-4 "
        >
          <div className="container mx-auto mt-0  mb-7  ">
            <div className="w-full  ">
              <div className="bg-white shadow-md rounded-md border-2 border-gray-200 border-solid p-4 pt-0 ">
                <div className="bg-gray-100 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
                  <strong> Basic Information</strong>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div>
                    <label
                      className="block pl-2 text-gray-700 mb-2"
                      htmlFor="nbfc_name"
                    >
                      NBFC Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={formData.nbfc_name}
                      onChange={handleChange}
                      name="nbfc_name"
                      className={`w-full p-2 border ${
                        errors.nbfc_name ? "border-red-700" : "border-gray-300"
                      } rounded-md`}
                      id="nbfc_name"
                      type="text"
                      placeholder="NBFC Name"
                    />
                    {errors.nbfc_name && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.nbfc_name}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block pl-2 text-gray-700 mb-2"
                      htmlFor="email"
                    >
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={formData.email}
                      onChange={handleChange}
                      name="email"
                      className={`w-full p-2 border ${
                        errors.email ? "border-red-700" : "border-gray-300"
                      } rounded-md`}
                      id="email"
                      type="text"
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block pl-2 text-gray-700 mb-2"
                      htmlFor="mobile"
                    >
                      Mobile <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={formData.mobile}
                      onChange={handleChange}
                      name="mobile"
                      className={`w-full p-2 border ${
                        errors.mobile ? "border-red-700" : "border-gray-300"
                      } rounded-md`}
                      id="mobile"
                      type="tel"
                      placeholder="Mobile"
                    />
                    {errors.mobile && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.mobile}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block  pl-2 text-gray-700 mb-2"
                      htmlFor="password"
                    >
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={formData.password}
                      onChange={handleChange}
                      name="password"
                      className={`w-full p-2 border ${
                        errors.password ? "border-red-700" : "border-gray-300"
                      } rounded-md`}
                      id="password"
                      type="password"
                      placeholder="Password"
                    />
                    {errors.password && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block  pl-2 text-gray-700 mb-2"
                      htmlFor="incorporation_date"
                    >
                      Incorporation Date <span className="text-red-600">*</span>
                    </label>
                    <DatePicker
                      wrapperClassName="w-full"
                      dateFormat="yyyy-MM-dd"
                      selected={formData.incorporation_date}
                      onChange={handleDateChange}
                      maxDate={addDays(new Date(), -1)}
                      placeholderText="Select date"
                      className={`w-full p-2 border ${
                        errors.incorporation_date
                          ? "border-red-700"
                          : "border-gray-300"
                      } rounded-md`}
                      id="incorporation_date"
                    />
                    {errors.incorporation_date && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.incorporation_date}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block pl-3 text-gray-700 mb-2"
                      htmlFor="nbfc_type"
                    >
                      Type <span className="text-red-600">*</span>
                    </label>
                    <Select
                      closeMenuOnSelect={false}
                      id="nbfc_type"
                      onChange={(selected) =>
                        handleSelectChange(selected, agencyType)
                      }
                      options={agencyType}
                      isMulti
                      placeholder="Select Type"
                      styles={customSelectStyles}
                      className={`w-full p-2  ${
                        errors.nbfc_type ? "border-red-700" : "border-gray-300"
                      } rounded-md`}
                    />
                    {errors.nbfc_type && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.nbfc_type}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block  pl-2 text-gray-700 mb-2"
                      htmlFor="registration_number"
                    >
                      Registration Number{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={formData.registration_number}
                      onChange={handleChange}
                      name="registration_number"
                      className={`w-full p-2 border ${
                        errors.registration_number
                          ? "border-red-700"
                          : "border-gray-300"
                      } rounded-md`}
                      id="registration_number"
                      type="text"
                      placeholder="Registration Number"
                    />
                    {errors.registration_number && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.registration_number}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block  pl-2 text-gray-700 mb-2"
                      htmlFor="gst_number"
                    >
                      GST Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={formData.gst_number}
                      onChange={handleChange}
                      name="gst_number"
                      className={`w-full p-2 border ${
                        errors.gst_number ? "border-red-700" : "border-gray-300"
                      } rounded-md`}
                      id="gst_number"
                      type="text"
                      placeholder="GST Number"
                    />
                    {errors.gst_number && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.gst_number}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block pl-2 text-gray-700 mb-2"
                      htmlFor="license_number"
                    >
                      License Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={formData.license_number}
                      onChange={handleChange}
                      name="license_number"
                      className={`w-full p-2 border ${
                        errors.license_number
                          ? "border-red-700"
                          : "border-gray-300"
                      } rounded-md`}
                      id="license_number"
                      type="text"
                      placeholder="License Number"
                    />
                    {errors.license_number && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.license_number}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto  mb-7">
            <div className="w-full">
              <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0">
                <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
                  <strong>Contact Information</strong>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div>
                    <label
                      className="block text-gray-700 pl-2 mb-2"
                      htmlFor="registered_address"
                    >
                      Registered Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={formData.registered_address}
                      onChange={handleChange}
                      name="registered_address"
                      className={`w-full p-2 border ${
                        errors.registered_address
                          ? "border-red-700"
                          : "border-gray-300"
                      } rounded-md`}
                      id="registered_address"
                      type="text"
                      placeholder="Registered Address"
                    />
                    {errors.registered_address && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.registered_address}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 pl-2 mb-2"
                      htmlFor="office_address"
                    >
                      Office Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={formData.office_address}
                      onChange={handleChange}
                      name="office_address"
                      className={`w-full p-2 border ${
                        errors.office_address
                          ? "border-red-700"
                          : "border-gray-300"
                      } rounded-md`}
                      id="office_address"
                      type="text"
                      placeholder="Office Address"
                    />
                    {errors.office_address && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.office_address}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block pl-2 text-gray-700 mb-2"
                      htmlFor="website"
                    >
                      Website
                    </label>
                    <input
                      value={formData.website}
                      onChange={handleChange}
                      name="website"
                      className={`w-full p-2 border border-gray-300 rounded-md`}
                      id="website"
                      type="url"
                      placeholder="Website"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 pl-2 mb-2"
                      htmlFor="fax_number"
                    >
                      Fax Number
                    </label>
                    <input
                      value={formData.fax_number}
                      onChange={handleChange}
                      name="fax_number"
                      className={`w-full p-2 border border-gray-300 rounded-md`}
                      id="fax_number"
                      type="text"
                      placeholder="Fax Number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto mb-7">
            <div className="w-full">
              <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-200 border-solid pt-0">
                <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
                  <strong>Key Personnel</strong>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div>
                    <label
                      className="block text-gray-700 mb-2 pl-2"
                      htmlFor="ceo"
                    >
                      CEO
                    </label>
                    <input
                      value={formData.ceo}
                      onChange={handleChange}
                      name="ceo"
                      className={`w-full p-2 border border-gray-300 rounded-md`}
                      id="ceo"
                      type="text"
                      placeholder="CEO"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2 pl-2"
                      htmlFor="cfo"
                    >
                      CFO
                    </label>
                    <input
                      value={formData.cfo}
                      onChange={handleChange}
                      name="cfo"
                      className={`w-full p-2 border border-gray-300 rounded-md`}
                      id="cfo"
                      type="text"
                      placeholder="CFO"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2 pl-2"
                      htmlFor="compliance_officer"
                    >
                      Compliance Officer
                    </label>
                    <input
                      value={formData.compliance_officer}
                      onChange={handleChange}
                      name="compliance_officer"
                      className={`w-full p-2 border border-gray-300 rounded-md`}
                      id="compliance_officer"
                      type="text"
                      placeholder="Compliance Officer"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2 pl-2"
                      htmlFor="number_of_office"
                    >
                      Number of Offices
                    </label>
                    <input
                      value={formData.number_of_office}
                      onChange={handleChange}
                      name="number_of_office"
                      className={`w-full p-2 border border-gray-300 rounded-md`}
                      id="number_of_office"
                      type="number"
                      placeholder="Number of Offices"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2 pl-2"
                      htmlFor="language_covered"
                    >
                      Languages Covered
                    </label>
                    <input
                      value={formData.language_covered}
                      onChange={handleChange}
                      name="language_covered"
                      className={`w-full p-2 border border-gray-300 rounded-md`}
                      id="language_covered"
                      type="text"
                      placeholder="Languages Covered"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 mb-2 pl-2"
                      htmlFor="key_service"
                    >
                      Key Services
                    </label>
                    <input
                      value={formData.key_service}
                      onChange={handleChange}
                      name="key_service"
                      className={`w-full p-2 border border-gray-300 rounded-md`}
                      id="key_service"
                      type="text"
                      placeholder="Key Services"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-500 text-white font-bold py-3 px-20 rounded-md  shadow-md"
            >
              Submit
            </button>
          </div>

          <div className=""></div>
          {/* <div className="relative z-15 bg-white rounded-2xl shadow-md p-8 border-white-500">
                        <h1 className="text-2xl font-bold mb-8 ">NBFC REGISTRATION FORM</h1>
                        <div className="bg-white rounded-2xl  ring-4 ring-sky-100 ring-inset rounded-lg p-8  border-white-500">
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Basic Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nbfc_name">
                                        NBFC Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={formData.nbfc_name}
                                        onChange={handleChange}
                                        name="nbfc_name"
                                        className={`w-full p-3 border ${errors.nbfc_name ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="nbfc_name"
                                        type="text"
                                        placeholder="NBFC Name"
                                    />
                                    {errors.nbfc_name && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.nbfc_name}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                                        Email <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={formData.email}
                                        onChange={handleChange}
                                        name="email"
                                        className={`w-full p-3 border ${errors.email ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="email"
                                        type="text"
                                        placeholder="Email"
                                    />
                                    {errors.email && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="mobile">
                                        Mobile <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        name="mobile"
                                        className={`w-full p-3 border ${errors.mobile ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="mobile"
                                        type="tel"
                                        placeholder="Mobile"
                                    />
                                    {errors.mobile && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.mobile}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                                        Password <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={formData.password}
                                        onChange={handleChange}
                                        name="password"
                                        className={`w-full p-3 border ${errors.password ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                    />
                                    {errors.password && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="incorporation_date">
                                        Incorporation Date <span className="text-red-600">*</span>
                                    </label>
                                    <DatePicker
                                        wrapperClassName="w-full"
                                        dateFormat="yyyy-MM-dd"
                                        selected={formData.incorporation_date}
                                        onChange={handleDateChange}
                                        maxDate={addDays(new Date(), -1)}
                                        placeholderText="Select date"
                                        className={`w-full p-3 border ${errors.incorporation_date ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="incorporation_date"
                                    />
                                    {errors.incorporation_date && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.incorporation_date}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="nbfc_type">
                                        Type <span className="text-red-600">*</span>
                                    </label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        id="nbfc_type"
                                        onChange={(selected) => handleSelectChange(selected, agencyType)}
                                        options={agencyType}
                                        isMulti
                                        placeholder="Select Type"
                                        className={`w-full p-3 border ${errors.nbfc_type ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                    />
                                    {errors.nbfc_type && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.nbfc_type}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="registration_number">
                                        Registration Number <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={formData.registration_number}
                                        onChange={handleChange}
                                        name="registration_number"
                                        className={`w-full p-3 border ${errors.registration_number ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="registration_number"
                                        type="text"
                                        placeholder="Registration Number"
                                    />
                                    {errors.registration_number && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.registration_number}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="gst_number">
                                        GST Number <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={formData.gst_number}
                                        onChange={handleChange}
                                        name="gst_number"
                                        className={`w-full p-3 border ${errors.gst_number ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="gst_number"
                                        type="text"
                                        placeholder="GST Number"
                                    />
                                    {errors.gst_number && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.gst_number}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="license_number">
                                        License Number <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={formData.license_number}
                                        onChange={handleChange}
                                        name="license_number"
                                        className={`w-full p-3 border ${errors.license_number ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="license_number"
                                        type="text"
                                        placeholder="License Number"
                                    />
                                    {errors.license_number && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.license_number}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Contact Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="registered_address">
                                        Registered Address <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={formData.registered_address}
                                        onChange={handleChange}
                                        name="registered_address"
                                        className={`w-full p-3 border ${errors.registered_address ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="registered_address"
                                        type="text"
                                        placeholder="Registered Address"
                                    />
                                    {errors.registered_address && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.registered_address}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="office_address">
                                        Office Address <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        value={formData.office_address}
                                        onChange={handleChange}
                                        name="office_address"
                                        className={`w-full p-3 border ${errors.office_address ? 'border-red-700' : 'border-gray-300'} rounded-md`}
                                        id="office_address"
                                        type="text"
                                        placeholder="Office Address"
                                    />
                                    {errors.office_address && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.office_address}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="website">
                                        Website
                                    </label>
                                    <input
                                        value={formData.website}
                                        onChange={handleChange}
                                        name="website"
                                        className={`w-full p-3 border border-gray-300 rounded-md`}
                                        id="website"
                                        type="url"
                                        placeholder="Website"
                                    />

                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="fax_number">
                                        Fax Number
                                    </label>
                                    <input
                                        value={formData.fax_number}
                                        onChange={handleChange}
                                        name="fax_number"
                                        className={`w-full p-3 border border-gray-300 rounded-md`}
                                        id="fax_number"
                                        type="text"
                                        placeholder="Fax Number"
                                    />

                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Key Personnel</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="ceo">
                                        CEO
                                    </label>
                                    <input
                                        value={formData.ceo}
                                        onChange={handleChange}
                                        name="ceo"
                                        className={`w-full p-3 border border-gray-300 rounded-md`}
                                        id="ceo"
                                        type="text"
                                        placeholder="CEO"
                                    />

                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="cfo">
                                        CFO
                                    </label>
                                    <input
                                        value={formData.cfo}
                                        onChange={handleChange}
                                        name="cfo"
                                        className={`w-full p-3 border border-gray-300 rounded-md`}
                                        id="cfo"
                                        type="text"
                                        placeholder="CFO"
                                    />

                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="compliance_officer">
                                        Compliance Officer
                                    </label>
                                    <input
                                        value={formData.compliance_officer}
                                        onChange={handleChange}
                                        name="compliance_officer"
                                        className={`w-full p-3 border border-gray-300 rounded-md`}
                                        id="compliance_officer"
                                        type="text"
                                        placeholder="Compliance Officer"
                                    />

                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="number_of_office">
                                        Number of Offices
                                    </label>
                                    <input
                                        value={formData.number_of_office}
                                        onChange={handleChange}
                                        name="number_of_office"
                                        className={`w-full p-3 border border-gray-300 rounded-md`}
                                        id="number_of_office"
                                        type="number"
                                        placeholder="Number of Offices"
                                    />

                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="language_covered">
                                        Languages Covered
                                    </label>
                                    <input
                                        value={formData.language_covered}
                                        onChange={handleChange}
                                        name="language_covered"
                                        className={`w-full p-3 border border-gray-300 rounded-md`}
                                        id="language_covered"
                                        type="text"
                                        placeholder="Languages Covered"
                                    />

                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="key_service">
                                        Key Services
                                    </label>
                                    <input
                                        value={formData.key_service}
                                        onChange={handleChange}
                                        name="key_service"
                                        className={`w-full p-3 border border-gray-300 rounded-md`}
                                        id="key_service"
                                        type="text"
                                        placeholder="Key Services"
                                    />

                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-green-600 text-white font-bold py-2 px-10 rounded-md hover:bg-green-700 shadow-md">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div> */}
        </form>
      )}
    </>
  );
};

export default App;
