import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SweetAlert2 from "../SweetAlert2"; // Ensure SweetAlert2 is correctly imported
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEscalation = () => {
  const showAlert = (data) => {
    SweetAlert2(data);
  };

  const hasMounted = useRef(false);

  const [loading, setLoading] = useState(false); // Initialize to false
  const [agency, setAgency] = useState([]);
  const [selectedAgencyOptions, setSelectedAgencyOptions] = useState([]);
  const [startDate, setStartDateLocal] = useState(null);
  const [endDate, setEndDateLocal] = useState(null);
  const [loanId, setLoanId] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState({});
  const [attachment, setAttachment] = useState(null);
  const [comments, setComments] = useState(null);

  useEffect(() => {
    if (!hasMounted.current) {
      getAgencyOptions();
      hasMounted.current = true;
    }
  }, []);

  const handleValidations = () => {
    const newErrors = {};
    if (selectedAgencyOptions.length === 0)
      newErrors.selectedAgencyOptions = "Agency is Required";
    setValidationError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const getToken = () => localStorage.getItem("token");

  const getAgencyOptions = async () => {
    const userApi = "api/users/getAgency";
    try {
      const response = await axios.post(
        userApi,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const options = response.data.data.map((option) => ({
        value: option.id,
        label: option.nbfc_name,
      }));
      setAgency(options);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    if (!handleValidations()) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("fromDate", startDate);
    formData.append("toDate", endDate);
    formData.append("loan_id", loanId);
    formData.append("attachment", attachment);
    formData.append("agency_id", Number(selectedAgencyOptions.value));
    formData.append("comments", comments);

    const userApi = "api/escalation/raiseEscalation";
    try {
      const response = await axios.post(userApi, formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.data.success) {
        showAlert({ type: "success", title: response.data.message });
      } else {
        showAlert({ type: "error", title: response.data.message });
      }
      setLoading(false); // Start loading
    } catch (error) {
      console.error(error);
      setLoading(false); // Start loading
    }
  };

   const customSelectStyles = (hasError) => ({
     control: (provided, state) => ({
       ...provided,
       boxShadow: state.isFocused ? null : null,
       padding: "0.4rem", // Adjusted padding
       marginTop: "-11px", // Proper syntax for margin-top
       borderColor: hasError ? "red" : provided.borderColor,
       "&:hover": {
         borderColor: hasError ? "red" : provided.borderColor, // Prevent border color change on hover
       },
     }),
     menu: (provided) => ({
       ...provided,
       zIndex: 9999,
     }),
     placeholder: (provided) => ({
       ...provided,
       color: "#9CA3AF",
     }),
   });

  const handleSelectChange = (selected, setSelected, options) => {
    if (
      selected &&
      selected.length &&
      selected[selected.length - 1].value === "selectAll"
    ) {
      setSelected(options.filter((option) => option.value !== "selectAll"));
    } else {
      setSelected(selected);
    }
  };

  const handleFileChange = (event) => {
    setAttachment(event.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen">
      <div className="container mx-auto mb-7 py-8 px-5 ">
        <div className="w-full">
          <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0">
            <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
              <strong>Add Escalation</strong>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 pl-2 mb-2">
                  Start Date
                </label>
                <DatePicker
                  id="start-date"
                  selected={startDate}
                  selectsStart
                  wrapperClassName="w-full"
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(date) => setStartDateLocal(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 pl-2 mb-2"
                  htmlFor="corporateaddress"
                >
                  End Date
                </label>
                <DatePicker
                  selectsStart
                  wrapperClassName="w-full"
                  id="endDate"
                  selected={endDate}
                  onChange={(date) => setEndDateLocal(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="YYYY-MM-DD"
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  type="text"
                />
              </div>
              <div>
                <label className="block pl-4 text-gray-700 mb-2">
                  Agency <span className="text-red-600">*</span>
                </label>
                <Select
                  closeMenuOnSelect={false}
                  id="Agency"
                  onChange={(selected) => {
                    setValidationError((prevErrors) => ({
                      ...prevErrors,
                      selectedAgencyOptions: null,
                    }));
                    handleSelectChange(
                      selected,
                      setSelectedAgencyOptions,
                      agency
                    );
                  }}
                  options={agency}
                  className="w-full p-3 pr-3"
                  styles={customSelectStyles(
                    validationError.selectedAgencyOptions
                  )}
                  placeholder="Select Agency"
                />
                {validationError.selectedAgencyOptions && (
                  <div className="text-red-500 text-sm mt-1 pl-4">
                    {validationError.selectedAgencyOptions}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 pl-2 mb-2">Loan Id</label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-md"
                  onChange={(e) => setLoanId(e.target.value)}
                  id="loanId"
                  type="text"
                  name="loanId"
                  placeholder="Enter Loan ID"
                />
              </div>

              <div>
                <label className="block pl-2 text-gray-700 mb-2">
                  Attachment
                </label>
                <input
                  className="w-full p-3 border border-gray-300 rounded-md"
                  onChange={handleFileChange}
                  id="Attachment"
                  type="file"
                  name="Attachment"
                />
              </div>
            </div>
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block pl-1 text-gray-700 mb-2">Comments</label>
              <textarea
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                id="Attachment"
                type="file"
                name="Attachment"
              />
            </div>

            <div className="flex items-center justify-end mt-3 ">
              <button
                type="submit"
                className={`focus:outline-none text-white bg-indigo-500 font-medium rounded-lg text-sm px-12 py-3 me-2 mb-2  ${
                  loading ? "bg-gray-400" : "bg-blue-500"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddEscalation;
