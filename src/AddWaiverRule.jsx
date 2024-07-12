import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Loader } from "./Loader";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import SweetAlert2 from "./SweetAlert2";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { format, addDays } from "date-fns";
import {
  StateOptions,
  ZoneOptions,
  BucketOptions as initialBucketOptions,
} from "./StateOptions";
const App = () => {
  const showAlert = (data) => {
    SweetAlert2(data);
  };

  const getToken = () => localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState([]);
  const [bucketOptions, setBucketOptions] = useState(initialBucketOptions);
  const [errors,setErrors] = useState({})

  const [productOptions, setProductOptions] = useState([]);
  const [penal, setPenal] = useState("");
  const [principal, setPrincipal] = useState("");
  const [interest, setInterest] = useState(""); // Fixed typo: intrest -> interest
  const [expiryDate, setExpiryDate] = useState("");
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      getProducts();
      setBucketOptions([
        { value: "selectAll", label: "Select All" },
        ...initialBucketOptions,
      ]);
      setLoading(false);
      hasMounted.current = true;
    }
  }, []);

  const handleValidations = () =>{
    const newErrors = {}
       if(!expiryDate) newErrors.expiryDate = "Expiry Date is Required"
       if (selectedProduct.length === 0)
         newErrors.selectedProduct = "Product Options is Required";
       if (selectedBucket.length === 0)
         newErrors.selectedBucket = "Bucket Options is Required";
       setErrors(newErrors)
       return Object.keys(newErrors).length === 0
    
  }
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,

      boxShadow: state.isFocused ? null : null,

      padding: "0.2rem", // Adjusted padding
      marginTop: "-9px", // Proper syntax for margin-top
      borderColor: errors.selectedProduct ? "red" : provided.borderColor,
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

  const getProducts = async () => {
    try {
      const response = await axios.post(
        "/api/users/getProducts",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const options = response.data.data.map((option) => ({
        value: option.id,
        label: option.product,
      }));
      setProductOptions([
        { value: "selectAll", label: "Select All" },
        ...options,
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidations()) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const formattedDate = expiryDate
      ? format(expiryDate, "yyyy-MM-dd HH:mm:ss")
      : "";
    const requestData = {
      product: selectedProduct.map((option) => option.value),
      bucket: selectedBucket.map((option) => option.value),
      penal: penal,
      principal: principal,
      interest: interest,
      expiryDate: formattedDate,
    };
    console.log(requestData);

    try {
      const response = await axios.post(
        "/api/users/addWaiverRule",
        requestData,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      showAlert({
        type: response.data.success ? "success" : "error",
        title: response.data.message,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="container mx-auto mb-7">
            <div className="w-full">
              <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0">
                <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
                  <strong>Waiver Rule</strong>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label
                      className="block text-gray-700 pl-2 mb-2"
                      htmlFor="registered_address"
                    >
                      Expiry Date <span className="text-red-600">*</span>
                    </label>
                    <DatePicker
                      selected={expiryDate}
                      wrapperClassName="w-full"
                      onChange={(date) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          expiryDate: null,
                        }));
                        setExpiryDate(date);
                      }}
                      minDate={new Date()} // Set minimum date to today
                      showTimeSelect // Enable time selection
                      dateFormat="yyyy-MM-dd HH:mm:ss" // Date and time format
                      placeholderText="Select date and time"
                      className={`w-full p-3 border border-gray-300 rounded-md ${
                        errors.expiryDate ? "border-red-700" : "border-gray-300"
                      }`}
                      id="expiry_date"
                      type="text"
                    />
                    {errors.expiryDate && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.expiryDate}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 pl-4 mb-2"
                      htmlFor="corporateaddress"
                    >
                      Products <span className="text-red-600">*</span>
                    </label>
                    <Select
                      closeMenuOnSelect={false}
                      id="product"
                      onChange={(selected) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          selectedProduct: null,
                        }));
                        handleSelectChange(
                          selected,
                          setSelectedProduct,
                          productOptions
                        );
                      }}
                      options={productOptions}
                      isMulti
                      styles={customSelectStyles}
                      placeholder="Select Product"
                      value={selectedProduct}
                      className="w-full p-3 pr-3"
                    />
                    {errors.selectedProduct && (
                      <div className="text-red-500 text-sm mt-0 pl-3">
                        {errors.selectedProduct}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block pl-4 text-gray-700 mb-2">
                      Bucket <span className="text-red-600">*</span>
                    </label>
                    <Select
                      closeMenuOnSelect={false}
                      id="bucket"
                      onChange={(selected) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          selectedBucket: null,
                        }));
                        handleSelectChange(
                          selected,
                          setSelectedBucket,
                          bucketOptions
                        );
                      }}
                      options={bucketOptions}
                      isMulti
                      placeholder="Select Bucket"
                      value={selectedBucket}
                      styles={customSelectStyles}
                      className={`w-full p-3 pr-3 ${
                        errors.selectedBucket
                          ? "border-red-700"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.selectedBucket && (
                      <div className="text-red-500 text-sm mt-0 pl-3">
                        {errors.selectedBucket}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 pl-2 mb-2">
                      Principal
                    </label>
                    <input
                      className="w-full p-3 border border-gray-300 rounded-md"
                      min={0}
                      max={100}
                      onChange={(e) => setPrincipal(e.target.value)}
                      type="number"
                      placeholder="Principal"
                    />
                  </div>

                  <div>
                    <label className="block pl-4 text-gray-700 mb-2">
                      Penal
                    </label>
                    <input
                      className="w-full p-3 ml-2 border border-gray-300 rounded-md"
                      min={0}
                      max={100}
                      onChange={(e) => setPenal(e.target.value)}
                      type="number"
                      placeholder="Penal"
                    />
                  </div>
                  <div>
                    <label className="block pl-4 text-gray-700 mb-2">
                      Interest
                    </label>
                    <input
                      className="w-full p-3 ml-2 border border-gray-300 rounded-md"
                      min={0}
                      max={100}
                      onChange={(e) => setInterest(e.target.value)}
                      type="number"
                      placeholder="Interest"
                    />
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

          {/* <div className="justify-center items-center h-screen">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h3 style={{ color: "green", margin: "20px" }}>Waiver Rule</h3>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Expiry Date <span>*</span>
                  </label>
                  <DatePicker
                    selected={expiryDate}
                    onChange={(date) => setExpiryDate(date)}
                    minDate={new Date()} // Set minimum date to today
                    showTimeSelect // Enable time selection
                    dateFormat="yyyy-MM-dd HH:mm:ss" // Date and time format
                    placeholderText="Select date and time"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="expiry_date"
                    type="text"
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Products <span>*</span>
                  </label>
                  <Select
                    closeMenuOnSelect={false}
                    id="product"
                    onChange={(selected) =>
                      handleSelectChange(
                        selected,
                        setSelectedProduct,
                        productOptions
                      )
                    }
                    options={productOptions}
                    isMulti
                    className=""
                    placeholder="Select Product"
                    value={selectedProduct}
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Bucket <span>*</span>
                  </label>
                  <Select
                    closeMenuOnSelect={false}
                    id="bucket"
                    onChange={(selected) =>
                      handleSelectChange(
                        selected,
                        setSelectedBucket,
                        bucketOptions
                      )
                    }
                    options={bucketOptions}
                    isMulti
                    className=""
                    placeholder="Select Bucket"
                    value={selectedBucket}
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Principal <span>*</span>
                  </label>
                  <input
                    min={0}
                    max={100}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="number"
                    placeholder="Principal"
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Penal <span>*</span>
                  </label>
                  <input
                    min={0}
                    max={100}
                    onChange={(e) => setPenal(e.target.value)}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="number"
                    placeholder="Penal"
                  />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Penal <span>*</span>
                  </label>
                  <input
                    min={0}
                    max={100}
                    onChange={(e) => setInterest(e.target.value)}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="number"
                    placeholder="Interest"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Save
              </button>
            </div>
          </div> */}
        </form>
      )}
    </>
  );
};

export default App;
