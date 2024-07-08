import React from "react";
import DataTable from "react-data-table-component";
import { downloadExcel } from "./DownLoadExcell";
import { Loader } from "./Loader";

const CustomTable = ({ data, columns, loading, tableName }) => {
  const handleDownloadExcel = () => {
    downloadExcel(data, tableName); // Pass the data you want to download
  };

  const conditionalRowStyles = [
    {
      when: (row) => row.isActive === 1,
      style: {
        backgroundColor: "#F3F4F6", // Light gray for active rows
        color: "#111827", // Dark text for active rows
      },
    },
    {
      when: (row) => row.isActive !== 1,
      style: {
        backgroundColor: "#FEE2E2", // Light red for inactive rows
        color: "#111827", // Dark text for inactive rows
      },
    },
  ];

  // Custom styles for the rows per page dropdown
  const customStyles = {
    rowsPerPageOption: {
      backgroundColor: "gray", // Light gray background for the dropdown
      color: "#111827", // Dark text color
      fontSize: "0.85rem", // Adjust font size if needed
    },
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          {data && data.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 shadow-md"
                onClick={handleDownloadExcel}
              >
                Download Excel
              </button>
            </div>
          )}
          <DataTable
            columns={columns}
            data={data}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
            selectableRows
            selectableRowsHighlight
            className="border border-gray-300 rounded-lg"
            highlightOnHover
            customStyles={{
              header: {
                style: {
                  backgroundColor: "#4B5563", // Dark gray for header cells
                  color: "#FFFFFF", // White text for header cells
                  fontSize: "0.85rem",
                },
              },
              headRow: {
                style: {
                  backgroundColor: "#CBD5E0", // Light gray for header row
                },
              },
              ...customStyles, // Include custom styles for rows per page dropdown
            }}
            conditionalRowStyles={conditionalRowStyles}
          />
        </div>
      )}
    </>
  );
};

export default CustomTable;
