import React, { useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import axios from 'axios';
import SweetAlert2 from './SweetAlert2'; // Ensure SweetAlert2 is correctly imported

Modal.setAppElement('#root'); // Set the root element for accessibility

const CustomModal = ({ isOpen, onRequestClose, data }) => {
  const showAlert = (data) => {
    SweetAlert2(data);
  };

  const getToken = () => localStorage.getItem('token');

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPenality, setSelectedPenality] = useState(null);
  const [penality, setPenality] = useState(0);
  const [message, setMessage] = useState('');

  const closingOptions = [
    { value: '0', label: 'Close with penalty' },
    { value: '2', label: 'Normal close' },
  ];

  const penalityOptions = [
    { value: '1', label: 'Fixed' },
    { value: '2', label: 'Percentage' },
  ];

  const resetForm = () => {
    setSelectedOption(null);
    setSelectedPenality(null);
    setPenality(0);
    setMessage('');
  };

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    if (option.value !== '0') {
      setSelectedPenality(null);
      setPenality(0);
    }
  };

  const handleSelectPenalityChange = (option) => {
    setSelectedPenality(option);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedOption) {
      const payload = {
        closeOption: selectedOption.value,
        penalityOption: selectedPenality ? selectedPenality.value : 0,
        escalation_id: data,
        penality: penality,
        message: message,
      };

      const userApi = "/api/escalation/closeEscalation";
      try {
        const response = await axios.post(userApi, payload, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        showAlert({
          type: response.data.success ? "success" : "error",
          title: response.data.message,
        });
        resetForm();
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No option selected');
    }
  };

  const handleRequestClose = () => {
    resetForm(); // Reset form values on modal close
    onRequestClose(); // Call the original onRequestClose function
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleRequestClose}
      contentLabel="Close Options"
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <form className="bg-white rounded-lg p-4 sm:p-6 shadow-lg w-full max-w-xs sm:max-w-md relative" onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={handleRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl p-2"
        >
          &times; {/* Cross icon */}
        </button>
        
        <h2 className="text-lg font-semibold mb-4">Close Options</h2>
        <div>
          <label className="block mb-2" htmlFor="closeOption">
            Close With <span className="text-red-500">*</span>
          </label>
          <Select
            closeMenuOnSelect={true}
            id="closeOption"
            name="closeOption"
            onChange={handleSelectChange}
            options={closingOptions}
            className="block w-full border border-gray-300 rounded-md p-2"
            placeholder="Select Type"
          />
        </div>
        {selectedOption && selectedOption.value === '0' && (
          <>
            <div className="mt-4">
              <label className="block mb-2" htmlFor="penalityOption">
                Penalty With <span className="text-red-500">*</span>
              </label>
              <Select
                closeMenuOnSelect={true}
                id="penalityOption"
                name="penalityOption"
                onChange={handleSelectPenalityChange}
                options={penalityOptions}
                className="block w-full border border-gray-300 rounded-md p-2"
                placeholder="Select Type"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2" htmlFor="penality">
                Penalty <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setPenality(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2"
                id="penality"
                type="text"
                name="penality"
                placeholder="Enter Penalty"
              />
            </div>
          </>
        )}
        <div className="mt-4">
          <label className="block mb-2" htmlFor="comment">
            Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="2"
            className="block w-full border border-gray-300 rounded-md p-2"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white font-semibold rounded-md py-2 hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </Modal>
  );
};

export default CustomModal;