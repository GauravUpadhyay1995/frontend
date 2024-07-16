import React, { useState } from "react";
import Draggable from "react-draggable";
import axios from "axios";

function UploadModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload/uploadClientFinder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Response:', response.data);
      onClose(); 
    } catch (error) {
      console.log(error);
      setError('Upload failed');
    }
  };

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center transition-opacity duration-300">
      <Draggable disabled={isTouchDevice}>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 md:mx-0 cursor-move transform transition-transform duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Upload Agency Data</h2>
          <form onSubmit={handleUpload}>
            <div className="mb-6">
              <input
                type="file"
                accept=".xlsx, .xls"
                className="w-full text-sm md:text-base p-3 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={handleFileChange}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-gray-600 transition duration-200"
                onClick={onClose}
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
