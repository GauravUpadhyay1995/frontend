import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import CustomTable from "../Table";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
import "react-tabs/style/react-tabs.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const getToken = () => localStorage.getItem("token");

  const getDATA = async () => {
    setLoading(true);

    try {
      const response = await axios.post("api/users/waiverList", {});
      console.log("Fetched Data:", response.data.data);
      setLogs(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDATA();
  }, []);

  const handleDelete = async (requestId) => {
    setLoading(true);
    try {
      await axios.post("api/users/deleteWaiverRequest", { id: requestId });
      await getDATA();
    } catch (error) {
      console.error("Error deleting waiver request:", error);
    } finally {
      setLoading(false);
    }
  };
  const showDetails = async (id) => {
    console.log(id);
  };

  const columns = [
    {
      name: "Loan Id",
      selector: (row) => row.loanId,
      sortable: true,
      cell: (row) => (
        <div
          onClick={() => handleAction(row.loanId)}
          className="wrap-text cursor-pointer"
        >
          {row.loanId}
        </div>
      ),
    },
    {
      name: "Requested By",
      selector: (row) => row.nbfc_name,
      sortable: true,
    },
    { name: "Total Amount", selector: (row) => row.total_amt, sortable: true },
    {
      name: "Requested date",
      selector: (row) => row.formatted_created_date,
      sortable: true,
      cell: (row) => (
        <div className="wrap-text">{row.formatted_created_date}</div>
      ),
    },
    {
      name: "Expiry date",
      selector: (row) => row.formatted_expiry_date,
      sortable: true,
      cell: (row) => (
        <div className="wrap-text">{row.formatted_expiry_date}</div>
      ),
    },
    {
      name: "Response date",
      selector: (row) => row.formatted_approved_date,
      sortable: true,
      cell: (row) => (
        <div className="wrap-text">{row.formatted_approved_date}</div>
      ),
    },
    {
      name: "Status",
      selector: (row) =>
        row.isApproved === 1
          ? "Approved"
          : row.isApproved === 0
          ? "Rejected"
          : "Pending",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => {
        const isApproved = row.isApproved === 2;
        const approved = row.isApproved === 1;
        const rejected = row.isApproved === 0;
        const buttonClass = classNames({
          "focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2": true,
          "bg-gray-700 hover:bg-gray-800 focus:ring-gray-300": isApproved,
          "bg-green-700 hover:bg-green-800 focus:ring-green-300": approved,
          "bg-red-700 hover:bg-red-800 focus:ring-red-300": rejected,
        });

        return isApproved ? (
          <button className={buttonClass} onClick={() => handleDelete(row.id)}>
            Delete
          </button>
        ) : (
          <button className={buttonClass} onClick={() => showDetails(row.id)}>
            Details
          </button>
        );
      },
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="App">
      <CustomTable
        data={logs}
        columns={columns}
        loading={loading}
        tableName={"WaiverList"}
      />
    </div>
  );
}

export default App;
