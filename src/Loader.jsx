import React from 'react';
import './LoadingAnimation.css'; // Import CSS file for styling

export const Loader = () => {
  return (
    <div className="loading-container">
      <div className="loading-ring"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};


