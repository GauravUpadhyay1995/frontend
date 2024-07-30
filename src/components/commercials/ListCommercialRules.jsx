import DataTable from 'react-data-table-component';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BucketOptions } from "../StateOptions";
import SweetAlert2 from '../SweetAlert2';

const NestedTable = () => {

    const getBucketName = (bucket_id) => {
        const bucket = BucketOptions.find(option => option.value === bucket_id.toString());
        return bucket ? bucket.label : 'Unknown Bucket';
    };
    const hasMounted = useRef(false);
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (!hasMounted.current) {
            getData();
            hasMounted.current = true;
        }
    }, []);

    const getToken = () => localStorage.getItem('token');

    const getData = async () => {
        try {
            const res = await fetch(
                `/api/commercial/listCommercialRule`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({
                    }),
                }
            );

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const result = await res.json();
            setRows(result.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setLoading(false);
        }
    };

    const ExpandedComponent = ({ data }) => {
        const nestedColumns = [
            {
                name: 'Slab',
                cell: (row, index) => index + 1,
            },
            { name: 'Min Percentage', selector: row => row.min_percentage + '%', sortable: true },
            { name: 'Offer Percentage', selector: row => row.offer_percentage + '%', sortable: true },

        ];

        return (
            <div className='ml-20 border-solid border-9 mb-1 mt-1'>
                <DataTable
                    columns={nestedColumns}
                    data={data.Slabs}
                    noHeader

                />
            </div>
        );
    };
    const showAlert = (data) => {
        SweetAlert2(data)
    }
    const handleAction = async (data, status) => {
        try {
            const response = await axios.post(
                'api/commercial/approveCommercialRule',
                { Id: data.id, status: status },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setLoading(false);
            if (response.data.success === true) {
                showAlert({ "type": "success", "title": response.data.message });
            }
            getData();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const columns = [

        { name: 'Bucket ID', selector: row => getBucketName(row.bucket_id), sortable: true },
        { name: 'Product Name', selector: row => row.productName, sortable: true },
        { name: 'Fixed Percentage', selector: row => row.fixed_percentage + '%', sortable: true },

        { name: 'Created By', selector: row => row.nbfc_name, sortable: true },
        { name: 'Total Slabs', selector: row => row.total_count, sortable: true },
        {
            name: 'Approval Status',
            cell: row => (
                <button
                    className={`focus:outline-none text-white bg-${row.isApproved === 1 ? 'green' : 'red'}-700 hover:bg-${row.isApproved === 1 ? 'green' : 'red'}-800 focus:ring-4 focus:ring-${row.isApproved === 1 ? 'green' : 'red'}-300 font-medium rounded-lg text-sm px-5 py-1 me-2 mb-2`}
                    onClick={() => handleAction(row, row.isApproved === 1 ? 0 : 1)}
                >
                    {row.isApproved === 1 ? 'Approved' : 'Pending'}
                </button>
            ),
            ignoreRowClick: true,
        },
        { name: 'Approved/UnApproved By', selector: row => row.approvedBy, sortable: true },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
      <div className="w-full -mt-7 ">
        <div className="container mx-auto my-8 p-4 bg-white border rounded-lg shadow-lg">
          <DataTable
            title="Commercial Rule List"
            columns={columns}
            data={rows}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            pagination
          />
        </div>
      </div>
    );
};

export default NestedTable;
