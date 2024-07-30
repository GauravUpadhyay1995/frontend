import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { Loader } from "../Loader";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";
import UserType from "../UserType";
import SweetAlert2 from "../SweetAlert2";
import Select from "react-select";

// http://localhost:5000/api/users/testing
const App = () => {
  const showAlert = (data) => {
    SweetAlert2(data);
  };
  const getToken = () => localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);
  const hasMounted = useRef(false);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!hasMounted.current) {
      setLoading(false);
      hasMounted.current = true;
    }
  }, []);

  const customStyles = (hasError) => ({
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.isFocused ? null : null,
      padding: "0.3rem",
      marginTop: "1px",
      borderColor: hasError ? "red" : provided.borderColor,
      "&:hover": {
        borderColor: hasError ? "red" : provided.borderColor,
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
  });

  const handleValidations = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is Required";
    if (!email.trim()) newErrors.email = "Email is Required";
    if (!password.trim()) newErrors.password = "Password is Required";
    if (!role) newErrors.role = "Role is Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const GetRoles = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          "/api/users/getRoles",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const rolesData = response.data.data.map((role) => {
          return { value: role.id, label: role.role };
        });
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    GetRoles();
  }, []);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidations()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const requestData = {
      nbfc_name: name,
      email: email,
      password: password,
      type: "nbfc",
      role: role.value,
    };
    try {
      const response = await axios.post(
        "api/users/addNbfcEmployee",
        requestData,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (response.data.success === true) {
        showAlert({ type: "success", title: response.data.message });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response.data.success === false) {
        showAlert({ type: "error", title: error.response.data.message });
      }
    }
  };

  const userData = UserType();
  useEffect(() => {}, [userData]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={HandleSubmit} encType="multipart/form-data">
          <div className="container mx-auto mb-7">
            <div className="w-full mt-2 py-8 px-5">
              <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0">
                <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
                  <strong>Contact Information</strong>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div>
                    <label
                      className="block text-gray-700 pl-2 mb-2"
                      htmlFor="agency_name"
                    >
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      className={`w-full p-3 border ${
                        errors.name ? "border-red-700" : "border-gray-300"
                      } rounded-md`}
                      value={name}
                      onChange={(e) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          name: null,
                        }));
                        setName(e.target.value);
                      }}
                      id="agency_name"
                      type="text"
                      placeholder="Employee Name"
                    />
                    {errors.name && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 pl-2 mb-2"
                      htmlFor="corporateaddress"
                    >
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      className={`w-full p-3 border ${
                        errors.email ? "border-red-700" : "border-gray-300"
                      } rounded-md`}
                      value={email}
                      onChange={(e) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          email: null,
                        }));
                        setEmail(e.target.value);
                      }}
                      id="email"
                      type="text"
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block pl-2 text-gray-700 mb-2">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      className={`w-full p-3 border ${
                        errors.password ? "border-red-700" : "border-gray-300"
                      } rounded-md`}
                      value={password}
                      onChange={(e) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          password: null,
                        }));
                        setPassword(e.target.value);
                      }}
                      id="password"
                      type="password"
                      placeholder="Password"
                    />
                    {errors.password && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block pl-2 text-gray-700 mb-2">
                      Role <span className="text-red-600">*</span>
                    </label>
                    <Select
                      closeMenuOnSelect={false}
                      value={role}
                      onChange={(selectedOption) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          role: null,
                        }));
                        setRole(selectedOption);
                      }}
                      options={roles}
                      styles={customStyles(errors.role)}
                      className="w-full"
                      placeholder="Select Type"
                    />
                    {errors.role && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.role}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end -mt-8">
            <button
              type="submit"
              className="focus:outline-none text-white bg-indigo-500 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm py-3 px-14 dark:focus:ring-green-800"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default App;
