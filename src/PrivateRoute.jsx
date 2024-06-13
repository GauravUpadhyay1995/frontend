import { Navigate } from 'react-router-dom';

function PrivateRoute({ isAuthenticated, children }) {
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
