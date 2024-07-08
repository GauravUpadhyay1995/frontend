import React from 'react'
import DashboardHeader from './DashboardHeader'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import NavProvider from './HeaderContext'
import NavBar from './NavBar'


const Layout = () => {
  
    return (
        <>
            
            <DashboardHeader />
            
            <div className="container mx-auto px-4 py-4">
                
                <Outlet />
            </div>
           
       

        </>
    )
}

export default Layout
