import React, { useContext, useState } from "react";
import { useNavContext } from "../src/HeaderContext";
import ThemeContext from "./ThemeContext";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const { navOpen, setNavOpen } = useNavContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
   const navigate = useNavigate();

  const themeClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    setDropdownOpen(false); 
  };
  const handleDashboardClick = () => {
    navigate("/");
  };

  return (
    <>
      <header className={`${themeClass} shadow`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <nav className="hidden sm:flex space-x-4">
              <button
                onClick={handleDashboardClick}
                className="text-gray-600 hover:text-gray-800"
              >
                Dashboard
              </button>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Users
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Settings
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405C18.37 14.79 18 13.5 18 12V8c0-3.038-1.635-5.659-4.5-6.32V1a1.5 1.5 0 00-3 0v.68C7.635 2.34 6 4.962 6 8v4c0 1.5-.37 2.79-1.595 3.595L3 17h5m7 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
            </button>
            <div className="relative top-px">
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={toggleDropdown}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></circle>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => handleThemeChange("light")}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></circle>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                      />
                    </svg>
                    Light
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => handleThemeChange("dark")}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3a9 9 0 110 18c-1.657 0-3.156-.422-4.468-1.165M12 1a9 9 0 000 22 9 9 0 004.468-20.835A9 9 0 0112 3z"
                      />
                    </svg>
                    Dark
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => handleThemeChange('light')}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></circle>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                      />
                    </svg>
                    Auto
                  </a>
                </div>
              )}
            </div>
            <img
              className="w-8 h-8 rounded-full"
              src="https://images.pexels.com/photos/670720/pexels-photo-670720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="User profile picture"
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
