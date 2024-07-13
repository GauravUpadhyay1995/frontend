import React, { useState, useEffect, useRef } from "react";
import UserType from "./UserType";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navigationbar.css"

import { useNavContext } from "./HeaderContext";

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

function NavBar({ setIsAuthenticated }) {
  // const [navOpen, setNavOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({});
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { navOpen, setNavOpen } = useNavContext();
  console.log(navOpen);

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

    if (result.isConfirmed) {
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      console.log("Logout canceled");
    }
  };

  // const toggleNav = () => {
  //   setNavOpen(!navOpen);
  //   setSubmenuOpen({});
  // };

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
      "https://www.assistfin.com/Admin/html/uploads/services/Slide3%20-%20Copy.png";
  }

  return (
    <>
      {/* {navOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeNav}
        ></div>
      )}
      <div
        ref={navRef}
        className={`fixed top-0 left-0 h-screen overflow-auto bg-gray-800 text-white z-50 transform ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      > */}

      {navOpen && (
        <div
          className="h-full w-64 p-2 flex flex-col text-white hide-scrollbar overflow-y-auto"
          style={{ backgroundColor: "#212233", borderRight: "1px solid gray" }}
        >
          <div className="profile flex  items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1">
              <img
                src={ProfileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <span className="ml-4 text-lg font-semibold">
              <NavLink to="/profile" className="flex items-center">
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
                            to="/upload-master-data"
                            className="flex items-center"
                          >
                            <FaCloudUploadAlt className="mr-2" />
                            Upload Master Data
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-products"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Products
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink to="/products" className="flex items-center">
                            <FaListAlt className="mr-2" />
                            List Products
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/state-wise"
                            className="flex items-center"
                          >
                            <FaCog className="mr-2" />
                            State
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/city-wise"
                            className="flex items-center"
                          >
                            <FaCity className="mr-2" />
                            City
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink to="/pin-wise" className="flex items-center">
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
                          <NavLink to="/add-nbfc" className="flex items-center">
                            <IoMdAddCircle className="mr-2" />
                            Add NBFC
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/nbfc-list"
                            className="flex items-center"
                          >
                            <FaListAlt className="mr-2" />
                            List NBFC
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-super-admin-employee"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Employee
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/super-admin-employee-list"
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
                            to="/add-agency"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Agency
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/agency-list"
                            className="flex items-center"
                          >
                            <FaListAlt className="mr-2" />
                            List Agency
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-nbfc-employee"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Employee
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/nbfc-employee-list"
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
                            to="/add-agency-employee"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Employee
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/agency-employee-list"
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
                <>
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
                            to="/add-waiver-rule"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Add Waiver Rule
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/waiver-rules"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Waiver Rules
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/waiver-requests"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Waiver Requests
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-commercial-rule"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Add Commercial Rule
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/list-commercial-rules"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            List Commercial Rules
                          </NavLink>
                        </li>

                      </ul>
                    )}
                  </li>

                  <li className="main_menu relative">
                    <button
                      className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                      onClick={() => toggleSubmenu(4)}
                    >
                      <span className="flex items-center">Escalations</span>
                      {submenuOpen[4] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {submenuOpen[4] && (
                      <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-escalation"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Raise Escalations
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/opened-escalation"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Opened Escalations
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/closed-escalation"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Closed Escalations ( with penalty )
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/normal-closed-escalation"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Closed Escalations ( normal )
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className="main_menu relative">
                    <button
                      className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                      onClick={() => toggleSubmenu(5)}
                    >
                      <span className="flex items-center">Payments & Invoices</span>
                      {submenuOpen[5] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {submenuOpen[5] && (
                      <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/invoice-for-nbfc"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Generate Invoice
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/payments"
                            className="flex items-center"
                          >
                            <IoMdAddCircle className="mr-2" />
                            Payments
                          </NavLink>
                        </li>

                      </ul>
                    )}
                  </li>
                </>
              )}
              {userData?.type === "agency" && (
                <>
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
                            to="/add-waiver-request"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Request Waiver
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/waiver-list"
                            className="flex items-center"
                          >
                            <MdOutlineSignalWifiStatusbar4Bar className="mr-2" />
                            Waiver Status
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>

                  <li className="main_menu relative">
                    <button
                      className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                      onClick={() => toggleSubmenu(4)}
                    >
                      <span className="flex items-center">Escalations</span>
                      {submenuOpen[4] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {submenuOpen[4] && (
                      <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/opened-escalation"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Opened Escalations
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/closed-escalation"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Closed Escalations ( with penalty )
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/normal-closed-escalation"
                            className="flex items-center"
                          >
                            <FaCodePullRequest className="mr-2" />
                            Closed Escalations ( normal )
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                </>
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
      )}
    </>
  );
}

export default NavBar;
