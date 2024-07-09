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
                setInputFields([{ product: '' }]);

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
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="flex flex-wrap -mx-3 mb-6">
                {inputFields.map((field, index) => (
                    <div className="w-full md:w-1/2 xl:w-1/2 px-3 mb-6 md:mb-0" key={index}>
                        <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
                            Product Name {index + 1} <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            type="text"
                            value={field.product}
                            onChange={(event) => handleInputChange(index, event)}
                        />
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => handleRemoveField(index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <div className="w-full px-3 flex justify-between mt-6">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleAddField}
                    >
                        Add More
                    </button>
                    <button
                        type="submit"
                        className=" bg-[#dc2424] hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                    >
                            submit                        
                    </button>
                    
                
            </div>
        </div>
      </form >
      

    );
};

export default DynamicInputFields;
