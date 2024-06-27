import React, { useState } from 'react';
import axios from 'axios';

import SweetAlert2 from './SweetAlert2'; // Ensure SweetAlert2 is correctly imported

const DynamicInputFields = () => {
    const showAlert = (data) => {
        SweetAlert2(data);
    };

    const [loading, setLoading] = useState(false); // Initialize to false

    const [inputFields, setInputFields] = useState([{ product: '' }]);
    const [error, setError] = useState('');

    const handleAddField = () => {
        setInputFields([...inputFields, { product: '' }]);
    };

    const getToken = () => localStorage.getItem('token');

    const handleRemoveField = (index) => {
        if (inputFields.length > 1) {
            const newFields = inputFields.filter((_, i) => i !== index);
            setInputFields(newFields);
        }
    };

    const handleInputChange = (index, event) => {
        setError('');
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
        setError('');
        setLoading(true); // Start loading

        try {
            const response = await axios.post(
                'api/users/AddProducts',
                inputFields,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
          
            if (response.data.success === true) {
                showAlert({ type: 'success', title: response.data.message });
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
                showAlert({ type: 'error', title: error.response.data.message });
            } else {
                setError('An unexpected error occurred.');
                showAlert({ type: 'error', title: 'An unexpected error occurred.' });
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    let i = 0;

    return (
        <form onSubmit={handleSubmit} className="min-h-screen">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="justify-center items-center h-screen">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        {inputFields.map((field, index) => (
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0" key={index}>
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Product Name {++i} <span>*</span>
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    value={field.product} // Corrected from field.value
                                    onChange={(event) => handleInputChange(index, event)}
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
        </form>
    );
};

export default DynamicInputFields;
