import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from "date-fns";
import Select from "react-select";
import { StateOptions, ZoneOptions, BucketOptions } from "../StateOptions";


const AddAgencyForm = ({
  submitData,
  handleChange,
  handleDateChange,
  agencyType,
  userLevel,
  formData,
  poolProducts,
  errors,
  customSelectStyles,
  customStyles,
}) => {
  return (
    <>
      <form
        onSubmit={submitData}
        encType="multipart/form-data"
        className="mx-auto"
      >
        <div className="container mx-auto  mb-7 ">
          <div className="w-full ">
            <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0 ">
              <div className="bg-gray-100 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
                <strong>Basic Information</strong>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                  <label
                    className="block text-gray-700 pl-2 mb-2"
                    htmlFor="agency_name"
                  >
                    Agency Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.nbfc_name ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    id="agency_name"
                    type="text"
                    name="nbfc_name"
                    placeholder="Agency Name"
                  />
                  {errors.nbfc_name && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
                      {errors.nbfc_name}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-700 pl-2 mb-2"
                    htmlFor="email"
                  >
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.nbfc_name ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    name="email"
                    id="email"
                    type="text"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block pl-2 text-gray-700 mb-2"
                    htmlFor="password"
                  >
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.nbfc_name ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    id="password"
                    type="password"
                    placeholder="Password"
                    name="password"
                  />
                  {errors.password && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-700 pl-2 mb-2"
                    htmlFor="incorporation_date"
                  >
                    Incorporation Date <span className="text-red-600">*</span>
                  </label>
                  <DatePicker
                    dateFormat="yyyy-MM-dd"
                    wrapperClassName="w-full"
                    maxDate={addDays(new Date(), -1)}
                    selected={formData.incorporation_date}
                    onChange={handleDateChange}
                    placeholderText="Select start date"
                    className={`w-full p-3 border ${
                      errors.nbfc_name ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    id="incorporation_date"
                    type="text"
                    placeholder="Incorporation Date"
                  />
                  {errors.incorporation_date && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
                      {errors.incorporation_date}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block pl-2 text-gray-700 pb-4 mb-1 "
                    htmlFor="nbfc_type"
                  >
                    Type <span className="text-red-600">*</span>
                  </label>
                  <Select
                    closeMenuOnSelect={false}
                    id="product"
                    name="nbfc_type"
                    onChange={(selectedOption) => {
                      handleChange({
                        target: {
                          name: "nbfc_type",
                          value: selectedOption ? selectedOption.value : "",
                        },
                      });
                    }}
                    options={agencyType}
                    styles={customSelectStyles}
                    className={`w-full ${
                      errors.nbfc_type ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    placeholder="Select Type"
                  />
                  {errors.nbfc_type && (
                    <div className="text-red-500 pl-4 text-sm ">
                      {errors.nbfc_type}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block pl-2 text-gray-700 mb-2"
                    htmlFor="registration_number"
                  >
                    Registration Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.nbfc_name ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    name="registration_number"
                    id="registration_number"
                    type="text"
                    placeholder="Registration Number"
                  />
                  {errors.registration_number && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
                      {errors.registration_number}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block pl-2 text-gray-700 mb-2"
                    htmlFor="gst_number"
                  >
                    Gst Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.nbfc_name ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    name="gst_number"
                    id="gst_number"
                    type="text"
                    placeholder="GST Number"
                  />
                  {errors.gst_number && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
                      {errors.gst_number}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block pl-2 text-gray-700 mb-2"
                    htmlFor="password"
                  >
                    License Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.license_number
                        ? "border-red-700"
                        : "border-gray-300"
                    } rounded-md`}
                    id="registration_number"
                    type="text"
                    placeholder="License Number"
                    name="license_number"
                  />
                  {errors.license_number && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
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
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.nbfc_name ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    type="text"
                    placeholder="Registered Address"
                    name="registered_address"
                  />
                  {errors.registered_address && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
                      {errors.registered_address}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-700 pl-2 mb-2"
                    htmlFor="corporateaddress"
                  >
                    Corporate Office Address{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.nbfc_name ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    type="text"
                    placeholder="Corporate Office Address"
                    name="office_address"
                  />
                  {errors.office_address && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
                      {errors.office_address}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block pl-2 text-gray-700 mb-2">
                    Contact Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.nbfc_name ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    type="text"
                    placeholder="Contact Number"
                    name="mobile"
                  />
                  {errors.mobile && (
                    <div className="text-red-500 pl-2 text-sm mt-1">
                      {errors.mobile}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 pl-2 mb-2">
                    Website
                  </label>
                  <input
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Website"
                    name="website"
                  />
                </div>

                <div>
                  <label className="block pl-2 text-gray-700 mb-2">
                    Fax Number
                  </label>
                  <input
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder=" Fax Number"
                    name="fax_number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto  mb-7">
          <div className="w-full">
            <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0">
              <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
                <strong>Key Personnel</strong>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                  <label className="block text-gray-700 pl-2 mb-2">CEO</label>
                  <input
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="CEO"
                    name="ceo"
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 pl-2 mb-2"
                    htmlFor="corporateaddress"
                  >
                    CFO
                  </label>
                  <input
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="CFO"
                    name="cfo"
                  />
                </div>
                <div>
                  <label className="block pl-2 text-gray-700 mb-2">
                    Compliance Officer
                  </label>
                  <input
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Compliance Officer"
                    name="compliance_officer"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 pl-2 mb-2">
                    Number of Offices
                  </label>
                  <input
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Number of Offices"
                    name="number_of_office"
                  />
                </div>

                <div>
                  <label className="block pl-2 text-gray-700 mb-2">
                    Language Covered
                  </label>
                  <input
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Language Covered"
                    name="language_covered"
                  />
                </div>
                <div>
                  <label className="block pl-2 text-gray-700 mb-2">
                    Key Services
                  </label>
                  <input
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Key Services"
                    name="key_service"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto  mb-7">
          <div className="w-full">
            <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0">
              <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
                <strong>KYC Section</strong>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                  <label
                    className="block text-gray-700 pl-2 mb-2"
                    htmlFor="registered_address"
                  >
                    Pan Card <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    name="Pan"
                    className={`w-full p-3 border ${
                      errors.Pan || errors.pan ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    type="file"
                  />
                  {errors.Pan && (
                    <span className="text-red-500 pl-2 text-sm mt-1">
                      {errors.Pan}
                    </span>
                  )}
                  {errors.pan && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.pan}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-700 pl-2 mb-2"
                    htmlFor="corporateaddress"
                  >
                    COI <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    name="COI"
                    className={`w-full p-3 border ${
                      errors.coi || errors.COI ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    type="file"
                  />

                  {errors.COI && (
                    <span className="text-red-500 pl-2 text-sm mt-1">
                      {errors.COI}
                    </span>
                  )}

                  {errors.coi && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.coi}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block pl-2 text-gray-700 mb-2">
                    GST Certificate <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    name="GSTCertificate"
                    className={`w-full p-3 border ${
                      errors.gstcertificate || errors.GSTCertificate
                        ? "border-red-700"
                        : "border-gray-300"
                    } rounded-md`}
                    type="file"
                  />
                  {errors.GSTCertificate && (
                    <span className="text-red-500 pl-2 text-sm mt-1">
                      {errors.GSTCertificate}
                    </span>
                  )}
                  {errors.gstcertificate && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.gstcertificate}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 pl-2 mb-2">
                    Empannelment Request <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    name="Empannelment"
                    className={`w-full p-3 border ${
                      errors.empannelment || errors.Empannelment ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    type="file"
                  />

                  {errors.Empannelment && (
                    <span className="text-red-500 pl-2 text-sm mt-1">
                      {errors.Empannelment}
                    </span>
                  )}

                  {errors.empannelment && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.empannelment}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block pl-2 text-gray-700 mb-2">
                    Signed Agreement <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    name="SignedAgreement"
                    className={`w-full p-3 border ${
                      errors.signedagreement || errors.SignedAgreement
                        ? "border-red-700"
                        : "border-gray-300"
                    } rounded-md`}
                    type="file"
                  />
                  {errors.SignedAgreement && (
                    <span className="text-red-500 pl-2 text-sm mt-1">
                      {errors.SignedAgreement}
                    </span>
                  )}
                  {errors.signedagreement && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.signedagreement}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block pl-2 text-gray-700 mb-2">
                    Profile <span className="text-red-600">*</span>
                  </label>
                  <input
                    onChange={handleChange}
                    name="Profile"
                    className={`w-full p-3 border ${
                      errors.profile || errors.Profile ? "border-red-700" : "border-gray-300"
                    } rounded-md`}
                    type="file"
                    placeholder="Profile"
                  />
                  {errors.Profile && (
                    <span className="text-red-500 pl-2 text-sm mt-1">
                      {errors.Profile}
                    </span>
                  )}
                  {errors.profile && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.profile}
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
                <strong>Pool Allocation</strong>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                  <label
                    className="block text-gray-700 pl-4 mb-2"
                    htmlFor="state"
                  >
                    State <span className="text-red-600">*</span>
                  </label>
                  <Select
                    closeMenuOnSelect={false}
                    id="state"
                    onChange={(selectedOption) => {
                      handleChange({
                        target: {
                          name: "PoolState",
                          value: selectedOption
                            ? selectedOption.map((option) => option.value)
                            : [],
                        },
                      });
                    }}
                    options={StateOptions}
                    isMulti
                    className="w-full p-3 pr-3"
                    styles={customStyles(errors.PoolState)}
                    placeholder="Select Type"
                  />
                  {errors.PoolState && (
                    <div className="text-red-500 pl-4 text-sm mt-1">
                      {errors.PoolState}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-700 pl-4 mb-2"
                    htmlFor="Zone"
                  >
                    Zone <span className="text-red-600">*</span>
                  </label>
                  <Select
                    closeMenuOnSelect={false}
                    id="Zone"
                    onChange={(selectedOption) => {
                      handleChange({
                        target: {
                          name: "PoolZone",
                          value: selectedOption
                            ? selectedOption.map((option) => option.value)
                            : [],
                        },
                      });
                    }}
                    options={ZoneOptions}
                    isMulti
                    className="w-full p-3 pr-3"
                    styles={customStyles(errors.PoolZone)}
                    placeholder="Select Zone"
                  />
                  {errors.PoolZone && (
                    <div className="text-red-500 pl-4 text-sm mt-1">
                      {errors.PoolZone}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block pl-4 text-gray-700 mb-2"
                    htmlFor="Product"
                  >
                    Product <span className="text-red-600">*</span>
                  </label>
                  <Select
                    closeMenuOnSelect={false}
                    id="Product"
                    onChange={(selectedOption) => {
                      handleChange({
                        target: {
                          name: "PoolProduct",
                          value: selectedOption
                            ? selectedOption.map((option) => option.value)
                            : [],
                        },
                      });
                    }}
                    options={poolProducts}
                    isMulti
                    className="w-full p-3 pr-3 "
                    styles={customStyles(errors.PoolProduct)}
                    placeholder="Select Product"
                  />
                  {errors.PoolProduct && (
                    <div className="text-red-500 pl-4 text-sm mt-1">
                      {errors.PoolProduct}
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="block text-gray-700 pl-4 mb-2"
                    htmlFor="Bucket"
                  >
                    Bucket <span className="text-red-600">*</span>
                  </label>
                  <Select
                    closeMenuOnSelect={false}
                    id="Bucket"
                    onChange={(selectedOption) => {
                      handleChange({
                        target: {
                          name: "PoolBucket",
                          value: selectedOption
                            ? selectedOption.map((option) => option.value)
                            : [],
                        },
                      });
                    }}
                    options={BucketOptions}
                    isMulti
                    className="w-full p-3"
                    styles={customStyles(errors.PoolBucket)}
                    placeholder="Select Bucket"
                  />
                  {errors.PoolBucket && (
                    <div className="text-red-500 pl-4 text-sm mt-1">
                      {errors.PoolBucket}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="focus:outline-none text-white bg-indigo-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm py-3 px-14  dark:focus:ring-green-800"
          >
            Submit
          </button>
        </div>

        {/* <div className="relative z-15 bg-white rounded-2xl shadow-md p-8 border-white-500">
          <h1 className="text-2xl font-bold mb-8 mt-2 ">
            AGENCY REGISTRATION FORM
          </h1>
          <div className="bg-white rounded-2xl  ring-4 ring-sky-100 ring-inset rounded-lg p-8 border-white-500">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              BASIC INFO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="agency_name"
                >
                  Agency Name <span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.nbfc_name ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  id="agency_name"
                  type="text"
                  name="nbfc_name"
                  placeholder="Agency Name"
                />
                {errors.nbfc_name && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.nbfc_name}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="email"
                >
                  Email <span>*</span>
                </label>
                <input
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.nbfc_name ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  name="email"
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
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="password"
                >
                  Password <span>*</span>
                </label>
                <input
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.nbfc_name ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                />
                {errors.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="incorporation_date"
                >
                  Incorporation Date <span>*</span>
                </label>

                <DatePicker
                  dateFormat="yyyy-MM-dd"
                  wrapperClassName="w-full"
                  maxDate={addDays(new Date(), -1)}
                  selected={formData.incorporation_date}
                  onChange={handleDateChange}
                  placeholderText="Select start date"
                  className={`w-full p-3 border ${
                    errors.nbfc_name ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  id="incorporation_date"
                  type="text"
                  placeholder="Incorporation Date"
                />
                {errors.incorporation_date && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.incorporation_date}
                  </div>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="nbfc_type"
                >
                  TYPE <span>*</span>
                </label>
                <Select
                  closeMenuOnSelect={false}
                  id="product"
                  name="nbfc_type"
                  onChange={(selectedOption) => {
                    handleChange({
                      target: {
                        name: "nbfc_type",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    });
                  }}
                  options={agencyType}
                  className={`w-full p-3 border ${
                    errors.nbfc_type ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  placeholder="Select Type"
                />
                {errors.nbfc_type && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.nbfc_type}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="registration_number"
                >
                  Registration Number <span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.nbfc_name ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  name="registration_number"
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
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="gst_number"
                >
                  GST Number <span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.nbfc_name ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  name="gst_number"
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
                <label className="block text-gray-700 font-bold mb-2">
                  License Number <span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.license_number ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  id="registration_number"
                  type="text"
                  placeholder="License Number"
                  name="license_number"
                />
                {errors.license_number && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.license_number}
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-7">
              Contact Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="registered_address"
                >
                  Registered Address <span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.nbfc_name ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  type="text"
                  placeholder="Registered Address"
                  name="registered_address"
                />
                {errors.registered_address && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.registered_address}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Corporate Office Address{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.nbfc_name ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  type="text"
                  placeholder="Corporate Office Address"
                  name="office_address"
                />
                {errors.office_address && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.office_address}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Contact Number <span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.nbfc_name ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  type="text"
                  placeholder="Contact Number"
                  name="mobile"
                />
                {errors.mobile && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.mobile}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Website
                </label>
                <input
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="Website"
                  name="website"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Fax Number
                </label>
                <input
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                  placeholder=" Fax Number"
                  name="fax_number"
                />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              Key Personnel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  CEO
                </label>
                <input
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="CEO"
                  name="ceo"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  CFO
                </label>
                <input
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="CFO"
                  name="cfo"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Compliance Officer
                </label>
                <input
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="Compliance Officer"
                  name="compliance_officer"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Number of Offices
                </label>
                <input
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="Number of Offices"
                  name="number_of_office"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Language Covered
                </label>
                <input
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="Language Covered"
                  name="language_covered"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Key Services
                </label>
                <input
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                  placeholder="Key Services"
                  name="key_service"
                />
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              KYC Section
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  PAN CARD <span>*</span>
                </label>
                <input
                  onChange={handleChange}
                  name="Pan"
                  className={`w-full p-3 border ${
                    errors.pan ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  type="file"
                />

                {errors.pan && (
                  <div className="text-red-500 text-sm mt-1">{errors.pan}</div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  COI <span>*</span>
                </label>
                <input
                  onChange={handleChange}
                  name="COI"
                  className={`w-full p-3 border ${
                    errors.coi ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  type="file"
                />

                {errors.coi && (
                  <div className="text-red-500 text-sm mt-1">{errors.coi}</div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  GST Certificate <span>*</span>
                </label>
                <input
                  onChange={handleChange}
                  name="GSTCertificate"
                  className={`w-full p-3 border ${
                    errors.gstcertificate ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  type="file"
                />

                {errors.gstcertificate && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.gstcertificate}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Empannelment Request <span>*</span>
                </label>
                <input
                  onChange={handleChange}
                  name="Empannelment"
                  className={`w-full p-3 border ${
                    errors.empannelment ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  type="file"
                />

                {errors.empannelment && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.empannelment}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Signed Agreement <span>*</span>
                </label>
                <input
                  onChange={handleChange}
                  name="SignedAgreement"
                  className={`w-full p-3 border ${
                    errors.signedagreement
                      ? "border-red-700"
                      : "border-gray-300"
                  } rounded-md`}
                  type="file"
                />
                {errors.signedagreement && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.signedagreement}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Profile
                </label>
                <input
                  onChange={handleChange}
                  name="Profile"
                  className={`w-full p-3 border ${
                    errors.profile ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  type="file"
                  placeholder="Profile"
                />
                {errors.profile && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.profile}
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              Pool Allocation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="state"
                >
                  State <span>*</span>
                </label>
                <Select
                  closeMenuOnSelect={false}
                  id="state"
                  onChange={(selectedOption) => {
                    handleChange({
                      target: {
                        name: "PoolState",
                        value: selectedOption
                          ? selectedOption.map((option) => option.value)
                          : [],
                      },
                    });
                  }}
                  options={StateOptions}
                  isMulti
                  className={`w-full p-3 border ${
                    errors.PoolState ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  placeholder="Select Type"
                />
                {errors.PoolState && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.PoolState}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="Zone"
                >
                  Zone <span>*</span>
                </label>
                <Select
                  closeMenuOnSelect={false}
                  id="Zone"
                  onChange={(selectedOption) => {
                    handleChange({
                      target: {
                        name: "PoolZone",
                        value: selectedOption
                          ? selectedOption.map((option) => option.value)
                          : [],
                      },
                    });
                  }}
                  options={ZoneOptions}
                  isMulti
                  className={`w-full p-3 border ${
                    errors.PoolZone ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  placeholder="Select Zone"
                />
                {errors.PoolZone && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.PoolZone}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="incorporation_date"
                >
                  Product <span>*</span>
                </label>
                <Select
                  closeMenuOnSelect={false}
                  id="Product"
                  onChange={(selectedOption) => {
                    handleChange({
                      target: {
                        name: "PoolProduct",
                        value: selectedOption
                          ? selectedOption.map((option) => option.value)
                          : [],
                      },
                    });
                  }}
                  options={poolProducts}
                  isMulti
                  className={`w-full p-3 border ${
                    errors.PoolProduct ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  placeholder="Select Product"
                />
                {errors.PoolProduct && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.PoolProduct}
                  </div>
                )}
              </div>
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="Bucket"
                >
                  Bucket <span>*</span>
                </label>
                <Select
                  closeMenuOnSelect={false}
                  id="Bucket"
                  onChange={(selectedOption) => {
                    handleChange({
                      target: {
                        name: "PoolBucket",
                        value: selectedOption
                          ? selectedOption.map((option) => option.value)
                          : [],
                      },
                    });
                  }}
                  options={BucketOptions}
                  isMulti
                  className={`w-full p-3 border ${
                    errors.PoolBucket ? "border-red-700" : "border-gray-300"
                  } rounded-md`}
                  placeholder="Select Bucket"
                />
                {errors.PoolBucket && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.PoolBucket}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-12 py-3 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Submit
            </button>
          </div>
        </div> */}
      </form>
    </>
  );
};

export default AddAgencyForm;
