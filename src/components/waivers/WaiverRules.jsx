import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import CustomTable from "../Table";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";
import "react-tabs/style/react-tabs.css";
import { BucketOptions } from "../StateOptions";

function App() {
  const getBucketName = (bucket_id) => {
    const bucket = BucketOptions.find(
      (option) => option.value === bucket_id.toString()
    );
    return bucket ? bucket.label : "Unknown Bucket";
  };
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const getToken = () => localStorage.getItem("token");

  const getDATA = async () => {
    setLoading(true);

    try {
      const response = await axios.post("api/users/waiverRuleLists", {});
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

  const getExpiryStatus = (expiry_date) => {
    // Parse the expiry_date string into a Date object
    const formattedDate = expiry_date.replace(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)/,
      "$2-$1-$3 $4:$5:$6 $7"
    );
    const expiryDate = new Date(formattedDate);

    // Get the current date and time
    const currentDate = new Date();

    // Compare the dates and return the status
    return expiryDate < currentDate ? "expired" : "active";
  };
  const StatusButton = ({ status }) => {
    const buttonStyle = {
      padding: "5px 10px",
      color: "white",
      border: "none",
      borderRadius: "3px",
      backgroundColor: status === "active" ? "green" : "red",
    };

    return <button style={buttonStyle}>{status}</button>;
  };

  const columns = [
    {
      name: "Product Name",
      selector: (row) => row.product,
      sortable: true,
      cell: (row) => (
        <div
          onClick={() => handleAction(row.product)}
          className="wrap-text cursor-pointer"
        >
          {row.product}
        </div>
      ),
    },
    {
      name: "Bucket",
      selector: (row) => getBucketName(row.bucket_id),
      sortable: true,
    },
    {
      name: "Expiry Date",
      selector: (row) => row.formatted_expiry_date,
      sortable: true,
      cell: (row) => (
        <div className="wrap-text">{row.formatted_expiry_date}</div>
      ),
    },
    {
      name: "Principal",
      selector: (row) => row.principal,
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.principal + "%"}</div>,
    },
    {
      name: "Penal",
      selector: (row) => row.penal,
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.penal + "%"}</div>,
    },
    {
      name: "Interest",
      selector: (row) => row.intrest,
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.intrest + "%"}</div>,
    },
    {
      name: "Created_by",
      selector: (row) => row.created_by,
      sortable: true,
      cell: (row) => <div className="wrap-text">{row.created_by}</div>,
    },
    {
      name: "Created Date",
      selector: (row) => row.formatted_created_date,
      sortable: true,
      cell: (row) => (
        <div className="wrap-text">{row.formatted_created_date}</div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.formatted_expiry_date,
      cell: (row) => (
        <StatusButton status={getExpiryStatus(row.formatted_expiry_date)} />
      ),
    },

    // {
    //     name: 'Action',
    //     cell: row => {
    //         const isApproved = row.isApproved === 2;
    //         const approved = row.isApproved === 1;
    //         const rejected = row.isApproved === 0;
    //         const buttonClass = classNames({
    //             'focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2': true,
    //             'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300': isApproved,
    //             'bg-green-700 hover:bg-green-800 focus:ring-green-300': approved,
    //             'bg-red-700 hover:bg-red-800 focus:ring-red-300': rejected,
    //         });

    //         return isApproved ? (
    //             <button
    //                 className={buttonClass}
    //                 onClick={() => handleDelete(row.id)}
    //             >
    //                 Delete
    //             </button>
    //         ) : (<button
    //             className={buttonClass}
    //             onClick={() => showDetails(row.id)}
    //         >
    //             Details
    //         </button>)
    //     },
    //     ignoreRowClick: true,
    // }
  ];

  return (
    <div className="w-full -mt-7 ">
      <div className="container mx-auto my-8 p-4 bg-white border rounded-lg shadow-lg">
        <CustomTable
          data={logs}
          columns={columns}
          loading={loading}
          tableName={"WaiverRules"}
        />
      </div>
    </div>
  );
}

export default App;
