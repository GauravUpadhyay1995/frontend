import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SweetAlert2 from './SweetAlert2';

function App() {
    const showAlert = (data) => {
        SweetAlert2(data)
    }
    const [file, setFile] = useState(null);
    const [header, setHeader] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem('token');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = (evt) => {
                const arrayBuffer = evt.target.result;
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                const sheetHeader = sheetData[0];
                setHeader(sheetHeader);
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('No file selected');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/upload/uploadMasterData', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${getToken()}`
                }
            });

            console.log('gaurav', response.data);
            setFile(null);
            setHeader([]);
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            setError('There was a problem uploading the file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-8 border-white-500 max-w-6xl mx-auto h-fit mt-10 w-full'>
            <input type="file"  onChange={handleFileChange} />
            {file && (
                <div>
                    <div className="shadow">

                        <div className=" text-center border-b pb-12">


                            <h1 className="text-4xl font-medium text-gray-700"><span className="font-light text-gray-500"></span></h1>
                            <p className="font-light text-gray-600 mt-3"></p>

                            <p className="mt-8 text-gray-500">File Information</p>
                            <p className="mt-2 text-gray-500">FILE NAME = {file.name}</p>
                            <p className="mt-2 text-gray-500">FILE SIZE = {(file.size / (1024 * 1024)).toFixed(4)}MB</p>
                            <p className="mt-2 text-gray-500"> FILE TYPE = {file.type}</p>
                            <p className="mt-2 text-gray-500"> {header.length > 0 && (
                                <div>
                                    <button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900" onClick={handleUpload} disabled={loading}>
                                        {loading ? 'Uploading...' : 'Upload File'}
                                    </button>
                                    <h2 className='mt-8 mb-8 text-gray-500 text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-900'>Headers Found In Your Files Are:</h2>

                                    {header.map((item, index) => (

                                        <button className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900" key={index}>{item}</button>
                                    ))}

                                </div>
                            )}
                                {error && <p style={{ color: 'red' }}>{error}</p>}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
