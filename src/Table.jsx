import React from 'react';
import DataTable from 'react-data-table-component';
import { downloadExcel } from './DownLoadExcell';
import { Loader } from './Loader';

const CustomTable = ({ data, columns, loading, tableName }) => {
    const handleDownloadExcel = () => {
        downloadExcel(data, tableName); // Pass the data you want to download
    };
   
        const conditionalRowStyles = [
            {
                when: row => row.isActive === 1,
                style: {
                    backgroundColor: '#29e80e0f',
                    color: 'black',
                },
            },
            {
                when: row => row.isActive !== 1,
                style: {
                    backgroundColor: '#d0935980',
                    color: 'black',
                },
            },
        ];
  

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    {data && data.length > 0 && (
                        <div className="flex justify-end mb-4">
                            <button className="sm:w-auto text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2" onClick={handleDownloadExcel}>Download Excel</button>
                        </div>
                    )}
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 100, 250, 500, 5000, data.length]}
                        selectableRows
                        selectableRowsHighlight
                        className="border border-gray-300 rounded"
                        highlightOnHover
                        customStyles={{
                            header: {
                                style: {
                                    backgroundColor: '#4CAF50', // Background color for header cells
                                    color: 'white', // Text color for header cells
                                },
                            },
                            headRow: {
                                style: {
                                    backgroundColor: '#4c4faf4d', // Background color for header row
                                },
                            },
                        }}
                        conditionalRowStyles={tableName === 'Agents' ? conditionalRowStyles : []}
                    />
                </>
            )}
        </>
    );
};

export default CustomTable;
