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
  const [message, setMessage] = useState('')

  const closingOptions = [
    { value: '0', label: 'close with penalty' },
    { value: '2', label: 'normal close' }

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
          showAlert({ type: "success", title: response.data.message });
        } else {
          showAlert({ type: "error", title: response.data.message });
        }
      } catch (error) {
        console.error('Error:', error); // Handle the error as needed
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
      className=""
    >
      <form className="" onSubmit={handleSubmit}>
        <div className="">
          <div className="bg-white rounded-2xl rounded-lg p-8 border-white-500 max-h-[50vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 font-bold mb-2" htmlFor="closeOption">
                  Close With <span>*</span>
                </label>
                <Select
                  closeMenuOnSelect={false}
                  id="closeOption"
                  name="closeOption"
                  onChange={handleSelectChange}
                  options={closingOptions}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Select Type"
                />
              </div>
              {selectedOption && selectedOption.value === '0' && (
                <>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="penalityOption">
                      Penalty With <span>*</span>
                    </label>
                    <Select
                      closeMenuOnSelect={false}
                      id="penalityOption"
                      name="penalityOption"
                      onChange={handleSelectPenalityChange}
                      options={penalityOptions}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      placeholder="Select Type"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="penality">
                      Penalty <span>*</span>
                    </label>
                    <input
                      onChange={(e) => setPenality(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      id="penality"
                      type="text"
                      name="penality"
                      placeholder="Enter Penalty"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-gray-700 font-bold mb-2" htmlFor="closeOption">
                  Comment <span>*</span>
                </label>
                <textarea
                  rows="2"

                  className="flex-1 border rounded-l-lg p-2"
                  placeholder="Type your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-12 py-3 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CustomModal;
