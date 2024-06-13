
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import StateTest from "./StateTest";
import Pincode from "./Pincode";
import City from "./City";


function App() {
    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>State Resolution</Tab>
                    <Tab>Daily Trend (%)</Tab>
                    <Tab>Daily Trend (Coll. Amt)</Tab>
                    {/* <Tab>Daily Trend (Res. POS)</Tab>
                    <Tab>Daily Trend (Resolved Count)</Tab> */}
                </TabList>

                <TabPanel>
                    <StateTest myurl={'getStateData'} />
                </TabPanel>

                <TabPanel>
                    <StateTest myurl={'getResolvedPercentageData'} />
                </TabPanel>

                <TabPanel>
                    <StateTest myurl={'getCollectedAmountData'} />
                </TabPanel>
            </Tabs>
        </>
    );
}



export default App;
