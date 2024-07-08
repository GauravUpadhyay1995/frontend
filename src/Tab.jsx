import React, { useState } from "react";

function Tab({ setActiveEndPoint }) {
  const [activeTab, setActiveTab] = useState("getStateData");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setActiveEndPoint(tabName);
  };

  return (
    <div className="w-full border-b border-gray-300">
      <ul className="flex justify-center space-x-4">
        <li>
          <button
            className={`${
              activeTab === "getStateData"
                ? "text-black bg-blue-400 rounded-t-md"
                : "text-black"
            } hover:bg-blue-200 px-4`}
            onClick={() => handleTabClick("getStateData")}
          >
            State Wise Resolution
          </button>
        </li>
        <li>
          <button
            className={`${
              activeTab === "getResolvedPercentageData"
                ? "text-black bg-blue-400 rounded-t-md"
                : "text-black"
            } hover:bg-blue-200 px-4 `}
            onClick={() => handleTabClick("getResolvedPercentageData")}
          >
            Daily Trend Resolution Data
          </button>
        </li>
        <li>
          <button
            className={`${
              activeTab === "getCollectedAmountData"
                ? "text-black bg-blue-400 rounded-t-md"
                : "text-black"
            } hover:bg-blue-200 px-4`}
            onClick={() => handleTabClick("getCollectedAmountData")}
          >
            Daily Trend Collection
          </button>
        </li>
        <li>
          <button
            className={`${
              activeTab === "getResolutionPosData"
                ? "text-black bg-blue-400 rounded-t-md"
                : "text-black"
            } hover:bg-blue-200 px-4 `}
            onClick={() => handleTabClick("getResolutionPosData")}
          >
            Daily Trend Resolution Pos
          </button>
        </li>
        <li>
          <button
            className={`${
              activeTab === "getResolvedCountData"
                ? "text-black bg-blue-400 rounded-t-md"
                : "text-black"
            } hover:bg-blue-200 px-4`}
            onClick={() => handleTabClick("getResolvedCountData")}
          >
            Daily Trend Resolve Count
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Tab;
