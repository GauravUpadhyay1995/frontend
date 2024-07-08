import React, { useState, useEffect, useRef } from "react";
import UserType from "./UserType";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaCloudUploadAlt,
  FaListAlt,
  FaCity,
} from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { Md123, MdOutlineSignalWifiStatusbar4Bar } from "react-icons/md";
import { FaCodePullRequest } from "react-icons/fa6";
import SweetAlert2 from "./SweetAlert2";
import { jwtDecode } from "jwt-decode";

function NavBar({ setIsAuthenticated }) {
  const [navOpen, setNavOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({});
  const navRef = useRef(null);
  const navigate = useNavigate();

  const userData = UserType();

  const showAlert = (data) => {
    return SweetAlert2(data);
  };
  const handleLogout = async () => {
    const result = await showAlert({
      type: "confirm",
      text: "Logout?",
      title: "Are you sure!!!",
    });

    if (result.isConfirmed ) {
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      console.log("Logout canceled");
    }
  };



  const checkTokenExpiry = () => {
    const token = localStorage.getItem('token');
   
    if (token) {
      try {

        const DecodeToken = jwtDecode(token);
        console.log()

        const currentTime = Date.now()/1000;
        if (currentTime >= DecodeToken.exp) {
          localStorage.clear();
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.clear();
        setIsAuthenticated(false);
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkTokenExpiry, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleNav = () => {
    setNavOpen(!navOpen);
    setSubmenuOpen({});
  };

  const closeNav = () => {
    setNavOpen(false);
  };

  const toggleSubmenu = (index) => {
    setSubmenuOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navOpen && navRef.current && !navRef.current.contains(event.target)) {
        closeNav();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navOpen]);

  let ProfileImage = "";
  const profileDoc = userData?.doc?.find(
    (doc) => doc.document_name === "Profile"
  );
  if (profileDoc && profileDoc.url) {
    ProfileImage = profileDoc.url;
  } else {
    ProfileImage =
      ""
  }

  return (
    <>
      {navOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeNav}
        ></div>
      )}
      <div
        ref={navRef}
        className={`fixed top-0 left-0 h-screen overflow-scroll bg-gray-800 text-white z-50 transform ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="h-full w-64 p-4 flex flex-col">
          <div className="profile flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1">
              <img
                src={ProfileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <span className="ml-4 text-lg font-semibold">
              <NavLink to="/Profile" className="flex items-center">
                Username
              </NavLink>
            </span>
          </div>
          <div className="menu flex-1">
            <ul className="space-y-2">
              <li className="main_menu relative">
                <button
                  className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                  onClick={() => toggleSubmenu(1)}
                >
                  <span className="flex items-center">
                    {userData?.type === "super admin"
                      ? "SUPER ADMIN"
                      : "Geographical"}
                  </span>
                  {submenuOpen[1] ? <FaChevronDown /> : <FaChevronRight />}
                </button>
                {submenuOpen[1] && (
                  <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                    {userData?.type === "nbfc" && (
                      <>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/UploadMasterData"
                            className="flex items-center"
                          >
                            <FaCloudUploadAlt className="mr-2" />
                            Upload Master Data
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/AddProducts"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Products
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink to="/Products" className="flex items-center">
                            <FaListAlt className="mr-2" />
                            List Products
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/statewise"
                            className="flex items-center"
                          >
                            <FaCog className="mr-2" />
                            State
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink to="/citywise" className="flex items-center">
                            <FaCity className="mr-2" />
                            City
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink to="/pinwise" className="flex items-center">
                            <Md123 className="mr-2" />
                            PIN
                          </NavLink>
                        </li>
                      </>
                    )}
                    {userData?.type === "agency" && (
                      <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                        <NavLink to="/Master" className="flex items-center">
                          <FaCog className="mr-2" />
                          Master Table
                        </NavLink>
                      </li>
                    )}
                  </ul>
                )}
              </li>
              <li className="main_menu relative">
                <button
                  className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                  onClick={() => toggleSubmenu(2)}
                >
                  <span className="flex items-center">Users</span>
                  {submenuOpen[2] ? <FaChevronDown /> : <FaChevronRight />}
                </button>
                {submenuOpen[2] && (
                  <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                    {userData?.type === "super admin" && (
                      <>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink to="/AddNbfc" className="flex items-center">
                            <IoMdAddCircle className="mr-2" />
                            Add NBFC
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink to="/NbfcList" className="flex items-center">
                            <FaListAlt className="mr-2" />
                            List NBFC
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/AddSuperAdminEmployee"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Employee
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/SuperAdminEmployeeList"
                            className="flex items-center"
                          >
                            <FaListAlt className="mr-2" />
                            List Employee
                          </NavLink>
                        </li>
                      </>
                    )}
                    {userData?.type === "nbfc" && (
                      <>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/AddAgency"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Agency
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/AgencyList"
                            className="flex items-center"
                          >
                            <FaListAlt className="mr-2" />
                            List Agency
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/AddNbfcEmployee"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Employee
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/NbfcEmployeeList"
                            className="flex items-center"
                          >
                            <FaListAlt className="mr-2" />
                            List Employee
                          </NavLink>
                        </li>
                      </>
                    )}
                    {userData?.type === "agency" && (
                      <>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/AddAgencyEmployee"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Employee
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/AgencyEmployeeList"
                            className="flex items-center"
                          >
                            <FaListAlt className="mr-2" />
                            List Employee
                          </NavLink>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </li>
              {userData?.type === "nbfc" && (
                <li className="main_menu relative">
                  <button
                    className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                    onClick={() => toggleSubmenu(3)}
                  >
                    <span className="flex items-center">Settings</span>
                    {submenuOpen[3] ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                  {submenuOpen[3] && (
                    <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                      <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                        <NavLink
                          to="/AddWaiverRule"
                          className="flex items-center"
                        >
                          <IoMdAddCircle className="mr-2" />
                          Add Waiver Rule
                        </NavLink>
                      </li>
                      <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                        <NavLink
                          to="/WaiverRules"
                          className="flex items-center"
                        >
                          <FaCodePullRequest className="mr-2" />
                          Waiver Rules
                        </NavLink>
                      </li>
                      <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                        <NavLink
                          to="/WaiverRequests"
                          className="flex items-center"
                        >
                          <FaCodePullRequest className="mr-2" />
                          Waiver Requests
                        </NavLink>
                      </li>
                      <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                        <NavLink
                          to="/AddCommercialRule"
                          className="flex items-center"
                        >
                          <FaCodePullRequest className="mr-2" />
                          Add Commercial Rule
                        </NavLink>
                      </li>
                      <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                        <NavLink
                          to="/ListCommercialRule"
                          className="flex items-center"
                        >
                          <FaCodePullRequest className="mr-2" />
                          List Commercial Rules
                        </NavLink>
                      </li>
                      <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                        <NavLink
                          to="/InvoiceForNBFC"
                          className="flex items-center"
                        >
                          <FaCodePullRequest className="mr-2" />
                          Generate Invoice
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              )}
              {userData?.type === "agency" && (
                <li className="main_menu relative">
                  <button
                    className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                    onClick={() => toggleSubmenu(3)}
                  >
                    <span className="flex items-center">Waivers</span>
                    {submenuOpen[3] ? <FaChevronDown /> : <FaChevronRight />}
                  </button>
                  {submenuOpen[3] && (
                    <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                      <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                        <NavLink
                          to="/AddWaiverRequest"
                          className="flex items-center"
                        >
                          <FaCodePullRequest className="mr-2" />
                          Request Waiver
                        </NavLink>
                      </li>
                      <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                        <NavLink to="/WaiverList" className="flex items-center">
                          <MdOutlineSignalWifiStatusbar4Bar className="mr-2" />
                          Waiver Status
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </div>
          <div className="mt-4">
            <button
              className="btn bg-red-500 p-2 rounded w-full hover:bg-red-600 transition-colors flex items-center justify-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {!navOpen && (
        <div className="p-4">
          <FaBars
            className="text-2xl text-black cursor-pointer"
            onClick={toggleNav}
          />
        </div>
      )}
    </>
  );
}

export default NavBar;
