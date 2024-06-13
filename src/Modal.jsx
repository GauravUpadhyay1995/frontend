// ModalComponent.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const ModalComponent = ({ isOpen, onRequestClose, data }) => {
  console.log(data)
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="title"
    >
      <div> <img id="Profile" className='w-8 h-8  rounded-full shadow-2xl absolute  flex items-center justify-center text-indigo-500' src={data.Profile} alt="" />
        <img id="Profile1" className='w-48 h-48  rounded-full shadow-2xl absolute  flex items-center justify-center text-indigo-500' src={data.Profile} alt="" /></div>
      <button onClick={onRequestClose}>Close Modal</button>
    </Modal>
  );
};

export default ModalComponent;
