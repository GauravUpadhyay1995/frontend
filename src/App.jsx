import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from './CallReport';
import State from './State';
import City from './City';
import PinCode from './Pincode';
import UploadMasterData from './UploadMasterData';
import Navbar from './NavBar';
import CollectionAmount from './CollectionAmount';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import Dashboard from './Dashboard';
import StateTest from './StateTest';
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token; // Convert the token value to a boolean
  });

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}

      <Routes>
        {isAuthenticated ? (
          <Route path="/login" element={<Navigate to="/" />} />
        ) : (
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        )}

        <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated}><Dashboard /></PrivateRoute>} />
        <Route path="/AddNbfc" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddNbfc /></PrivateRoute>} />
        <Route path="/AddAgency" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddAgency /></PrivateRoute>} />
        <Route path="/AddSuperAdminEmployee" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddSuperAdminEmployee /></PrivateRoute>} />
        <Route path="/AddNbfcEmployee" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddNbfcEmployee /></PrivateRoute>} />
        <Route path="/AddAgencyEmployee" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddAgencyEmployee /></PrivateRoute>} />

        <Route path="/UploadMasterData" element={<PrivateRoute isAuthenticated={isAuthenticated}><UploadMasterData /></PrivateRoute>} />
        <Route path="/duration" element={<PrivateRoute isAuthenticated={isAuthenticated}><Main /></PrivateRoute>} />
        <Route path="/state" element={<PrivateRoute isAuthenticated={isAuthenticated}><State /></PrivateRoute>} />
        <Route path="/city" element={<PrivateRoute isAuthenticated={isAuthenticated}><City /></PrivateRoute>} />
        <Route path="/pincode" element={<PrivateRoute isAuthenticated={isAuthenticated}><PinCode /></PrivateRoute>} />
        <Route path="/CollectionAmount" element={<PrivateRoute isAuthenticated={isAuthenticated}><CollectionAmount /></PrivateRoute>} />
        <Route path="/StateTest" element={<PrivateRoute isAuthenticated={isAuthenticated}><StateTest /></PrivateRoute>} />
        <Route path="/Master" element={<PrivateRoute isAuthenticated={isAuthenticated}><Master /></PrivateRoute>} />
        <Route path="/NbfcList" element={<PrivateRoute isAuthenticated={isAuthenticated}><NbfcList /></PrivateRoute>} />
        <Route path="/AgencyList" element={<PrivateRoute isAuthenticated={isAuthenticated}><AgencyList /></PrivateRoute>} />
        <Route path="/SuperAdminEmployeeList" element={<PrivateRoute isAuthenticated={isAuthenticated}><SuperAdminEmployeeList /></PrivateRoute>} />
        
        <Route path="/NbfcEmployeeList" element={<PrivateRoute isAuthenticated={isAuthenticated}><NbfcEmployeeList /></PrivateRoute>} />
        <Route path="/AgencyEmployeeList" element={<PrivateRoute isAuthenticated={isAuthenticated}><AgencyEmployeeList /></PrivateRoute>} />

        <Route path="/Profile" element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile /></PrivateRoute>} />
        <Route path="/AddProducts" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddProducts /></PrivateRoute>} />

        <Route path="/Products" element={<PrivateRoute isAuthenticated={isAuthenticated}><Products /></PrivateRoute>} />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
