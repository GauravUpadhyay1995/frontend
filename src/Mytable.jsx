import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const customStyles = {
  headRow: {
    style: {
      minHeight: "14px",
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
      borderBottomColor: "black",
    },
  },
  rows: {
    style: {
      minHeight: "14px !important",
      height: "14px !important",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
      borderBottomColor: "black",
    },
  },
  headCells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: "black",
      },
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  cells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: "black",
      },
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
      borderBottomColor: "black",
      padding: 0,
    },
  },
};

const getAllColumns = (data) => {
  const allColumns = new Set();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      allColumns.add(key);
    });
  });
  return Array.from(allColumns);
};

const isDateColumn = (str) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
};

const normalizeData = (data, allColumns) => {
  return data.map((row) => {
    const normalizedRow = {};
    allColumns.forEach((column) => {
      normalizedRow[column] = row[column] !== undefined ? row[column] : 0;
    });
    return normalizedRow;
  });
};

const formatNumberWithIndianCommas = (num, key) => {
  if (key.toLowerCase() === "pincode") {
    return num;
  }
  if (typeof num === "number") {
    const numStr = num.toString();
    const [integerPart, decimalPart] = numStr.split(".");
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedInteger =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherDigits ? "," : "") +
      lastThreeDigits;
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }
  return num;
};

const dynamicColumns = (data) => {
  if (!data || data.length === 0) return [];
  const allColumns = getAllColumns(data);

  const dateColumns = allColumns.filter(isDateColumn).sort();
  const otherColumns = allColumns.filter((col) => !isDateColumn(col));

  const sortedColumns = [...otherColumns, ...dateColumns];

  return sortedColumns.map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    selector: (row) => row[key],
    sortable: true,
    width: "150px",
    cell: (row, rowIndex) => (
      <div
        style={{
          backgroundColor: rowIndex % 2 === 0 ? "white" : "#d9d9d9",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          padding: "0px",
          fontSize: "10px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {formatNumberWithIndianCommas(row[key], key)}
      </div>
    ),
  }));
};

const formatDecimalValues = (data) => {
  return data.map((row) => {
    let newRow = {};
    for (let key in row) {
      if (typeof row[key] === "number" && row[key] % 1 !== 0) {
        newRow[key] = Math.round(row[key]);
      } else {
        newRow[key] = row[key];
      }
    }
    return newRow;
  });
};

const ExpandedComponentLevel1 = ({ data }) => {
  return (
    <div className="ml-28">
      <DataTable data={data} columns={dynamicColumns(data)} expandableRows />
    </div>
  );
};

function Mytable({ data, error }) {
  const [normalizedData, setNormalizedData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const allColumns = getAllColumns(data);
      const normalizedData = normalizeData(data, allColumns);
      const formattedData = formatDecimalValues(normalizedData);
      setNormalizedData(formattedData);
      setColumns(dynamicColumns(formattedData));
    } else {
      setNormalizedData([]);
      setColumns([]);
    }
  }, [data]);

  return (
    <div
      className="max-w-full overflow-x-auto pl-10 pr-10"
      style={{ height: "35rem" }}
    >
      <DataTable
        columns={columns}
        data={normalizedData}
        pagination={false}
        customStyles={customStyles}
        paginationPerPage={40}
        paginationRowsPerPageOptions={[20, 30, 40]}
        highlightOnHover
        paginationComponentOptions={{
          noRowsPerPage: true,
        }}
        fixedHeader
        expandableRowsComponent={ExpandedComponentLevel1}
        title=""
      />
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Mytable;
