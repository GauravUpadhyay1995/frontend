import React, { useState } from "react";
import axios from "../../utils/apiclient";

import SweetAlert2 from "../SweetAlert2"; // Ensure SweetAlert2 is correctly imported

const DynamicInputFields = () => {
  const showAlert = (data) => {
    SweetAlert2(data);
  };

  const [loading, setLoading] = useState(false); // Initialize to false

  const [inputFields, setInputFields] = useState([{ product: "" }]);
  const [error, setError] = useState("");
  const [productError, setProductError] = useState({});

  const handleError = () => {
    const newerror = {};
    inputFields.forEach((field, index) => {
      if (!field.product.trim()) {
        newerror[index] = "Product name is Required";
      } else {
        newerror[index] = ""; // Clear error if valid
      }
    });

    setProductError(newerror);
    return Object.keys(newerror).every((key) => !newerror[key]);
  };

  console.log(productError);

  const handleAddField = () => {
    setInputFields([...inputFields, { product: "" }]);
  };

  const handleRemoveField = (index) => {
    if (inputFields.length > 1) {
      const newFields = inputFields.filter((_, i) => i !== index);
      setInputFields(newFields);
    }
  };

  const handleInputChange = (index, event) => {
    setError("");
    const newFields = inputFields.map((field, i) => {
      if (i === index) {
        return { ...field, product: event.target.value };
      }
      return field;
    });
    setInputFields(newFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!handleError()) {
      setLoading(false);
      return;
    }
    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        "api/users/AddProducts",
        inputFields,
        {}
      );

      if (response.data.success === true) {
        showAlert({ type: "success", title: response.data.message });
        setInputFields([{ product: "" }]);
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
        showAlert({
          type: "error",
          title: "An unexpected error occurred.",
        });
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-8 border bg-white rounded-lg shadow-lg"
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 -mx-3 mb-6">
        {inputFields.map((field, index) => (
          <div className="w-full px-3 mb-6 md:mb-0" key={index}>
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Product Name {index + 1} <span className="text-red-500">*</span>
            </label>
            <input
              className={`appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white ${
                productError[index] ? "border-red-700" : "border-gray-300"
              }`}
              type="text"
              value={field.product}
              onChange={(event) => {
                const newErrors = { ...productError };
                const { value } = event.target;

                if (!value.trim()) {
                  newErrors[index] = "Product name is Required";
                } else {
                  newErrors[index] = ""; // Clear error if valid
                }

                setProductError(newErrors);
                handleInputChange(index, event);
              }}
            />
            {productError[index] && (
              <div className="text-red-500 pl-1 text-sm mt-1 mb-2">
                {productError[index]}
              </div>
            )}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => handleRemoveField(index)}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="w-full px-3 flex justify-end gap-4 mt-6 col-span-full">
          <button
            className="bg-indigo-500  text-white font-bold py-2 px-7 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleAddField}
          >
            Add More
          </button>
          <button
            type="submit"
            className="bg-indigo-500 text-white font-bold py-3 px-9 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default DynamicInputFields;
