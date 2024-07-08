import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Navbar from "./NavBar";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Dashboard";
import UploadMasterData from "./UploadMasterData";
import SuperAdminEmployeeList from "./SuperAdminEmployeeList";
import AddNbfc from "./AddNbfc";
import AddSuperAdminEmployee from "./AddSuperAdminEmployee";
import NbfcList from "./NbfcList";
import AddAgency from "./AddAgency";
import AddNbfcEmployee from "./AddNbfcEmployee";
import NbfcEmployeeList from "./NbfcEmployeeList";
import AddProducts from "./AddProducts";
import Products from "./Products";
import AddWaiverRule from "./AddWaiverRule";
import AddWaiverRequest from "./AddWaiverRequest";
import WaiverList from "./WaiverList";
import WaiverRequests from "./WaiverRequests";
import WaiverDetails from "./WaiverDetails";
import ApprovedWaiverDetails from "./ApprovedWaiverDetails";
import RejectedWaiverDetails from "./RejectedWaiverDetails";
import Mytable from "./Mytable";
import Statewise from "./Statewise";
import Citywise from "./Citywise";
import Pinwise from "./Pinwise";
import AddCommercialRule from "./AddCommercialRule";
import ListCommercialRules from "./ListCommercialRules";
import InvoiceForNBFC from "./InvoiceForNBFC";
import AddAgencyEmployee from "./AddAgencyEmployee";
import AgencyEmployeeList from "./AgencyEmployeeList";
import AgencyList from "./AgencyList";
import Master from "./MasterTab";
import Profile from "./Profile";
import Layout from "./Layout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  const [userRole, setUserRole] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.type || "";
    }
    return "";
  });

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserRole(decoded.type);
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="bg-gray-100 bg-cover bg-center min-h-screen">
      <BrowserRouter>
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        <Routes>
          {isAuthenticated ? (
            <Route path="/login" element={<Navigate to="/" />} />
          ) : (
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
          )}
          <Route path="/" element={<Layout />}>
            <Route
              path=""
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {userRole === "super admin" && (
              <>
                <Route
                  path="/add-nbfc"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddNbfc />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-agency"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddAgency />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-super-admin-employee"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddSuperAdminEmployee />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/super-admin-employee-list"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <SuperAdminEmployeeList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/nbfc-list"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <NbfcList />
                    </PrivateRoute>
                  }
                />
              </>
            )}
            {userRole === "nbfc" && (
              <>
                <Route
                  path="/add-nbfc-employee"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddNbfcEmployee />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/nbfc-employee-list"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <NbfcEmployeeList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/nbfc-list"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <NbfcList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-agency"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddAgency />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/agency-list"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AgencyList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/upload-master-data"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <UploadMasterData />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/data"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Mytable />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/state-wise"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Statewise />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/city-wise"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Citywise />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/pin-wise"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Pinwise />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-products"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddProducts />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Products />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-waiver-rule"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddWaiverRule />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-waiver-request"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddWaiverRequest />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/waiver-list"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <WaiverList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/waiver-requests"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <WaiverRequests />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/show-waiver-details/:id"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <WaiverDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/waiver-rules"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <WaiverRules />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/approved-waiver-details/:id"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <ApprovedWaiverDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/rejected-waiver-details/:id"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <RejectedWaiverDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-commercial-rule"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddCommercialRule />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/list-commercial-rules"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <ListCommercialRules />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/invoice-for-nbfc"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <InvoiceForNBFC />
                    </PrivateRoute>
                  }
                />
              </>
            )}
            {userRole === "agency" && (
              <>
                <Route
                  path="/add-agency-employee"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddAgencyEmployee />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/agency-employee-list"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AgencyEmployeeList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/agency-list"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AgencyList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/waiver-list"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <WaiverList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-waiver-request"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <AddWaiverRequest />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/master"
                  element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Master />
                    </PrivateRoute>
                  }
                />
              </>
            )}
            <Route
              path="/profile"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
