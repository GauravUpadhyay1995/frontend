import React, { useState } from 'react';

function Tab({setActiveEndPoint}) {
  const [activeTab, setActiveTab] = useState('getStateData');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setActiveEndPoint(tabName)

  };

  return (
    <div className="flex justify-center mt-4 bg-primary">
      <ul className="flex space-x-4 border-b-2 border-gray-300">
        <li className="p-2">
          <button
            className={activeTab === 'getStateData' ? "text-white bg-blue-500 border-blue-500 border-b-2 p-2 rounded-t-md" : "text-white hover:text-blue-500 p-2"}
            onClick={() => handleTabClick('getStateData')}
          >
            State Wise Resolution
          </button>
        </li>
        <li className="p-2">
          <button
            className={activeTab === 'getResolvedPercentageData' ? "text-white bg-blue-500 border-blue-500 border-b-2 p-2 rounded-t-md" : "text-white hover:text-blue-500 p-2"}
            onClick={() => handleTabClick('getResolvedPercentageData')}
          >
            Daily Trend Resolution Data
          </button>
        </li> 
        <li className="p-2">
          <button
            className={activeTab === 'getCollectedAmountData' ? "text-white bg-blue-500 border-blue-500 border-b-2 p-2 rounded-t-md" : "text-white hover:text-blue-500 p-2"}
            onClick={() => handleTabClick('getCollectedAmountData')}
          >
            Daily Trend Collection
          </button>
        </li>
        <li className="p-2">
          <button
            className={activeTab === 'getResolutionPosData' ? "text-white bg-blue-500 border-blue-500 border-b-2 p-2 rounded-t-md" : "text-white hover:text-blue-500 p-2"}
            onClick={() => handleTabClick('getResolutionPosData')}
          >
            Daily Trend Resolution Pos
          </button>
        </li>
        <li className="p-2">
          <button
            className={activeTab === 'getResolvedCountData' ? "text-white bg-blue-500 border-blue-500 border-b-2 p-2 rounded-t-md" : "text-white hover:text-blue-500 p-2"}
            onClick={() => handleTabClick('getResolvedCountData')}
          >
            Daily Trend Resolve Count
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Tab;
