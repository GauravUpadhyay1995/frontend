import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/apiclient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import DashboardHeader from "./DashboardHeader";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post("/api/users/userLogin", requestData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-3xl rounded-lg shadow-md bg-gray-800 p-0 flex flex-col md:flex-row justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex flex-col items-center p-9 w-full md:w-1/2 relative">
              <div className="flex flex-col relative right-20">
                <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
                <p className="text-sm text-gray-400 mb-5">
                  Sign In to your account
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={email}
                    onChange={(e) => {
                      setError(null)
                      setEmail(e.target.value);
                    }}
                    className="block pl-10 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Username"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block pl-10 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Password"
                  />
                </div>
                {error && (
                  <div className="absolute bottom-28 left-10 w-full text-red-500 text-sm mt-2">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Login
                </button>
              </form>
              <a
                href="#"
                className="text-sm text-gray-400 mt-4 hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>

            <div className="w-full md:w-1/2 relative hidden md:block">
              <div className="h-64 md:h-full">
                <img
                  src="https://images.pexels.com/photos/159839/office-home-house-desk-159839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  className="w-full h-full object-cover rounded-tr-lg md:rounded-tr-none rounded-br-lg"
                  alt="office"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
