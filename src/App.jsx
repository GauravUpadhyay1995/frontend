import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import UploadMasterData from './UploadMasterData';
import Navbar from './NavBar';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import Dashboard from './Dashboard';
import Master from './MasterTab';
import NbfcList from './NbfcList';
import AgencyList from './AgencyList';
import SuperAdminEmployeeList from './SuperAdminEmployeeList';
import AgencyEmployeeList from './AgencyEmployeeList';
import NbfcEmployeeList from './NbfcEmployeeList';
import AddAgencyEmployee from './AddAgencyEmployee';
import AddNbfc from './AddNbfc';
import AddSuperAdminEmployee from './AddSuperAdminEmployee';
import AddNbfcEmployee from './AddNbfcEmployee';
import AddAgency from './AddAgency';
import Profile from './Profile';
import AddProducts from './AddProducts';
import Products from './Products';
import AddWaiverRule from './AddWaiverRule';
import AddWaiverRequest from './AddWaiverRequest';
import WaiverList from './WaiverList';
import WaiverRules from './WaiverRules';
import WaiverDetails from './WaiverDetails';
import WaiverRequests from './WaiverRequests';
import RejectedWaiverDetails from "./RejectedWaiverDetails";
import ApprovedWaiverDetails from "./ApprovedWaiverDetails";
import Mytable from './Mytable';
import Statewise from './Statewise';
import Citywise from './Citywise';
import Pinwise from './Pinwise';
import AddCommercialRule from './AddCommercialRule';
import ListCommercialRules from './ListCommercialRules';
import InvoiceForNBFC from './InvoiceForNBFC';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  const [userRole, setUserRole] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      return decoded.type || '';
    }
    return '';
  });

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUserRole(decoded.type);

      }
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col bg-[url('https://static.vecteezy.com/system/resources/previews/021/171/658/large_2x/colorful-abstract-wallpaper-modern-background-ai-generated-free-photo.jpg')] bg-cover bg-center min-h-screen">
    <BrowserRouter>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}

      <Routes>
        {isAuthenticated ? (
          <Route path="/login" element={<Navigate to="/" />} />
        ) : (
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        )}

        <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated}><Dashboard /></PrivateRoute>} />

        {userRole === 'super admin' && (
          <>
            <Route path="/AddNbfc" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddNbfc /></PrivateRoute>} />
            <Route path="/AddAgency" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddAgency /></PrivateRoute>} />
            <Route path="/AddSuperAdminEmployee" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddSuperAdminEmployee /></PrivateRoute>} />
            <Route path="/SuperAdminEmployeeList" element={<PrivateRoute isAuthenticated={isAuthenticated}><SuperAdminEmployeeList /></PrivateRoute>} />
            <Route path="/NbfcList" element={<PrivateRoute isAuthenticated={isAuthenticated}><NbfcList /></PrivateRoute>} />
          </>
        )}

        {userRole === 'nbfc' && (
          <>
            <Route path="/AddNbfcEmployee" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddNbfcEmployee /></PrivateRoute>} />
            <Route path="/NbfcEmployeeList" element={<PrivateRoute isAuthenticated={isAuthenticated}><NbfcEmployeeList /></PrivateRoute>} />
            <Route path="/NbfcList" element={<PrivateRoute isAuthenticated={isAuthenticated}><NbfcList /></PrivateRoute>} />
            <Route path="/AddAgency" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddAgency /></PrivateRoute>} />
            <Route path="/AgencyList" element={<PrivateRoute isAuthenticated={isAuthenticated}><AgencyList /></PrivateRoute>} />
            <Route path="/UploadMasterData" element={<PrivateRoute isAuthenticated={isAuthenticated}><UploadMasterData /></PrivateRoute>} />
            <Route path="/data" element={<PrivateRoute isAuthenticated={isAuthenticated}><Mytable /></PrivateRoute>} />
            <Route path="/statewise" element={<PrivateRoute isAuthenticated={isAuthenticated}><Statewise /></PrivateRoute>} />
            <Route path="/citywise" element={<PrivateRoute isAuthenticated={isAuthenticated}><Citywise /></PrivateRoute>} />
            <Route path="/pinwise" element={<PrivateRoute isAuthenticated={isAuthenticated}><Pinwise /></PrivateRoute>} />

            <Route path="/AddProducts" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddProducts /></PrivateRoute>} />
            <Route path="/Products" element={<PrivateRoute isAuthenticated={isAuthenticated}><Products /></PrivateRoute>} />
            <Route path="/AddWaiverRule" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddWaiverRule /></PrivateRoute>} />
            <Route path="/AddWaiverRequest" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddWaiverRequest /></PrivateRoute>} />
            <Route path="/WaiverList" element={<PrivateRoute isAuthenticated={isAuthenticated}><WaiverList /></PrivateRoute>} />
            <Route path="/WaiverRequests" element={<PrivateRoute isAuthenticated={isAuthenticated}><WaiverRequests /></PrivateRoute>} />
            <Route path="/showWaiverDetails/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><WaiverDetails /></PrivateRoute>} />

            <Route path="/WaiverRules" element={<PrivateRoute isAuthenticated={isAuthenticated}><WaiverRules /></PrivateRoute>} />

            <Route path="/ApprovedWaiverDetails/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><ApprovedWaiverDetails /></PrivateRoute>} />
            <Route path="/RejectedWaiverDetails/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><RejectedWaiverDetails /></PrivateRoute>} />
            
            <Route path="/AddCommercialRule" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddCommercialRule /></PrivateRoute>} />
            <Route path="/ListCommercialRules" element={<PrivateRoute isAuthenticated={isAuthenticated}><ListCommercialRules /></PrivateRoute>} />
            <Route path="/InvoiceForNBFC" element={<PrivateRoute isAuthenticated={isAuthenticated}><InvoiceForNBFC /></PrivateRoute>} />

          </>
        )}

        {userRole === 'agency' && (
          <>

            <Route path="/AddAgencyEmployee" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddAgencyEmployee /></PrivateRoute>} />
            <Route path="/AgencyEmployeeList" element={<PrivateRoute isAuthenticated={isAuthenticated}><AgencyEmployeeList /></PrivateRoute>} />
            <Route path="/AgencyList" element={<PrivateRoute isAuthenticated={isAuthenticated}><AgencyList /></PrivateRoute>} />
            <Route path="/WaiverList" element={<PrivateRoute isAuthenticated={isAuthenticated}><WaiverList /></PrivateRoute>} />
            <Route path="/AddWaiverRequest" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddWaiverRequest /></PrivateRoute>} />
            <Route path="/Master" element={<PrivateRoute isAuthenticated={isAuthenticated}><Master /></PrivateRoute>} />
          </>
        )}

        {/*        {userRole === 'employee' && (
          <>


          </>
        )} */}


        {/*     <Route path="/duration" element={<PrivateRoute isAuthenticated={isAuthenticated}><Main /></PrivateRoute>} />
        <Route path="/state" element={<PrivateRoute isAuthenticated={isAuthenticated}><State /></PrivateRoute>} />
        <Route path="/city" element={<PrivateRoute isAuthenticated={isAuthenticated}><City /></PrivateRoute>} />
        <Route path="/pincode" element={<PrivateRoute isAuthenticated={isAuthenticated}><PinCode /></PrivateRoute>} />
        <Route path="/CollectionAmount" element={<PrivateRoute isAuthenticated={isAuthenticated}><CollectionAmount /></PrivateRoute>} />
        <Route path="/StateTest" element={<PrivateRoute isAuthenticated={isAuthenticated}><StateTest /></PrivateRoute>} /> */}

        <Route path="/Profile" element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;






































