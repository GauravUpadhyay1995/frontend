import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { jwtDecode } from 'jwt-decode';
import UserType from './UserType';
import SweetAlert2 from './SweetAlert2';

const Navbar = ({ setIsAuthenticated }) => {
    const showAlert = (data) => {
        return SweetAlert2(data);
    };

    const handleLogout = async () => {
        const result = await showAlert({ type: 'confirm',text:"Logout?",title:"Are you sure!!!" });

        if (result.isConfirmed) {
            localStorage.clear();
            setIsAuthenticated(false);
            navigate('/login');
        } else {
            // If user canceled the logout, you can add any additional logic here if needed
            console.log('Logout canceled');
        }
    };
    const userData = UserType();
    useEffect(() => {
    }, [userData]);


    const navigate = useNavigate(); // Use the useNavigate hook
    const { pathname } = useLocation();
    const isActive = (path) => {
        return path === '/' ? pathname === path : pathname.startsWith(path);
    };
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const navbarRef = useRef(null);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target)) {
            setIsOpen(false);
            setOpenSubmenu(null);
        }
    };



    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };
    const Level = userData?.type === "super admin" ? "Nbfc" : (userData?.type == "nbfc" ? "Agency" : "Employee")
    return (
        <div className="flex flex-col h-full relative">
            <button
                className="bg-gray-800 text-white p-2 text-xl sticky-button"
                onClick={toggleNavbar}
            >
                ☰
            </button>

            <nav
                ref={navbarRef}
                className={`z-50 text-white fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 transform transition-transform duration-100 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <ul className="space-y-4">
                    <li className='main_menu'>
                        <button onClick={() => toggleSubmenu(1)}>{userData?.type === "super admin" ? 'SUPER ADMIN' : 'Geographical'}</button>
                        <ul className={`submenu ml-4 ${openSubmenu === 1 ? 'block' : 'hidden'}`}>
                            {(userData?.type === "agency" || userData?.type === "nbfc" || userData?.type === "super admin") && (
                                <li><NavLink to="/AddUser" className="">Add {Level}</NavLink></li>)}
                            {userData?.type === "nbfc" && (
                                <li className=''><NavLink to="/UploadMasterData" className="">Upload Master Data</NavLink></li>)}

                            {userData?.type === "agency" && (
                                <li><NavLink to="/Master" className="">Master</NavLink></li>)}

                            {(userData?.type === "agency" || userData?.type === "nbfc" || userData?.type === "super admin") && (
                                <li><NavLink to="/Users" className="">{Level} List</NavLink></li>)}





                        </ul>
                    </li>
                    <li className=''>

                        <button type="button" onClick={handleLogout} style={{ cursor: 'pointer' }} className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Logout</button>
                        <button type="button" style={{ cursor: 'pointer' }} className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"><NavLink to="/Profile" className="">Profile</NavLink></button>

                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
