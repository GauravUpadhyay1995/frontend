import DataTable from 'react-data-table-component';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BucketOptions } from "./StateOptions";

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
            <div className='ml-20 border-solid border-2 mb-1 mt-1'>
                <DataTable
                columns={nestedColumns}
                data={data.Slabs}
                noHeader
               
            />
            </div>
        );
    };

    const columns = [

        { name: 'Bucket ID', selector: row => getBucketName(row.bucket_id), sortable: true },
        { name: 'Product Name', selector: row => row.productName, sortable: true },
        { name: 'Fixed Percentage', selector: row => row.fixed_percentage + '%', sortable: true },

        { name: 'Created By', selector: row => row.nbfc_name, sortable: true },
        { name: 'Total Slabs', selector: row => row.total_count, sortable: true },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <DataTable
            title="Nested Data Table"
            columns={columns}
            data={rows}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            pagination
        />
    );
};

export default NestedTable;
