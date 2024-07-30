import { useState } from 'react';
import CustomTable from './Table';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

import 'react-tabs/style/react-tabs.css';
import Filter from "./Filter";


function App() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        { name: 'Pin', selector: row => row.pincode, sortable: true },
        { name: 'Paid', selector: row => row.paid, sortable: true },
        { name: 'UnPaid', selector: row => row.unpaid, sortable: true },
        { name: 'Total', selector: row => row.total, sortable: true },
        { name: 'Paid(%)', selector: row => row.paid_percentage, sortable: true },
        { name: 'UnPaid(%)', selector: row => row.unpaid_percentage, sortable: true },
        { name: 'Paid Count', selector: row => row.paid_count, sortable: true },
        { name: 'UnPaid Count', selector: row => row.unpaid_count, sortable: true },
        { name: 'Grand Total', selector: row => row.grand_sum, sortable: true },
    ];



    return (
        <>
            <Filter setLogs={setLogs} myurl={'getPinData'} />
            <CustomTable data={logs} columns={columns} loading={loading} tableName={'PinCode'} />
        </>
    );
}

export default App;
