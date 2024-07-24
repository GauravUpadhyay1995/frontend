import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from "./SweetAlert2";
import "./uploadMaster.css";

function App() {
  const showAlert = (data) => {
    SweetAlert2(data);
  };

  const [file, setFile] = useState(null);
  const [radioValue, setradioValue] = useState("");
  const [header, setHeader] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [fileData, setFileData] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const getToken = () => localStorage.getItem("token");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".xlsx")) {
      setError("Please select a valid Excel file (.xlsx)");
      return;
    }

    setFile(selectedFile);
    setScanning(true);
    // Reset previous file data
    setFile(selectedFile);
    setScanning(true);
    setFileData(false); // Reset fileData state
    setError(null); // Clear previous error messages
    setHeader([]); // Clear previous headers

    const reader = new FileReader();
    reader.onload = (evt) => {
      const arrayBuffer = evt.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const sheetHeader = sheetData[0];
      setHeader(sheetHeader);

      setTimeout(() => {
        setScanning(false);
        setFileData(true);
      }, 5000);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    if (!radioValue) {
      setError("Please select Paid or Unpaid");
      return;
    }

    setLoading(true);
    setError(null);
    setFileData(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("status", radioValue);
      const url =
        radioValue === "paid"
          ? "/api/upload/uploadMasterData"
          : "/api/upload/uploadUnpaidFileData";
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log("Response:", response.data);
      console.log(radioValue);
      showAlert(response.data);
      setFile(null);
      setHeader([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      setError("There was a problem uploading the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 md:p-12 ">
      <div className="flex flex-col md:flex-row justify-start bg-gray-300 items-center w-full max-w-6xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2 p-7">
          <label
            className={`relative h-72 md:h-96 w-72 md:w-96 flex flex-col justify-center items-center border border-gray-300 rounded-lg cursor-pointer ${
              scanning ? "qrcode" : ""
            }`}
          >
            <h1 className="text-black mb-4">Upload a file</h1>
            <div
              className="absolute inset-0 bg-cover bg-center rounded-lg"
              style={{
                backgroundImage: `url('border.png')`,
                backgroundSize: "200px 200px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="opacity-2 w-full md:w-full relative left-24 md:left-36 cursor-pointer hidden"
            />
            {file && (
              <div className="absolute bottom-28 left-15 text-white text-center bg-black bg-opacity-50 p-2 rounded">
                {file.name}
              </div>
            )}
          </label>
          {scanning ? (
            <h2 className="text-xl md:text-2xl mt-5 pl-12 text-black tracking-widest drop-shadow-[0_0_20px_#fff] animate-[animateText_0.5s_steps(1)_infinite] uppercase">
              File Scanning
            </h2>
          ) : file ? (
            <h2 className="text-xl md:text-2xl mt-5 pl-12 text-black tracking-widest drop-shadow-[0_0_20px_#fff] animate-[animateText_0.5s_steps(1)_infinite] uppercase">
              File upload successfully
            </h2>
          ) : (
            <h2 className="text-xl md:text-2xl pl-16 text-black tracking-widest drop-shadow-[0_0_20px_#fff] animate-[animateText_0.5s_steps(1)_infinite] uppercase">
              No File Selected
            </h2>
          )}
        </div>
        <div>
          <div className="flex md:relative md:bottom-48 md:left-56 gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                onChange={(e) => setradioValue(e.target.value)}
                id="paid"
                name="value"
                value="Paid"
                defaultChecked
                className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="paid" className="ml-2 text-lg text-gray-700">
                Paid
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                onChange={(e) => setradioValue(e.target.value)}
                id="unpaid"
                name="value"
                value="unpaid"
                className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="unpaid" className="ml-2 text-lg text-gray-700">
                unPaid
              </label>
            </div>
          </div>
        </div>
        {fileData && file && (
          <div className="flex justify-center items-center w-full md:w-1/3 mt-4 md:mt-0 md:ml-2">
            <div className="shadow-lg p-6 bg-white rounded-lg w-full">
              <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-4">
                File Information
              </h2>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">FILE NAME:</span> {file.name}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">FILE SIZE:</span>{" "}
                {(file.size / (1024 * 1024)).toFixed(4)} MB
              </p>
              <p className="text-gray-600 mb-4 break-all">
                <span className="font-bold">FILE TYPE:</span> {file.type}
              </p>
              <button
                className="block w-full text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload File"}
              </button>
            </div>
          </div>
        )}
      </div>
      {fileData && header.length > 0 && (
        <div className="mt-8 w-full max-w-6xl">
          <h2 className="text-xl md:text-2xl text-gray-900 mb-4 text-center">
            Headers Found In Your File
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-300 rounded-lg bg-white">
            {header.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg text-center text-gray-700 bg-gray-50"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default App;
