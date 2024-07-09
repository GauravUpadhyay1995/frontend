import React, { useContext } from "react";
import DashboardHeader from "./DashboardHeader";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import NavProvider from "./HeaderContext";
import NavBar from "./NavBar";
import { AuthContext } from "./AuthContext";
import ThemeContext from "./ThemeContext";

const Layout = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <>
      <div className="flex ">
        <NavBar setIsAuthenticated={setIsAuthenticated} />
        <div className={`flex-col w-full`}>
          <DashboardHeader />
          <div className="container mx-auto px-4 py-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
