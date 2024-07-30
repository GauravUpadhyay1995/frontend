import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SweetAlert2 from "../SweetAlert2"; // Ensure SweetAlert2 is correctly imported
import Select from "react-select";
import { BucketOptions as initialBucketOptions } from "../StateOptions";

const DynamicInputFields = () => {
  const showAlert = (data) => {
    SweetAlert2(data);
  };
  useEffect(() => {
    if (!hasMounted.current) {
      getProductOptions();
      setBucketOptions([...initialBucketOptions]);

      hasMounted.current = true;
    }
  }, []);
  const hasMounted = useRef(false);

  const [loading, setLoading] = useState(false); // Initialize to false
  const [ProductsOptions, setProductsOptions] = useState([]);
  const [SelectedProductsOptions, setSelectedProductsOptions] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState([]);
  const [bucketOptions, setBucketOptions] = useState(initialBucketOptions);
  const [minP, setMinP] = useState([{ minimumP: "" }]);
  const [offerP, setOfferP] = useState([{ offerP: "" }]);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState({});
  const [fixedPercentage, setfixedPercentage] = useState("");

  const handleAddField = () => {
    setMinP([...minP, { minimumP: "" }]);
    setOfferP([...offerP, { offerP: "" }]);
  };

  const getToken = () => localStorage.getItem("token");

  const handleRemoveField = (index) => {
    if (minP.length > 1) {
      const newFields = minP.filter((_, i) => i !== index);
      setMinP(newFields);
      setOfferP(newFields);
    }
  };

  const customSelectStyles = (hasError) => ({
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.isFocused ? null : null,
      padding: "0.2rem", // Adjusted padding
      marginTop: "0px", // Proper syntax for margin-top
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

  const handleValidations = () => {
    const newErrors = {};
    if (SelectedProductsOptions.length === 0)
      newErrors.SelectedProductsOptions = "Product is required";
    if (selectedBucket.length === 0)
      newErrors.selectedBucket = "Bucket is required";

    if (fixedPercentage.trim() === "")
      newErrors.fixedPercentage = "Fixed Percentage is required";

    minP.forEach((mp, index) => {
      if (mp.minimumP.trim() === "")
        newErrors[`minP${index}`] = `MinP ${index} is required`;
    });

    offerP.forEach((op, index) => {
      if (op.offerP.trim() === "")
        newErrors[`offerP${index}`] = `OfferP ${index} is required`;
    });

    setValidationError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleMinPChange = (index, event) => {
    setError("");
    const newFields = minP.map((field, i) => {
      if (i === index) {
        return { ...field, minimumP: event.target.value };
      }
      return field;
    });
    setMinP(newFields);
  };

  const handleOfferPChange = (index, event) => {
    setError("");
    const newFields = offerP.map((field, i) => {
      if (i === index) {
        return { ...field, offerP: event.target.value };
      }
      return field;
    });
    setOfferP(newFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!handleValidations()) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const minPercentageValues = minP.map((field) => field.minimumP);
      const offerPercentageValues = offerP.map((field) => field.offerP);
      const requestData = {
        product_id: SelectedProductsOptions.value,
        bucket_id: selectedBucket.value,
        fixed_percentage: fixedPercentage,
        min_percentage: minPercentageValues,
        offer_percentage: offerPercentageValues,
      };
      const response = await axios.post(
        "api/commercial/addCommercialRule",
        requestData,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      if (response.data.success === true) {
        showAlert({ type: "success", title: response.data.message });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        showAlert({ type: "error", title: error.response.data.message });
      } else {
        setError("An unexpected error occurred.");
        showAlert({ type: "error", title: "An unexpected error occurred." });
        console.log(error);
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  let i = 0;
  const getProductOptions = async () => {
    try {
      const response = await axios.post(
        "api/users/getProducts",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const options = response.data.data.map((option) => ({
        value: option.id,
        label: option.product,
      }));

      setProductsOptions(options);
    } catch (error) {
      console.log(error);
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
    <form onSubmit={handleSubmit} className="min-h-screen">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="container mx-auto mb-7 py-8 px-4">
        <div className="w-full">
          <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0">
            <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
              <strong>Commercial Rule</strong>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <label
                  className="block text-gray-700 pl-4 mb-1"
                  htmlFor="corporateaddress"
                >
                  Product <span className="text-red-600">*</span>
                </label>
                <Select
                  closeMenuOnSelect={false}
                  id="Product"
                  onChange={(selected) => {
                    setValidationError((prevErrors) => ({
                      ...prevErrors,
                      SelectedProductsOptions: null,
                    }));
                    handleSelectChange(
                      selected,
                      setSelectedProductsOptions,
                      ProductsOptions
                    );
                  }}
                  options={ProductsOptions}
                  placeholder="Select Product"
                  styles={customSelectStyles(
                    validationError.SelectedProductsOptions
                  )}
                  className="w-full p-3 pr-3 "
                />
                {validationError.SelectedProductsOptions && (
                  <div className="text-red-500 text-sm mt-1 pl-4">
                    {validationError.SelectedProductsOptions}
                  </div>
                )}
              </div>
              <div>
                <label className="block pl-4 text-gray-700 mb-1">
                  Bucket <span className="text-red-600">*</span>
                </label>
                <Select
                  closeMenuOnSelect={false}
                  id="bucket"
                  onChange={(selected) => {
                    setValidationError((prevErrors) => ({
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
                  placeholder="Select Bucket"
                  value={selectedBucket}
                  styles={customSelectStyles(validationError.selectedBucket)}
                  className="w-full p-3 pr-3"
                />
                {validationError.selectedBucket && (
                  <div className="text-red-500 text-sm mt-1 pl-5">
                    {validationError.selectedBucket}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 pl-2 mb-3 mt-0">
                  Fixed Percentage <span className="text-red-600">*</span>
                </label>
                <input
                  className={`w-full p-2 mt-1 border border-gray-200 rounded-md ${
                    validationError.fixedPercentage
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  onChange={(e) => {
                    setValidationError((prevErrors) => ({
                      ...prevErrors,
                      fixedPercentage: null,
                    }));
                    setfixedPercentage(e.target.value);
                  }}
                  placeholder="Enter Percentage "
                />
                {validationError.fixedPercentage && (
                  <div className="text-red-500 text-sm mt-3 pl-2">
                    {validationError.fixedPercentage}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              {minP.map((field, index) => (
                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0" key={index}>
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Slab {index} (min %) <span>*</span>
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={field.minimumP} // Corrected from field.value
                    onChange={(event) => handleMinPChange(index, event)}
                  />
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Slab {index} (Offer %) <span>*</span>
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    value={field.product} // Corrected from field.value
                    onChange={(event) => handleOfferPChange(index, event)}
                  />
                  <button
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    type="button"
                    onClick={() => handleRemoveField(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="w-full flex justify-end">
                <button
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  type="button"
                  onClick={handleAddField}
                >
                  Add More
                </button>
                <button
                  type="submit"
                  className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="justify-center items-center h-screen">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Product <span>*</span>
              </label>
              <Select
                closeMenuOnSelect={false}
                id="Product"
                onChange={(selected) =>
                  handleSelectChange(
                    selected,
                    setSelectedProductsOptions,
                    ProductsOptions
                  )
                }
                options={ProductsOptions}
                className=""
                placeholder="Select Product"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Bucket <span>*</span>
              </label>
              <Select
                closeMenuOnSelect={false}
                id="bucket"
                onChange={(selected) =>
                  handleSelectChange(selected, setSelectedBucket, bucketOptions)
                }
                options={bucketOptions}
                className=""
                placeholder="Select Bucket"
                value={selectedBucket}
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Fixed Percentage <span>*</span>
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                onChange={(e) => {
                  setfixedPercentage(e.target.value);
                }}
              />
            </div>
          </div>
          <hr className="mb-4" />
          <div className="flex flex-wrap -mx-3 mb-6">
            {minP.map((field, index) => (
              <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0" key={index}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Slab {index} (min %) <span>*</span>
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  value={field.minimumP} // Corrected from field.value
                  onChange={(event) => handleMinPChange(index, event)}
                />
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Slab {index} (Offer %) <span>*</span>
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  value={field.product} // Corrected from field.value
                  onChange={(event) => handleOfferPChange(index, event)}
                />
                <button
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  type="button"
                  onClick={() => handleRemoveField(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="w-full flex justify-end">
              <button
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                type="button"
                onClick={handleAddField}
              >
                Add More
              </button>
              <button
                type="submit"
                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </form>
  );
};

export default DynamicInputFields;
