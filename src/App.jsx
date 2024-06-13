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
import Users from './Users';
import AddUser from './AddUser';
import Profile from './Profile';

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
        <Route path="/UploadMasterData" element={<PrivateRoute isAuthenticated={isAuthenticated}><UploadMasterData /></PrivateRoute>} />
        <Route path="/duration" element={<PrivateRoute isAuthenticated={isAuthenticated}><Main /></PrivateRoute>} />
        <Route path="/state" element={<PrivateRoute isAuthenticated={isAuthenticated}><State /></PrivateRoute>} />
        <Route path="/city" element={<PrivateRoute isAuthenticated={isAuthenticated}><City /></PrivateRoute>} />
        <Route path="/pincode" element={<PrivateRoute isAuthenticated={isAuthenticated}><PinCode /></PrivateRoute>} />
        <Route path="/CollectionAmount" element={<PrivateRoute isAuthenticated={isAuthenticated}><CollectionAmount /></PrivateRoute>} />
        <Route path="/StateTest" element={<PrivateRoute isAuthenticated={isAuthenticated}><StateTest /></PrivateRoute>} />
        <Route path="/Master" element={<PrivateRoute isAuthenticated={isAuthenticated}><Master /></PrivateRoute>} />
        <Route path="/Users" element={<PrivateRoute isAuthenticated={isAuthenticated}><Users /></PrivateRoute>} />
        <Route path="/AddUser" element={<PrivateRoute isAuthenticated={isAuthenticated}><AddUser /></PrivateRoute>} />
        <Route path="/Profile" element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile /></PrivateRoute>} />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
