import { useEffect, useState, useRef } from "react";
import axios from "../../utils/apiclient";
import "../App.css";
import "react-tabs/style/react-tabs.css";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaEdit } from "react-icons/fa";
import Invoice from "./InvoiceFormate";
import { Loader } from "../Loader";
import SweetAlert2 from "../SweetAlert2";
import Swal from "sweetalert2";

function App() {
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

  const [logs, setLogs] = useState({});
  const [agency, setAgency] = useState({});
  const [NBFC, setNBFC] = useState({});
  const [accountDetails, setAccountDetails] = useState({});
  const [loading, setLoading] = useState(true); // Initialize to true
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMounted = useRef(false);
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [penalty, setPenalty] = useState({});
  const [errors, setErrors] = useState({});

  const [isGenerated, setisGenerated] = useState(null);

  useEffect(() => {
    if (!hasMounted.current) {
      setLoading(true);
      getAgencyOptions();
      hasMounted.current = true;
    }
  }, []);

  const handleValidations = () => {
    const newErrors = {};
    if (selectedAgency.length === 0) newErrors.agency = "agency is Required";
    if (startDate === null) newErrors.startDate = "startDate is Required";
    if (endDate === null) newErrors.endDate = "endDate is Required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!handleValidations()) {
      return;
    }
    if (selectedAgency.value) {
      const requestData = {
        agency: selectedAgency.label,
        start_date: startDate?.value,
        end_date: endDate?.value,
      };
      console.log("Request Data: ", requestData);
      getDATA(requestData);
    } else {
      showAlert({ type: "error", title: "Agency Name Required" });
    }
  };
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
      overflow: "visible", // Ensure the menu is visible
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure the menu is on top
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
  });

  const handleReset = () => {
    setLogs({});
    setPenalty({});
    setSelectedAgency([]);
    setStartDate(null);
    setEndDate(null);
    setisGenerated({});
  };

  const getDATA = async (requestData = {}) => {
    setLoading(true);
    try {
      const response = await axios.post(`api/invoice/getInvoice`, requestData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log("Response Data: ", response.data);
      setLogs(response.data.data);
      setPenalty(response.data.penalty);
      setAgency(response.data.agencyDetails);
      setNBFC(response.data.nbfcDetails);
      setAccountDetails(response.data.accountDetails);
      setisGenerated(response.data.isGenerated);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching data: ", error);
      setLoading(false);
    }
  };

  console.log(agency);
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
      setAgencyOptions([
        { value: "selectAll", label: "Select All" },
        ...options,
      ]);
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
    // Check if the click target is the specific element (like arrow icon) that toggles the accordion
    const isToggleElement = event.target.closest("[data-accordion]");
    if (isToggleElement) {
      // If the click is on the toggle element, toggle the accordion
      toggleAccordionContent();
    }
    // Otherwise, do nothing (prevent toggling when clicking on select fields)
  };

  const invoiceRef = useRef();

  const generatePDF = () => {
    const input = invoiceRef.current;

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("invoice.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };
  const ConfirmPDF = async () => {
    try {
      const result = await SweetAlert2({ type: "confirm" });
      console.log(result);

      if (result.isConfirmed) {
        Swal.fire({
          title: "Loading...",
          text: "Please wait while we process your request.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: false,
          onBeforeOpen: () => {
            Swal.showLoading();
          },
        });
        let clubid = ""; // Use 'let' instead of 'const'
        if (penalty != null) {
          Object.keys(penalty).forEach((Key) => {
            clubid += penalty[Key].id + ","; // Correct the string concatenation
          });
          if (clubid.endsWith(",")) {
            clubid = clubid.slice(0, -1);
          }
        }

        // To remove the trailing comma, you can use:

        const input = invoiceRef.current;

        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            // Generate PDF as Blob
            const pdfBlob = pdf.output("blob");

            // Create a FormData object to send the PDF
            const formData = new FormData();
            formData.append("file", pdfBlob, "invoice.pdf");
            formData.append("ids", clubid);
            formData.append("month", startDate.value);
            formData.append("year", endDate.value);
            formData.append("agency_id", selectedAgency.value);
            // Send the PDF to the API using Axios
            axios
              .post("/api/invoice/confirmInvoice", formData, {
                headers: { Authorization: `Bearer ${getToken()}` },
              })
              .then((response) => {
                console.log(
                  "Successfully sent the PDF to the server: ",
                  response.data
                );

                // Download the PDF
                pdf.save("invoice.pdf");

                Swal.fire({
                  title: "Success!",
                  text: "The PDF has been successfully sent and downloaded.",
                  icon: "success",
                  confirmButtonText: "OK",
                });
                setLoading(false);
                handleReset();
              })
              .catch((error) => {
                console.error("Error generating or sending PDF: ", error);
              });
          })
          .catch((error) => {
            console.error("Error generating PDF: ", error);
          });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const downloadFile = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(new Blob([blob]));
      const filename = url.split("/").pop();
      const aTag = document.createElement("a");
      aTag.href = blobUrl;
      aTag.setAttribute("download", filename);
      document.body.appendChild(aTag);
      aTag.click();
      aTag.remove();
      window.URL.revokeObjectURL(blobUrl); // Clean up the object URL
    } catch (error) {
      console.error("Error downloading file:", error);
      showAlert("Failed to download the file.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <div
        className="w-full bg-white border border-gray-200 rounded-lg shadow sm:p-3 pb-4 pl-5 pr-5 dark:bg-gray-800 dark:border-gray-700"
        style={{ background: "#e5e5e526" }}
        onClick={handleParentClick}
      >
        <div data-accordion className="accordion ">
          {isExpanded ? "" : <h1 className="pt-5 text-xl">Invoice For NBFC</h1>}

          <span className="flex justify-end items-center mb-0 relative bottom-2 cursor-pointer lg:bottom-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ">
              <div onClick={(e) => e.stopPropagation()}>
                <label
                  className="block text-gray-700 pl-4 mb-2"
                  htmlFor="Bucket"
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
                  className="w-full p-3 pr-3"
                  styles={customStyles(errors.agency)}
                  menuPortalTarget={document.body}
                  onClick={(e) => e.stopPropagation()}
                />
                {errors.agency && (
                  <div className="text-red-500 text-sm mt-0 pl-3">
                    {errors.agency}
                  </div>
                )}
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <label
                  className="block text-gray-700 pl-4 mb-2"
                  htmlFor="Bucket"
                >
                  Start Date <span className="text-red-600">*</span>
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
                  className="w-full p-3 pr-3"
                  styles={customStyles(errors.startDate)}
                  menuPortalTarget={document.body}
                  onClick={(e) => e.stopPropagation()}
                />
                {errors.startDate && (
                  <div className="text-red-500 text-sm mt-0 pl-3">
                    {errors.startDate}
                  </div>
                )}
              </div>

              <div onClick={(e) => e.stopPropagation()}>
                <label
                  className="block text-gray-700 pl-4 mb-2"
                  htmlFor="Bucket"
                >
                  End Date <span className="text-red-600">*</span>
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
                  placeholder="Select end year"
                  className="w-full p-3 pr-3"
                  styles={customStyles(errors.endDate)}
                  menuPortalTarget={document.body}
                />
                {errors.endDate && (
                  <div className="text-red-500 text-sm mt-0 pl-3">
                    {errors.endDate}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-3">
              {isGenerated != null &&
                (isGenerated.url != null || isGenerated.approved === 1) && (
                  <button
                    onClick={() => downloadFile(isGenerated.url)}
                    className="w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                  >
                    Download Invoice
                  </button>
                )}

              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto text-white bg-indigo-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2"
              >
                Search
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-2"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      {Object.keys(logs).length > 0 &&
        (isGenerated == null || isGenerated.approved === 2) && (
          <>
            <div className="relative">
              <Invoice
                ectraCh={penalty}
                month={startDate?.label}
                year={endDate?.label}
                data={logs}
                agency={agency}
                NBFC={NBFC}
                accountDetails={accountDetails}
                ref={invoiceRef}
              />
            </div>
            <div className="fixed bottom-5 right-5 z-10 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              {(isGenerated == null || isGenerated.approved === 2) && (
                <button
                  className="focus:outline-none text-white bg-indigo-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  type="button"
                  onClick={ConfirmPDF}
                >
                  Confirm & DownLoad
                </button>
              )}

              <button
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                type="button"
                onClick={generatePDF}
              >
                DownLoad
              </button>
            </div>
          </>
        )}
    </>
  );
}

export default App;
