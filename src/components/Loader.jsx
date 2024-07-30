import React from 'react';
import './LoadingAnimation.css'; // Import CSS file for styling

export const Loader = () => {
  return (
    <div className="flex flex-col items-center mx-auto h-screen">
      <div className="loading-ring"></div>
      <div className="loading-text mt-4 text-lg font-bold">Loading...</div>
    </div>
  );
};

export default Loader;
