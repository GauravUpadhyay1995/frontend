import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import NavProvider from "./HeaderContext";
import AuthProvider from "./AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NavProvider>
        <App />
      </NavProvider>
    </AuthProvider>
  </React.StrictMode>
);
