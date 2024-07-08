import React, { useContext } from 'react'
import DashboardHeader from './DashboardHeader'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import NavProvider from './HeaderContext'
import NavBar from './NavBar'
import { AuthContext } from "./AuthContext";

const Layout = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    return (
        <>
        <NavProvider>
            <div className="flex">
                <NavBar className="w-64 bg-gray-800 text-white" setIsAuthenticated = {setIsAuthenticated}/>
                <div className="flex flex-col flex-grow">
                    <DashboardHeader />
                    <div className="flex-grow p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </NavProvider>
        
        </>
    )
}

export default Layout
