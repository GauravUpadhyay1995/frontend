import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SweetAlert2 from './SweetAlert2';
import './uploadMaster.css';

function App() {
    const showAlert = (data) => {
        SweetAlert2(data);
    };

    const [file, setFile] = useState(null);
    const [header, setHeader] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [fileData, setFileData] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const getToken = () => localStorage.getItem('token');

    const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    
    if (!selectedFile) return;

    
    if (!selectedFile.name.endsWith('.xlsx')) {
        setError('Please select a valid Excel file (.xlsx)');
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
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
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
            setError('No file selected');
            return;
        }

        setLoading(true);
        setError(null);
        setFileData(false)

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/upload/uploadMasterData', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${getToken()}`
                }
            });

            console.log('Response:', response.data);
            showAlert(response.data);
            setFile(null);
            setHeader([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            setError('There was a problem uploading the file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-black p-20 md:p-24">
            <div className="flex flex-col md:flex-row justify-between items-start w-full">
                <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
                    <label className={`relative h-72 md:h-96 w-72 md:w-96 flex flex-col justify-center items-center border border-gray-300 rounded-lg cursor-pointer ${scanning ? 'qrcode' : ''}`}>
                        <h1 className='text-white mb-4'>Upload a file</h1>
                        <div
                            className="absolute inset-0 bg-cover bg-center rounded-lg"
                            style={{
                                backgroundImage: `url('border.png')`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            }}
                        ></div>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="opacity-2 w-full md:w-full relative left-24 md:left-36 cursor-pointer"
                        />

                        {file && (
                            <div className="absolute bottom-4 text-white text-center bg-black bg-opacity-50 p-2 rounded">
                                {file.name}
                            </div>
                        )}
                    </label>
                    {scanning ? (
                        <h2 className="text-xl md:text-2xl mt-5 text-white tracking-widest drop-shadow-[0_0_20px_#fff] animate-[animateText_0.5s_steps(1)_infinite] uppercase">
                            File Scanning
                        </h2>
                    ) : file ? (
                        <h2 className="text-xl md:text-2xl mt-5 text-white tracking-widest drop-shadow-[0_0_20px_#fff] animate-[animateText_0.5s_steps(1)_infinite] uppercase">
                            File upload successfully
                        </h2>
                    ) : (
                        <h2 className="text-xl md:text-2xl mt-5 text-white tracking-widest drop-shadow-[0_0_20px_#fff] animate-[animateText_0.5s_steps(1)_infinite] uppercase">
                            No File Selected
                        </h2>
                    )}
                </div>
                {fileData && file && (
                    <div className="shadow-lg p-4 md:p-6 bg-white rounded-lg w-full md:w-1/3 mt-4 md:mt-0 md:ml-8">
                        <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-4">File Information</h2>
                        <p className="text-gray-600 mb-2">
                            <span className="font-bold">FILE NAME:</span> {file.name}
                        </p>
                        <p className="text-gray-600 mb-2">
                            <span className="font-bold">FILE SIZE:</span>{' '}
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
                            {loading ? 'Uploading...' : 'Upload File'}
                        </button>
                    </div>
                )}
            </div>
            {fileData && header.length > 0 && (
                <div className="mt-8 w-full">
                    <h2 className='text-xl md:text-2xl text-white mb-4 text-center'>Headers Found In Your File</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-300 rounded-lg bg-white">
                        {header.map((item, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg text-center text-gray-700 bg-gray-50">
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
