import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Base64 } from "js-base64";
import classNames from "classnames";
import CustomTable from "../Table";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
import "react-tabs/style/react-tabs.css";

function App() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const getToken = () => localStorage.getItem("token");

  const getDATA = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "api/escalation/openedEscalationForNBFC",
        { status: 1 },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
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

  const showDetails = (requestId) => {
    const encodedId = Base64.encode(requestId);
    navigate(`/show-escalation-details/${encodedId}`);
  };

  const columns = [
    {
      name: "Agency",
      selector: (row) => row.agency_name,
      sortable: true,
      cell: (row) => (
        <div className="wrap-text cursor-pointer">{row.agency_name}</div>
      ),
    },
    {
      name: "Raised By",
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.created_by}</div>,
    },
    {
      name: "Raised Date",
      selector: "created_date", // Assuming 'created_date' is a field in your row object
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.created_date}</div>,
    },
    {
      name: "Total Escalations",
      selector: (row) => row.duplicacy_count,
      sortable: true,
      cell: (row) => (
        <div
          onClick={() => showDetails(row.agency_id)}
          className="  cursor-pointer wrap-text bg-green-500 rounded-full text-white text-center flex items-center justify-center"
          style={{
            minWidth: "2rem",
            minHeight: "2rem",
          }}
        >
          {row.duplicacy_count}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className=' className="w-full -mt-6 py-8 pr-6 pl-6 '>
        <div className="container mx-auto my-8 p-4 bg-white border rounded-lg shadow-lg">
          <CustomTable
            data={logs}
            columns={columns}
            loading={loading}
            tableName={"WaiverRules"}
          />
        </div>
      </div>
    </>
  );
}

export default App;
