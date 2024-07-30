import { useEffect, useState, useRef } from "react";
import axios from "./utils/apiclient";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import Select from "react-select";
import { Loader } from "../Loader";
import SweetAlert2 from "../SweetAlert2";
import AssignedDataTable from "./AssignedDataTable";
import { jwtDecode } from "jwt-decode";

const AssignedData = () => {
  const confirmAlert = (data) => {
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

  const getToken = () => localStorage.getItem("token");

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMounted = useRef(false);
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [penalty, setPenalty] = useState({});
  const [errors, setErrors] = useState({});
  const [userType, setuserType] = useState("");

  useEffect(() => {
    if (!hasMounted.current) {
      setLoading(true);
      getAgencyOptions();
      hasMounted.current = true;
    }

    const token = localStorage.getItem("token");
    const user = jwtDecode(token);
    setuserType(user.type);
  }, []);
  console.log(userType);
  const handleValidations = () => {
    const newErrors = {};
    if (userType !== "agency" && selectedAgency.length === 0)
      newErrors.agency = "Agency is Required";
    if (startDate === null) newErrors.startDate = "startDate is Required";
    if (endDate === null) newErrors.endDate = "endDate is Required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!handleValidations()) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/allocation/unPaidDataList",
        {
          agency_id: selectedAgency.value,
          month: startDate.value,
          year: endDate.value,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      console.log(response.data.data);
      setLogs(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Agency Name",
      selector: (row) => row.agency_name,
      sortable: true,
      cell: (row) => (
        <div className="wrap-text cursor-pointer">{row.agency_name}</div>
      ),
    },
    {
      name: "Zone",
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.zone}</div>,
    },
    {
      name: "City",
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.city}</div>,
    },
    {
      name: "State",
      selector: "created_date", // Assuming 'created_date' is a field in your row object
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.state}</div>,
    },
    {
      name: "Pin",
      selector: "updated_date", // Assuming 'created_date' is a field in your row object
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.pincode}</div>,
    },
    {
      name: "Product",
      selector: "updated_date", // Assuming 'created_date' is a field in your row object
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.product_type}</div>,
    },
    {
      name: "Bucket",
      selector: (row) => row.duplicacy_count,
      sortable: true,
      cell: (row) => (
        <div
          onClick={() => showDetails(row.dpd_in_days)}
          className="  cursor-pointer wrap-text bg-green-500 rounded-full text-white text-center flex items-center justify-center"
          style={{
            minWidth: "2rem",
            minHeight: "2rem",
          }}
        >
          {row.dpd_in_days}
        </div>
      ),
    },
  ];
  const customStyles = (hasError) => ({
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.isFocused ? null : null,
      padding: "0.2rem",
      marginTop: "0px",
      borderColor: hasError ? "red" : provided.borderColor,
      "&:hover": {
        borderColor: hasError ? "red" : provided.borderColor,
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      overflow: "visible",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
  });

  // const getAllocation = async () => {
  //   try {
  //     const response = await axios.post(
  //       "/api/allocation/unPaidDataList",
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${getToken()}`,
  //         },
  //       }
  //     );
  //     console.log(response.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleReset = () => {
    setPenalty({});
    setLogs([]);
    setSelectedAgency([]);
    setStartDate(null);
    setEndDate(null);
  };

  const getAgencyOptions = async () => {
    try {
      const response = await axios.post(
        "api/users/getAgencyList",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      console.log(response.data);
      const options = response.data.map((option) => ({
        value: option.id,
        label: option.nbfc_name,
      }));
      setAgencyOptions([...options]);
      setLoading(false);
    } catch (error) {
      console.log(error);
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

  const toggleAccordionContent = () => {
    const accordionContent = document.querySelector("#accordion-content");
    accordionContent.classList.toggle("hidden");
    setIsExpanded(!isExpanded);
  };

  const handleParentClick = (event) => {
    const isToggleElement = event.target.closest("[data-accordion]");
    if (isToggleElement) {
      toggleAccordionContent();
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      

      <div className="w-full -mt-6 py-8 px-6">
      <div
        className="w-full bg-white border border-gray-200 rounded-lg shadow sm:p-3 dark:bg-gray-800 dark:border-gray-700 "
        style={{ background: "#e5e5e526" }}
        onClick={handleParentClick}
      >
        <div data-accordion className="accordion">
          {isExpanded ? "" : <h1 className="pt-5 text-xl">Assigned Data</h1>}

          <span className="flex justify-end items-center mb-0 relative bottom-6 cursor-pointer sm:relative bottom-3 right-3">
            {isExpanded ? (
              <SlArrowUp className="relative top-6" />
            ) : (
              <SlArrowDown />
            )}
          </span>

          <div
            id="accordion-content"
            className={`${isExpanded ? "" : "hidden"}`}
            data-accordion-content
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 p-8 lg:grid-cols-4 gap-4 -mt-8">
              {userType !== "agency" && (
                <div onClick={(e) => e.stopPropagation()}>
                  <label
                    className="block text-gray-700 pl-2 mb-5"
                    htmlFor="agency"
                  >
                    Agency Name <span className="text-red-600">*</span>
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
                    placeholder="Agency"
                    className="lg:w-full"
                    styles={customStyles(errors.agency)}
                    menuPortalTarget={document.body}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {errors.agency && (
                    <div className="text-red-500 text-sm mt-1 pl-3">
                      {errors.agency}
                    </div>
                  )}
                </div>
              )}

              <div onClick={(e) => e.stopPropagation()}>
                <label
                  className="block text-gray-700 pl-4 mb-2"
                  htmlFor="start-month"
                >
                  Month <span className="text-red-600">*</span>
                </label>
                <Select
                  id="start-month"
                  value={startDate}
                  onChange={(selected) => {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      startDate: null,
                    }));
                    setStartDate(selected);
                  }}
                  options={months}
                  placeholder="Select start month"
                  styles={customStyles(errors.startDate)}
                  className="lg:w-full mt-5"
                  menuPortalTarget={document.body}
                  onClick={(e) => e.stopPropagation()}
                />
                {errors.startDate && (
                  <div className="text-red-500 text-sm mt-1 pl-3">
                    {errors.startDate}
                  </div>
                )}
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <label
                  className="block text-gray-700 pl-4 mb-2"
                  htmlFor="end-year"
                >
                  Year <span className="text-red-600">*</span>
                </label>
                <Select
                  id="end-year"
                  value={endDate}
                  onChange={(selected) => {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      endDate: null,
                    }));
                    setEndDate(selected);
                  }}
                  options={years}
                  className="lg:w-full mt-5"
                  placeholder="Select end year"
                  styles={customStyles(errors.endDate)}
                  menuPortalTarget={document.body}
                />
                {errors.endDate && (
                  <div className="text-red-500 text-sm mt-1 pl-3">
                    {errors.endDate}
                  </div>
                )}
              </div>

              <div
                className="flex flex-col sm:flex-row sm:justify-start gap-4 mb-3 mt-[2.8rem] "
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleSubmit}
                  className="text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-6 py-2"
                  style={{ height: "40px" }}
                >
                  Search
                </button>
                <button
                  onClick={handleReset}
                  className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-6 py-2"
                  style={{ height: "40px" }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className="container mx-auto my-8 p-4 bg-white border rounded-lg shadow-lg">
          <AssignedDataTable
            data={logs}
            columns={columns}
            loading={loading}
            tableName={"Assigned Data Table"}
          />
        </div>
      </div>
    </>
  );
};

export default AssignedData;
