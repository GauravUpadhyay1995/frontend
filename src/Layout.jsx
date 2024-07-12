import React, { useContext } from "react";
import DashboardHeader from "./DashboardHeader";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { AuthContext } from "./AuthContext";
import ThemeContext from "./ThemeContext";
import "./Navigationbar.css";

const Layout = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <>
      <div className="flex h-screen">
        <NavBar setIsAuthenticated={setIsAuthenticated} />
        <div className="flex flex-col w-full">
          <DashboardHeader />
          <div className="container mx-auto px-4 py-4 mt-2 hide-scrollbar overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
