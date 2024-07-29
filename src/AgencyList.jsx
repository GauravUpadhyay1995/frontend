import { useEffect, useState } from "react";
import axios from "./utils/apiclient";
import CustomTable from "./Table";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import { downloadExcel } from "./DownLoadExcell";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { format } from "date-fns";
import UserType from "./UserType";
import SweetAlert2 from "./SweetAlert2";
import { useNavigate } from "react-router-dom";

// Ensure correct import path

function App() {
  const showAlert = (data) => {
    SweetAlert2(data);
  };


  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize to true
  const userData = UserType();

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setLoading(false);
      getDATA();
    }
  }, [userData]);

  const getToken = () => localStorage.getItem("token");
  const getDATA = async () => {
    if (!userData) return; // Ensure userData is not null
    setLoading(true);
    const userApi = "api/users/getAgency";
    try {
      const response = await axios.post(
        userApi,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setLogs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

 const getDetails = async (id) => {
   const user = logs.find((log) => log.id === id);
   if (user) {
     if (user.isApproved === 1) {
       navigate(`/User-Details/${id}`);
     } else {
       showAlert({ type: "warning", title: "User is not approved yet." });
     }
   }
 };


  const handleAction = async (data, status) => {
    try {
      const response = await axios.post(
        "api/users/approveUser",
        { userId: data.id, status: status },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setLoading(false);
      if (response.data.success === true) {
        showAlert({ type: "success", title: response.data.message });
      }
      getDATA();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.nbfc_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.isActive === 1 ? "Active" : "Inactive"),
      sortable: true,
    },

    {
      name: "Approval Status",
      cell: (row) => (
        <button
          className={`focus:outline-none text-white bg-${
            row.isApproved === 1 ? "green" : "red"
          }-700 hover:bg-${
            row.isApproved === 1 ? "green" : "red"
          }-800 focus:ring-4 focus:ring-${
            row.isApproved === 1 ? "green" : "red"
          }-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2`}
          onClick={() => handleAction(row, row.isApproved === 1 ? 0 : 1)}
        >
          {row.isApproved === 1 ? "Approved" : "Pending"}
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "UserType",
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: "Creation Date",
      selector: (row) =>
        format(new Date(row.created_date), "dd/MM/yyyy hh:mm a"),
      sortable: true,
    },
    {
      name: "Details",
      cell: (row) => (
        <button
          className="focus:outline-none text-white bg-green-800 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-1.5 mb-1"
          onClick={() => getDetails(row.id)}
        >
          Get Details
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      <div className="w-full -mt-7 ">
        <div className="container mx-auto my-8 p-4 bg-white border rounded-lg shadow-lg">
          <Tabs>
            <TabPanel>
              <CustomTable
                data={logs}
                columns={columns}
                loading={loading}
                tableName={"Agents"}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default App;
