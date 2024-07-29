import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import NavProvider from "./HeaderContext";
import AuthProvider from "./AuthContext.jsx";
import { ThemeProvider } from "./ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <ThemeProvider>
      <AuthProvider>
        <NavProvider>
          <App />
        </NavProvider>
      </AuthProvider>
    </ThemeProvider>
  
);
