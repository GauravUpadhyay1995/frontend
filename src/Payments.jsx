import { useEffect, useState } from "react";
import axios from "axios";
import CustomTable from "./Table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import { downloadExcel } from "./DownLoadExcell";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { format } from "date-fns";
import UserType from "./UserType";
import SweetAlert2 from "./SweetAlert2";
import Select from "react-select";

function Payments() {
  const showAlert = (data) => {
    SweetAlert2(data);
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i).map(
    (year) => ({ value: year, label: year.toString() })
  );

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = UserType();
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      setLoading(false);
      getAgencyOptions();
    }
  }, [userData]);

  const handleValidations = () => {
    const newErrors = {};

    if (selectedAgency === null)
      newErrors.agency = "Agency Options is Required";
    if (startDate.length === 0) newErrors.startDate = "Start Date is Required";
    if (endDate === null) newErrors.endDate = "End Date is Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getAgencyOptions = async () => {
    try {
      const response = await axios.post(
        "api/users/getAgencyList",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const options = response.data.map((option) => ({
        value: option.id,
        label: option.nbfc_name,
      }));
      setAgencyOptions(options);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getToken = () => localStorage.getItem("token");

  const getDATA = async (data) => {
    if (!userData) return;
    setLoading(true);
    const userApi = "/api/invoice/getPayment";
    try {
      const response = await axios.post(userApi, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("API Response:", response.data); 
      setLogs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const customSelectStyles = (hasError) => ({
    control: (provided, state) => ({
      ...provided,

      boxShadow: state.isFocused ? null : null,

      padding: "0.2rem", // Adjusted padding
      marginTop: "-9px", // Proper syntax for margin-top
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

  const handleAction = async (data, status) => {
    const result = await SweetAlert2({
      type: "confirm",
      title: "Are You Sure ???",
      text: "It will not rollback",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          "api/invoice/changeInvoiceStatus",
          { id: data.id, status, ids: data.escalation_ids },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        setLoading(false);
        if (response.data.success === true) {
          showAlert({ type: "success", title: response.data.message });
        }
        const requestData = {
          agency: selectedAgency.value,
          month: startDate.map((date) => date.value),
          year: endDate?.value,
        };
        getDATA(requestData);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const handleDelete = async (data) => {
    const result = await SweetAlert2({
      type: "confirm",
      title: "Are You Sure Want To Delete ???",
      text: "It will not rollback",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          "/api/invoice/deleteInvoice",
          { id: data.id, escalation_ids: data.escalation_ids },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        setLoading(false);
        if (response.data.success === true) {
          showAlert({ type: "success", title: response.data.message });
        }
        const requestData = {
          agency: selectedAgency.value,
          month: startDate.map((date) => date.value),
          year: endDate?.value,
        };
        getDATA(requestData);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

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

  const handleSubmit = () => {
    if (!handleValidations()) {
      return;
    }
    if (selectedAgency) {
      const requestData = {
        agency: selectedAgency.value,
        month: startDate.map((date) => date.value),
        year: endDate?.value,
      };
      getDATA(requestData);
    } else {
      showAlert({ type: "error", title: "Agency Name Required" });
    }
  };

  const handleReset = () => {
    setLogs([]);
    setSelectedAgency(null);
    setStartDate([]);
    setEndDate(null);
  };

  const columns = [
    {
      name: "Agency Name",
      selector: (row) => row.agency_name,
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => row.created_date,
      sortable: true,
    },
    {
      name: "Approved By",
      selector: (row) => row.approved_by,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex justify-center items-center space-x-2 pt-1">
          {(row.approved === 0 || row.approved === 1) && row.paid === 0 && (
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => handleAction(row, 2)}
            >
              Reject
            </button>
          )}
          {row.paid === 0 && row.approved === 1 && (
            <button
              className="px-2 py-1 bg-green-500 text-white rounded"
              onClick={() => handleAction(row, 2)}
            >
              Paid
            </button>
          )}
          {row.paid === 1 && row.approved !== 2 && (
            <button
              className="px-2 py-1 bg-yellow-500 text-white rounded"
              onClick={() => handleAction(row, 2)}
            >
              Unpaid
            </button>
          )}
          {row.approved === 2 && (
            <button className="px-2 py-1 bg-gray-500 text-white rounded">
              Rejected
            </button>
          )}
          {row.approved === 0 && row.paid === 0 && (
            <>
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => handleAction(row, 1)}
              >
                Approve
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(row)}
              >
                {row.isActive === 1 ? "Delete" : "Pending"}
              </button>
            </>
          )}
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="container mx-auto mb-7">
      <div className="w-full">
        <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0">
          <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
            <strong>Payments</strong>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 pl-2 mb-4">
                Agency <span className="text-red-600">*</span>
              </label>
              <Select
                closeMenuOnSelect={false}
                id="agency"
                value={selectedAgency}
                onChange={(selected) => {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    agency: null,
                  }));
                  handleSelectChange(
                    selected,
                    setSelectedAgency,
                    agencyOptions
                  );
                }}
                options={agencyOptions}
                placeholder="Select Agency"
                styles={customSelectStyles(errors.agency)}
              />
              {errors.agency && (
                <div className="text-red-500 text-sm mt-1 pl-2">
                  {errors.agency}
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-700 pl-2 mb-4">
                Month <span className="text-red-600">*</span>
              </label>
              <Select
                closeMenuOnSelect={false}
                id="start_date"
                isMulti
                value={startDate}
                styles={customSelectStyles(errors.startDate)}
                onChange={(selected) => {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    startDate: null,
                  }));
                  handleSelectChange(selected, setStartDate, months);
                }}
                options={months}
                placeholder="Select Month"
              />
              {errors.startDate && (
                <div className="text-red-500 text-sm pl-2 mt-1">
                  {errors.startDate}
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-700 pl-2 mb-4">
                Year <span className="text-red-600">*</span>
              </label>
              <Select
                closeMenuOnSelect={false}
                id="end_date"
                value={endDate}
                styles={customSelectStyles(errors.endDate)}
                onChange={(selected) => {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    endDate: null,
                  }));
                  setEndDate(selected);
                }}
                options={years}
                placeholder="Select Year"
              />
              {errors.endDate && (
                <div className="text-red-500 text-sm pl-2 mt-1">
                  {errors.endDate}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2 mb-8">
            <button
              className="px-6 py-2  bg-indigo-500 text-white rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Search
            </button>
            <button
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
          <div className="w-full overflow-auto">
            <CustomTable columns={columns} data={logs} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
