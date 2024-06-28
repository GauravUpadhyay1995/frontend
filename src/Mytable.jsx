import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";





const customStyles = {
	header: {
		style: {
			minHeight: '56px',
		},
	},
	headRow: {
		style: {
			borderTopStyle: 'solid',
			borderTopWidth: '1px',
		},
	},
	headCells: {
		style: {
			'&:not(:last-of-type)': {
				borderRightStyle: 'solid',
				borderRightWidth: '1px',
				
			},
		},
	},
	cells: {
		style: {
			'&:not(:last-of-type)': {
				borderRightStyle: 'solid',
				borderRightWidth: '1px',
				
			},
		},
	},
};

const getAllColumns = (data) => {
  const allColumns = new Set();
  data.forEach(row => {
    Object.keys(row).forEach(key => {
      allColumns.add(key);
    });
  });
  return Array.from(allColumns);
};

const isDateColumn = (str) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
};

const normalizeData = (data, allColumns) => {
  return data.map(row => {
    const normalizedRow = {};
    allColumns.forEach(column => {
      normalizedRow[column] = row[column] !== undefined ? row[column] : 0;
    });
    return normalizedRow;
  });
};

const dynamicColumns = (data) => {
  if (!data || data.length === 0) return [];
  const allColumns = getAllColumns(data);

  const dateColumns = allColumns.filter(isDateColumn).sort();
  const otherColumns = allColumns.filter(col => !isDateColumn(col));

  const sortedColumns = [...otherColumns, ...dateColumns];

  return sortedColumns.map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    selector: row => row[key],
    sortable: true,
    width: '150px',
  }));
};

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
        data={data}
        columns={dynamicNestedColumns}
        expandableRows
      />
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
    <div className="container d-flex justify-content-center my-5 min-h-80">
      <DataTable
        columns={columns}
        data={normalizedData}
        pagination
        customStyles={customStyles}
        paginationPerPage={10}
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
