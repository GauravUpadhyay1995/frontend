import { useEffect, useState } from "react";
import axios from "./utils/apiclient";
import CustomTable from "../Table";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
import { downloadExcel } from "../DownLoadExcell";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { format } from "date-fns";
import UserType from "../UserType";
import { jwtDecode } from "jwt-decode";
import SweetAlert2 from "../SweetAlert2";

function App() {
  const showAlert = (data) => {
    SweetAlert2(data);
  };
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize to true
  const userData = UserType();

  useEffect(() => {
    if (userData) {
      setLoading(false);
      getDATA();
    }
  }, [userData]);

  const getToken = () => localStorage.getItem("token");
  const userType = jwtDecode(localStorage.getItem("token")).type;
  const getDATA = async () => {
    if (!userData) return; // Ensure userData is not null
    setLoading(true);
    const userApi = "api/users/getNBFC";
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
      headerStyle: {
        backgroundColor: "red",
        color: "white",
      },
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
  ];

  return (
    <div className="p-4">
      <Tabs>
        <TabList className="flex bg-gray-200 p-4">
          <Tab className="cursor-pointer bg-gray-200">NBFC List</Tab>
        </TabList>

        <TabPanel className="border border-gray-300 p-4 mt-4">
          <CustomTable
            data={logs}
            columns={columns}
            loading={loading}
            tableName={"Agents"}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
