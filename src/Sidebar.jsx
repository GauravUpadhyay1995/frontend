import React from "react";

const Sidebar = ({ isNonMobile, isSidebarOpen, setIsSidebarOpen, className }) => {
  return (
    <div
      className={`${
        isSidebarOpen ? "block" : "hidden"
      } ${className} bg-gray-800 text-white p-4 w-64`}
    >
      <button onClick={() => setIsSidebarOpen(false)}>Close Sidebar</button>
      {/* Sidebar content here */}
    </div>
  );
};

export default Sidebar;
