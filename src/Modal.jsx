import React, { useState } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import axios from 'axios';
import SweetAlert2 from './SweetAlert2'; 

Modal.setAppElement('#root'); 

const CustomModal = ({ isOpen, onRequestClose, data }) => {

  const showAlert = (data) => {
    SweetAlert2(data);
  };
  const getToken = () => localStorage.getItem('token');

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPenality, setSelectedPenality] = useState(null);
  const [penality, setPenality] = useState(0);
  const [message, setMessage] = useState('')

  const closingOptions = [
    { value: '0', label: 'Close with Penalty' },
    { value: '2', label: 'Normal Close' }
  ];
  const penalityOptions = [
    { value: '1', label: 'Fixed' },
    { value: '2', label: 'Percentage' }
  ];

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    if (option.value !== '2') {
      setSelectedPenality(null);
      setPenality(0);
    }
  };

  const handleSelectPenalityChange = (option) => {
    setSelectedPenality(option);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedOption) {
      const payload = {
        closeOption: selectedOption.value,
        penalityOption: selectedPenality ? selectedPenality.value : 0,
        escalation_id: data,
        penality: penality,
        message: message
      };

      const userApi = "/api/escalation/closeEscalation";
      try {
        const response = await axios.post(
          userApi,
          payload,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        if (response.data.success) {
          onRequestClose();
          showAlert({ type: "success", title: response.data.message });

        } else {
          showAlert({ type: "error", title: response.data.message });
        }
      } catch (error) {
        console.error('Error:', error); 
      }
    } else {
      console.error('No option selected');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="title"
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto relative">
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Close Escalation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="closeOption">
              Close With <span className="text-red-500">*</span>
            </label>
            <Select
              closeMenuOnSelect={true}
              id="closeOption"
              name="closeOption"
              onChange={handleSelectChange}
              options={closingOptions}
              className="w-full"
              placeholder="Select Type"
            />
          </div>
          {selectedOption && selectedOption.value === '0' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="penalityOption">
                  Penalty With <span className="text-red-500">*</span>
                </label>
                <Select
                  closeMenuOnSelect={true}
                  id="penalityOption"
                  name="penalityOption"
                  onChange={handleSelectPenalityChange}
                  options={penalityOptions}
                  className="w-full"
                  placeholder="Select Type"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="penality">
                  Penalty <span className="text-red-500">*</span>
                </label>
                <input
                  onChange={(e) => setPenality(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
                  id="penality"
                  type="text"
                  name="penality"
                  placeholder="Enter Penalty"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="comment">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="2"
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
              id="comment"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default CustomModal;
