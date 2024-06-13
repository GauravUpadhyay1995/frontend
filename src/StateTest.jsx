import { useState } from 'react';
import CustomTable from './Table';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Filter from "./Filter";

function App({ myurl }) {
    const resolvedColor = "#00ff1817";
    const unResolvedColor = "#ff ff0024";
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    let columns = '';
    if (myurl == 'getStateData') {
        columns = [
            {
                name: 'State',
                selector: row => row.state,
                sortable: true,
                headerStyle: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            },
            {
                name: 'Total Count',
                selector: row => row.total_count,
                sortable: true,
            },
            {
                name: 'Total Pos',
                selector: row => row.total_pos,
                sortable: true,
            },
            {
                name: 'Resolved Pos',
                selector: row => row.resolved_pos,
                sortable: true,
                style: {
                    backgroundColor: resolvedColor,
                },
            },
            {
                name: 'Resolved count',
                selector: row => row.resolved_count,
                sortable: true,
                style: {
                    backgroundColor: resolvedColor,
                },
            },
            {
                name: 'Percentage POS',
                selector: row => row.percentage_pos,
                sortable: true,
                style: {
                    backgroundColor: resolvedColor,
                },
            },
            {
                name: 'Percentage Count',
                selector: row => row.resolved_percentage_count,
                sortable: true,
                style: {
                    backgroundColor: resolvedColor,
                },
            },
            {
                name: 'Unresolved POS',
                selector: row => row.unresolved_pos,
                sortable: true,
                style: {
                    backgroundColor: unResolvedColor,
                },
            },
            {
                name: 'Unresolved Count',
                selector: row => row.unresolved_count,
                sortable: true,
                style: {
                    backgroundColor: unResolvedColor,
                },
            },
            {
                name: 'Unresolved percentage pos',
                selector: row => row.unresolved_percentage_pos,
                sortable: true,
                style: {
                    backgroundColor: unResolvedColor,
                },
            },
            {
                name: 'Unresolved percentage count',
                selector: row => row.unresolved_percentage_count,
                sortable: true,
                style: {
                    backgroundColor: unResolvedColor,
                },
            },
        ];
    }
    else if (myurl == 'getResolvedPercentageData') {
        const uniquePaymentDates = Array.from(
            new Set(logs.flatMap(log => log.newdata.counting.map(c => c.payment_date)))
        );
        const states = logs.map(log => log.newdata.state);

        console.log(uniquePaymentDates)

        columns = [

            {
                name: 'duration',
                selector: row => {
                    return uniquePaymentDates.map(element => Object.entries(element).map(([key, value]) => { return value }));
                },


                sortable: true,
                headerStyle: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            },

        ];
    }
    console.log(myurl)
    return (<>
        <Filter setLogs={setLogs} myurl={myurl} group_by={'state'} />
        <CustomTable data={logs} columns={columns} loading={loading} tableName={'State'} />
    </>);
}

export default App;
