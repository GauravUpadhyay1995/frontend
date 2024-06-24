import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { dynamicColumns, dynamicNestedColumns, rows1 } from './data';
import { Loader } from './Loader';

const formatDecimalValues = (data) => {
  return data.map(row => {
    let newRow = {};
    for (let key in row) {
      if (typeof row[key] === 'number' && row[key] % 1 !== 0) {
        newRow[key] = parseFloat(row[key].toFixed(2));
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
      <DataTable
        data={rows1}
        columns={dynamicNestedColumns}
        expandableRows
      />
    </div>
  );
};

function Mytable({ data, error }) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);



  const formattedData = formatDecimalValues(filteredData); 

  const columns = dynamicColumns(formattedData);

  return (
    <div className="container d-flex justify-content-center my-5 min-h-80">
 
        <>
          <DataTable
            columns={columns}
            data={formattedData}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[20, 30, 40]}
            highlightOnHover
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            fixedHeader
            expandableRowsComponent={ExpandedComponentLevel1}
            title="Data Taken from the Database"
          />
          {error && <p>Error: {error}</p>}
        </>
   
    </div>
  );
}

export default Mytable;
