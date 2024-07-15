import React, { useContext, useState } from "react";
import ThemeContext from "./ThemeContext";

function Tab({ setActiveEndPoint }) {
  const [activeTab, setActiveTab] = useState("getStateData");
  const { theme, setTheme } = useContext(ThemeContext);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setActiveEndPoint(tabName);
  };

  return (
    <div className="w-full border-b border-gray-300">
    <ul className="flex flex-wrap justify-center gap-1 md:grid md:grid-cols-5 md:gap-2 md:justify-between">
      <li className="flex-grow">
        <button
          className={`${
            activeTab === "getStateData"
              ? "text-black bg-blue-400 rounded-t-md"
              : `${theme === 'light' ? ' text-black' : 'text-white'}`
          } hover:bg-blue-200 px-4 py-2 w-full md:w-auto`}
          onClick={() => handleTabClick("getStateData")}
        >
          State Wise Resolution
        </button>
      </li>
      <li className="flex-grow">
        <button
          className={`${
            activeTab === "getResolvedPercentageData"
              ? "text-black bg-blue-400 rounded-t-md"
              : `${theme === 'light' ? ' text-black' : 'text-white'}`
          } hover:bg-blue-200 px-4 py-2 w-full md:w-auto`}
          onClick={() => handleTabClick("getResolvedPercentageData")}
        >
          Daily Trend Resolution Data
        </button>
      </li>
      <li className="flex-grow">
        <button
          className={`${
            activeTab === "getCollectedAmountData"
              ? "text-black bg-blue-400 rounded-t-md"
              : `${theme === 'light' ? ' text-black' : 'text-white'}`
          } hover:bg-blue-200 px-4 py-2 w-full md:w-auto`}
          onClick={() => handleTabClick("getCollectedAmountData")}
        >
          Daily Trend Collection
        </button>
      </li>
      <li className="flex-grow">
        <button
          className={`${
            activeTab === "getResolutionPosData"
              ? "text-black bg-blue-400 rounded-t-md"
              : `${theme === 'light' ? ' text-black' : 'text-white'}`
          } hover:bg-blue-200 px-4 py-2 w-full md:w-auto`}
          onClick={() => handleTabClick("getResolutionPosData")}
        >
          Daily Trend Resolution Pos
        </button>
      </li>
      <li className="flex-grow">
        <button
          className={`${
            activeTab === "getResolvedCountData"
              ? "text-black bg-blue-400 rounded-t-md"
              : `${theme === 'light' ? ' text-black' : 'text-white'}`
          } hover:bg-blue-200 px-4 py-2 w-full md:w-auto`}
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