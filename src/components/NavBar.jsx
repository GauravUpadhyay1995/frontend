import React, { useState, useEffect, useRef } from "react";
import UserType from "./UserType";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navigationbar.css";
import UploadModal from "./allocations/UploadModal";
import { useNavContext } from "./HeaderContext";
import { BsFillGeoFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { GiEscalator } from "react-icons/gi";
import { MdOutlinePayment } from "react-icons/md";
import { RiPhoneFindLine } from "react-icons/ri";
import { MdCloudUpload } from "react-icons/md";
import { TbMapPinCode } from "react-icons/tb";
import { LiaCitySolid } from "react-icons/lia";
import { MdDiscount } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegListAlt } from "react-icons/fa";
import { IoIosOpen } from "react-icons/io";
import { FaRegClosedCaptioning } from "react-icons/fa6";
import { RiAiGenerate } from "react-icons/ri";
import { RiFindReplaceLine } from "react-icons/ri";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { MdAssignmentTurnedIn } from "react-icons/md";
import {
  FaBars,
  FaUser,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaListAlt,
  FaCity,
} from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { Md123, MdOutlineSignalWifiStatusbar4Bar } from "react-icons/md";
import { FaCodePullRequest } from "react-icons/fa6";
import SweetAlert2 from "./SweetAlert2";

function NavBar({ setIsAuthenticated }) {
  const [submenuOpen, setSubmenuOpen] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { navOpen, setNavOpen } = useNavContext();

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
    const mediaQuery = window.matchMedia(
      "(max-width: 912px) and (max-height: 1368px)"
    );

    const handleClickOutside = (event) => {
      if (
        mediaQuery.matches &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setNavOpen(false);
      }
    };

    const handleMediaChange = (event) => {
      if (event.matches) {
        setNavOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setNavOpen]);

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
      {navOpen && (
        <div
          ref={navRef}
          className="h-full w-64 p-2 md:p-4 z-50 flex flex-col text-white  hide-scrollbar overflow-auto bg-[#212233] border-r border-gray-700 absolute sm:relative md:absolute lg:relative xl:relative"
          style={{ backgroundColor: "#212233", borderRight: "1px solid gray" }}
        >
          <div className="profile flex items-center mb-4">
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
                  className="w-full text-left p-2 bg-gray-700 rounded flex items-center  justify-between"
                  onClick={() => toggleSubmenu(1)}
                >
                  <span className="flex items-center gap-11 lg:gap-5">
                    <BsFillGeoFill className="text-2xl" />
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
                            to="/state-wise"
                            className="flex items-center gap-2"
                          >
                            <LiaCitySolid />
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
                          <NavLink
                            to="/pin-wise"
                            className="flex items-center gap-2"
                          >
                            <TbMapPinCode /> PIN
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
                  <FaUsers className="text-2xl" />{" "}
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
                            className="flex items-center gap-2"
                          >
                            <IoIosAddCircleOutline className="text-2xl" />
                            Add Agency
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/agency-list"
                            className="flex items-center gap-2"
                          >
                            <FaRegListAlt className="text-2xl" />
                            List Agency
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-nbfc-employee"
                            className="flex items-center gap-2"
                          >
                            <IoIosAddCircleOutline className="text-2xl" />
                            Add Employee
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/nbfc-employee-list"
                            className="flex items-center gap-2"
                          >
                            <FaRegListAlt className="text-2xl" />
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
                      <IoSettings className="text-2xl" />{" "}
                      <span className="flex items-center">Settings</span>
                      {submenuOpen[3] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {submenuOpen[3] && (
                      <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-waiver-rule"
                            className="flex items-center gap-4 lg:gap-2"
                          >
                            <IoIosAddCircleOutline className="text-2xl" />
                            Add Waiver Rule
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/waiver-rules"
                            className="flex items-center gap-6 lg:gap-2"
                          >
                            <MdDiscount />
                            Waiver Rules
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/waiver-requests"
                            className="flex items-center gap-6 lg:gap-2"
                          >
                            <MdDiscount />
                            Waiver Requests
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-commercial-rule"
                            className="flex items-center gap-4 lg:gap-2"
                          >
                            <IoIosAddCircleOutline className="text-2xl" />
                            Add Commercial Rule
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/list-commercial-rules"
                            className="flex items-center gap-4 lg:gap-2"
                          >
                            <FaRegListAlt className="text-2xl" />
                            List Commercial Rules
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-products"
                            className="flex items-center gap-4 lg:gap-2"
                          >
                            <IoIosAddCircleOutline className="text-2xl" />
                            Add Products
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/products"
                            className="flex items-center gap-6 lg:gap-2"
                          >
                            <FaRegListAlt className="text-2xl lg:text-1xl" />
                            List Products
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
                      <GiEscalator className="text-2xl" />{" "}
                      <span className="flex items-center">Escalations</span>
                      {submenuOpen[4] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {submenuOpen[4] && (
                      <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/add-escalation"
                            className="flex items-center gap-2"
                          >
                            <IoIosAddCircleOutline className="text-2xl" />
                            Raise Escalations
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/opened-escalation"
                            className="flex items-center gap-2"
                          >
                            <IoIosOpen className="text-2xl" />
                            Opened Escalations
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/closed-escalation"
                            className="flex items-center gap-2"
                          >
                            <FaRegClosedCaptioning className="text-4xl" />
                            Closed Escalations ( with penalty )
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/normal-closed-escalation"
                            className="flex items-center gap-2"
                          >
                            <FaRegClosedCaptioning className="text-4xl" />
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
                      <MdOutlinePayment className="text-3xl" />
                      <span className="flex items-center gap-2 lg:ml-7">
                        Payments & Invoices
                      </span>
                      {submenuOpen[5] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {submenuOpen[5] && (
                      <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/invoice-for-nbfc"
                            className="flex items-center gap-2"
                          >
                            <RiAiGenerate className="text-2xl" />
                            Generate Invoice
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/payments"
                            className="flex items-center gap-2"
                          >
                            <IoIosAddCircleOutline className="text-2xl" />
                            Payments
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>

                  <li className="main_menu relative">
                    <button
                      className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                      onClick={() => toggleSubmenu(6)}
                    >
                      <RiPhoneFindLine className="text-2xl" />
                      <span className="flex items-center">Client Finder</span>
                      {submenuOpen[6] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {submenuOpen[6] && (
                      <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/client-finder"
                            className="flex items-center gap-2"
                          >
                            <RiFindReplaceLine className="text-2xl" />
                            Find Client
                          </NavLink>
                        </li>
                        <li
                          className="relative p-2 pl-6 hover:bg-gray-600  flex gap-2 items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500 cursor-pointer"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <FaCloudUploadAlt className="text-2xl" />
                          Upload Client
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className="main_menu relative">
                    <button
                      className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                      onClick={() => toggleSubmenu(7)}
                    >
                      <MdCloudUpload className="text-2xl" />
                      <span className="flex items-center">Upload Files</span>
                      {submenuOpen[7] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {submenuOpen[7] && (
                      <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/upload-master-data"
                            className="flex items-center gap-2"
                          >
                            <MdPayment className="text-2xl" />
                            Paid Data
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/assigned-data"
                            className="flex items-center gap-2"
                          >
                            <MdAssignmentTurnedIn className="text-2xl" />
                            Assigned Data
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

                  <li className="main_menu relative">
                    <button
                      className="w-full text-left p-2 bg-gray-700 rounded flex items-center justify-between"
                      onClick={() => toggleSubmenu(7)}
                    >
                      <span className="flex items-center">Upload Files</span>
                      {submenuOpen[7] ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    {submenuOpen[7] && (
                      <ul className="submenu ml-4 mt-2 bg-gray-700 rounded shadow-lg">
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/upload-master-data"
                            className="flex items-center"
                          >
                            <FaCloudUploadAlt className="mr-2" />
                            Paid Data
                          </NavLink>
                        </li>
                        <li className="relative p-2 pl-6 hover:bg-gray-600 flex items-center before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gray-500">
                          <NavLink
                            to="/assigned-data"
                            className="flex items-center"
                          >
                            <FaCloudUploadAlt className="mr-2" />
                            Assigned Data
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                </>
              )}
              {userData?.type === "employee" && (
                <>
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
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default NavBar;
