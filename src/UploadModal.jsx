import React, { useState } from "react";
import Draggable from "react-draggable";
import axios from "./utils/apiclient";

function UploadModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const handleCancel = () => {
    setFile(null);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedExtensions = /(\.xlsx|\.xls)$/i;

    if (!allowedExtensions.exec(selectedFile.name)) {
      setFile(null);
      setError("Invalid file type. Please select an Excel file.");
      setSuccess(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "/api/upload/uploadClientFinder",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Response:", response.data);
      setSuccess("Upload successful!");
      setFile(null);
      document.getElementById("file-input").value = "";
    } catch (error) {
      console.log(error);
      setError("Upload failed");
    }
  };

  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints;

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center transition-opacity duration-300">
      <Draggable disabled={isTouchDevice}>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 md:mx-0 cursor-move transform transition-transform duration-300 relative">
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
            onClick={handleCancel}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Upload Agency Data
          </h2>
          <form onSubmit={handleUpload}>
            <div className="mb-6">
              <input
                id="file-input"
                type="file"
                accept=".xlsx, .xls"
                className={`w-full text-sm md:text-base p-3 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-md dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                onChange={handleFileChange}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 ml-2">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-sm mt-2">{success}</p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-gray-600 transition duration-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-blue-600 transition duration-200"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </Draggable>
    </div>
  );
}

export default UploadModal;
