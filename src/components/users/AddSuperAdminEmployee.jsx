import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { Loader } from "../Loader";
import axios from "../../utils/apiclient";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";
import UserType from "../UserType";
import SweetAlert2 from "../SweetAlert2";

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
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      setLoading(false);
      hasMounted.current = true;
    }
  }, []);

  const HandleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // const requestData = new FormData();
    // requestData.append('nbfc_name', name);
    // requestData.append('email', email);
    // requestData.append('password', password);
    // requestData.append('type', 'super admin');
    const requestData = {
      nbfc_name: name,
      email: email,
      password: password,
      type: "super admin",
    };
    try {
      const response = await axios.post(
        "api/users/addSuperAdminEmployee",
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
          <div className="container mx-auto  mb-7">
            <div className="w-full">
              <div className="bg-white shadow-md rounded-lg p-4 border-2 border-gray-300 border-solid pt-0">
                <div className="bg-gray-200 rounded-t-md border-b pb-2 pt-3 pl-4 mb-4 -mx-4">
                  <strong>Basic Information</strong>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div>
                    <label
                      className="block text-gray-700 pl-2 mb-2"
                      htmlFor="Name"
                    >
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border "
                      id="agency_name"
                      type="text"
                      placeholder="Employee Name"
                    />
                    {/* {errors.registered_address && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.registered_address}
                      </div>
                    )} */}
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 pl-2 mb-2"
                      htmlFor="email"
                    >
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border "
                      id="email"
                      type="text"
                      placeholder="Email"
                    />
                    {/* {errors.office_address && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.office_address}
                      </div>
                    )} */}
                  </div>
                  <div>
                    <label
                      className="block pl-2 text-gray-700 mb-2"
                      htmlFor="password"
                    >
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full p-2 border border-gray-300 rounded-md`}
                      id="password"
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-500 text-white font-bold py-3 px-10 rounded-md  shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <div className=" justify-center items-center h-screen">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h3 style={{ color: "green", margin: "20px" }}>BASIC INFO</h3>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="agency_name"
                  >
                    Name <span>*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="agency_name"
                    type="text"
                    placeholder="Employee Name"
                  />
                </div>
                <div className="w-full md:w-1/4 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="email"
                  >
                    Email <span>*</span>
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="email"
                    type="text"
                    placeholder="Email"
                  />
                </div>
                <div className="w-full md:w-1/4 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="password"
                  >
                    Password <span>*</span>
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="password"
                    type="passsword"
                    placeholder="Password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Save
              </button>
            </div>
          </div> */}
        </form>
      )}
    </>
  );
};

export default App;
