import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CustomTable from './Table'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Select from 'react-select';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";


function App() {
  const getSortFunction = (tool) => {
    if (tool.value === 'Daily') {
      return tool1;
    } else if (tool.value === 'Weekly') {
      return tool2;
    } else if (tool.value === 'Monthly') {
      return tool3;
    }

  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Month is zero-based in JavaScript Date object
  };
  const parseStartDateRange = (dateRange) => {
    const startDateString = dateRange.split('-')[0]; // Get the start date part
    const [day, month, year] = startDateString.split('/').map(Number);
    return new Date(year, month - 1, day); // Convert to a Date object
  };
  const parseDateMonthly = (dateString) => {
    const [month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1); // Month is zero-based in JavaScript Date object
  };
  function tool1(rowA, rowB) {
    const a = rowA.date.toLowerCase();
    const b = rowB.date.toLowerCase();
    const dateA = parseDate(a);
    const dateB = parseDate(b);
    return dateA - dateB;
  }
  function tool2(rowA, rowB) {
    const rangeA = rowA.date.toLowerCase();
    const rangeB = rowB.date.toLowerCase();
    const dateA = parseStartDateRange(rangeA);
    const dateB = parseStartDateRange(rangeB);
    return dateA - dateB; // Compare the dates
  }
  function tool3(rowA, rowB) {
    const dateA = rowA.date.toLowerCase();
    const dateB = rowB.date.toLowerCase();
    const parsedDateA = parseDateMonthly(dateA);
    const parsedDateB = parseDateMonthly(dateB);
    return parsedDateA - parsedDateB; //
  }
  const toolOptions = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' },
    // Add more options as needed
  ];


  const [loanAmountOptions, setLoanAmountOptions] = useState([]);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState([]);

  const [ageOptions, setAgeOptions] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);



  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bucketOptions, setBucketOptions] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState([]);
  const [tool, setTool] = useState({ value: 'Daily', label: 'Daily' });
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMounted = useRef(false);

  const [agencyOptions, setAgencyOptions] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState([]);

  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [stateOptions, setAllstateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState([]);

  const [cityOptions, setCityOptions] = useState([]); // New state for city options
  const [selectedCity, setSelectedCity] = useState([]); // New state for selected city

  const [pinOptions, setPinOptions] = useState([]);
  const [selectedPin, setSelectedPin] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState([]);

  const [nbfcOptions, setNbfcOptions] = useState([]);
  const [selectedNbfc, setSelectedNbfc] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (!hasMounted.current) {
      getDATA({ tool: tool.value });
      // getBucket();
      getAgencyOptions();
      getProductOptions();
      getStateOptions();
      getLoanAmount();
      getAge();
      getCity([]);
      getPin([]);
      getCampaign([]);
      getNbfc([]);
      getGender([]);
      hasMounted.current = true;
    }
  }, []);

  useEffect(() => {
    if (selectedState.length > 0) {
      getCity(selectedState.map(option => option.value));
    } else {
      setCityOptions([]);
      getCity([]);
    }
  }, [selectedState]);
  useEffect(() => {
    if (selectedCity.length > 0) {
      getPin(selectedCity.map(option => option.value));
    } else {
      setPinOptions([]);
      getPin([]);
    }
  }, [selectedCity]);

  const handleSubmit = () => {
    const requestData = {
      state: selectedState.map(option => option.value),
      city: selectedCity.map(option => option.value),
      pincode: selectedPin.map(option => option.value),
      bucket: selectedBucket.map(option => option.value),
      agency: selectedAgency.map(option => option.value),
      nbfc_id: selectedNbfc.map(option => option.value),
      product: selectedProduct.map(option => option.value),
      campaign: selectedCampaign.map(option => option.value),
      gender: selectedGender.map(option => option.value),
      tool: tool.value,
      start_date: startDate,
      end_date: endDate,
      loanAmount: selectedLoanAmount.map(option => option.value),
      age: selectedAge.map(option => option.value),



    };
    getDATA(requestData);
  };

  const handleReset = () => {
    setTool([]);

    setSelectedBucket([]);
    setSelectedAgency([]);
    setSelectedProduct([]);
    setSelectedState([]);
    setSelectedCity([]); // Reset selected cities
    setSelectedPin([]);
    setSelectedCampaign([]);
    setSelectedNbfc([]);
    setSelectedGender([])
    setStartDate(null);
    setEndDate(null);
    setSelectedAge([]);
    setSelectedLoanAmount([]);
    getDATA({ tool: tool.value });

  };

  const getDATA = async (requestData = {}) => {
    setLoading(true);
    try {
      const response = await axios.post('api/report1/getDurationData', requestData);
      setLogs(response.data.data);
      setFilteredLogs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getBucket = async () => {
    try {
      const response = await axios.post('api/report1/getAllBucket');
      const options = response.data.data.map(option => ({
        value: option.bucket,
        label: option.bucket,
      }));
      setBucketOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
    } catch (error) {
      console.log(error);
    }
  };

  const getGender = async () => {
    try {
      const response = [
        { gender: 'Male' },
        { gender: 'Female' }
      ];

      const options = response.map(option => ({
        value: option.gender,
        label: option.gender,
      }));

      // Check for consistency in capitalization and handle `Select All`
      const genderOptions = [{ value: 'selectAll', label: 'Select All' }, ...options];

      // Set the options state
      setGenderOptions(genderOptions);

    } catch (error) {
      console.log(error);
    }
  };

  const getAgencyOptions = async () => {
    try {
      const response = await axios.post('api/report1/getAllAgency');
      const options = response.data.data.map(option => ({
        value: option.agency_name,
        label: option.agency_name,
      }));
      setAgencyOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
    } catch (error) {
      console.log(error);
    }
  };

  const getStateOptions = async () => {
    try {
      const response = await axios.post('api/report1/getAllState');
      const options = response.data.data.map(option => ({
        value: option.state,
        label: option.state,
      }));
      setAllstateOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
    } catch (error) {
      console.log(error);
    }
  };
  const getLoanAmount = async () => {
    try {
      const response = await axios.post('api/report1/getLoanAmount');
      const options = response.data.data.map(option => ({
        value: option.loanAmount,
        label: option.loanAmount,
      }));
      setLoanAmountOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
    } catch (error) {
      console.log(error);
    }
  };
  const getAge = async () => {
    try {
      const response = await axios.post('api/report1/getAge');
      const options = response.data.data.map(option => ({
        value: option.ageRange,
        label: option.ageRange,
      }));
      setAgeOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductOptions = async () => {
    try {
      const response = await axios.post('api/report1/getAllProduct');
      const options = response.data.data.map(option => ({
        value: option.product_type,
        label: option.product_type,
      }));
      setProductOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
    } catch (error) {
      console.log(error);
    }
  };

  const getCity = async (states) => {

    try {
      const response = await axios.post('api/report1/getCityByState', { states });
      const options = response.data.data.map(option => ({
        value: option.city,
        label: option.city,
      }));

      setCityOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);
    } catch (error) {
      console.log(error);
    }
  };

  const getPin = async (cities) => {

    try {
      const response = await axios.post('api/report1/getPinByCity', { cities });
      const options = response.data.data.map(option => ({
        value: option.pincode,
        label: option.pincode,
      }));

      setPinOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);

    } catch (error) {
      console.log(error);
    }
  };

  const getCampaign = async () => {

    try {
      const response = await axios.post('api/report1/getAllCampaign');
      const options = response.data.data.map(option => ({
        value: option.campaign,
        label: option.campaign,
      }));

      setCampaignOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);

    } catch (error) {
      console.log(error);
    }
  };
  const getNbfc = async () => {

    try {
      const response = await axios.post('api/report1/getAllNbfc');
      const options = response.data.data.map(option => ({
        value: option.approved_nbfc,
        label: option.approved_nbfc,
      }));

      setNbfcOptions([{ value: 'selectAll', label: 'Select All' }, ...options]);

    } catch (error) {
      console.log(error);
    }
  };



  const handleSelectChange = (selected, setSelected, options) => {
    if (selected && selected.length && selected[selected.length - 1].value === 'selectAll') {
      setSelected(options.filter(option => option.value !== 'selectAll'));
    } else {
      setSelected(selected);
    }
  };


  const columns = [

    {
      name: 'Duration ( D / m / y )',
      selector: row => row.date,
      sortable: true,
      sortFunction: getSortFunction(tool),
      cell: row => (
        <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {row.date}
        </div>
      ),
    },
    {
      name: 'Paid',
      selector: row => row.paid,
      sortable: true,
    },
    {
      name: 'UnPaid',
      selector: row => row.unpaid,
      sortable: true,
    },
    {
      name: 'Total',
      selector: row => row.total,
      sortable: true,
    },
    {
      name: 'Paid(%)',
      selector: row => row.paid_percentage,
      sortable: true,
    },
    {
      name: 'UnPaid(%)',
      selector: row => row.unpaid_percentage,
      sortable: true,
    },
    {
      name: 'Paid Count',
      selector: row => row.paid_count,
      sortable: true,
    },
    {
      name: 'UnPaid Count',
      selector: row => row.unpaid_count,
      sortable: true,
    },
    {
      name: 'Grand Total',
      selector: row => row.grand_sum,
      sortable: true,
    },
  ];

  const toggleAccordionContent = () => {
    const accordionContent = document.querySelector('#accordion-content');
    if (accordionContent) {
      accordionContent.classList.toggle('hidden');
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>

      <div style={{ background: '#e5e5e526' }} className="w-full bg-white border border-gray-200 rounded-lg shadow sm:p-3 dark:bg-gray-800 dark:border-gray-700 mb-4">
        <div data-accordion className="accordion">
          <span className="flex justify-end mb-2" onClick={toggleAccordionContent}>
            {isExpanded ? <SlArrowUp /> : <SlArrowDown />}
          </span>
          <div id="accordion-content" className="hidden" data-accordion-content>



            <div className="grid grid-cols-8 gap-3">

              <Select
                closeMenuOnSelect={false}
                id="State"
                value={selectedState}
                onChange={(selected) => handleSelectChange(selected, setSelectedState, stateOptions)}
                options={stateOptions}
                isMulti
                className=""
                placeholder="State"

              />

              <Select
                closeMenuOnSelect={false}
                id="city"
                value={selectedCity}
                onChange={(selected) => handleSelectChange(selected, setSelectedCity, cityOptions)}
                options={cityOptions}
                isMulti
                className=""
                placeholder="City"
              />
              <Select
                closeMenuOnSelect={false}
                id="Pincode"
                value={selectedPin}
                onChange={(selected) => handleSelectChange(selected, setSelectedPin, pinOptions)}
                options={pinOptions}
                isMulti
                className=""
                placeholder="Pincode"
              />
              {/* <Select
                closeMenuOnSelect={false}
                id="bucket"
                value={selectedBucket}
                onChange={(selected) => handleSelectChange(selected, setSelectedBucket, bucketOptions)}
                options={bucketOptions}
                isMulti
                className=""
                placeholder="Bucket"
              /> */}
              <Select
                closeMenuOnSelect={false}
                id="agency"
                value={selectedAgency}
                onChange={(selected) => handleSelectChange(selected, setSelectedAgency, agencyOptions)}
                options={agencyOptions}
                isMulti
                className=""
                placeholder="Allocation"
              />


              <Select
                closeMenuOnSelect={false}
                id="approved_nbfc"
                value={selectedNbfc}
                onChange={(selected) => handleSelectChange(selected, setSelectedNbfc, nbfcOptions)}
                options={nbfcOptions}
                isMulti
                className=""
                placeholder="Lender"

              />
              <Select
                closeMenuOnSelect={false}
                id="product"
                value={selectedProduct}
                onChange={(selected) => handleSelectChange(selected, setSelectedProduct, productOptions)}
                options={productOptions}
                isMulti
                className=""
                placeholder="Product"
              />
              <Select
                closeMenuOnSelect={false}
                id="campaign"
                value={selectedCampaign}
                onChange={(selected) => handleSelectChange(selected, setSelectedCampaign, campaignOptions)}
                options={campaignOptions}
                isMulti
                className=""
                placeholder="Camapaign"
              />
              <Select
                closeMenuOnSelect={false}
                id="gender"
                value={selectedGender}
                onChange={(selected) => handleSelectChange(selected, setSelectedGender, genderOptions)}
                options={genderOptions}
                isMulti
                className=""
                placeholder="Gender"

              />
              <Select
                value={tool}
                onChange={setTool}
                options={toolOptions}
                placeholder="Duration"
              />
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select start date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select end date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              />
              <Select
                closeMenuOnSelect={false}
                id="Age"
                value={selectedAge}
                onChange={(selected) => handleSelectChange(selected, setSelectedAge, ageOptions)}
                options={ageOptions}
                isMulti
                className=""
                placeholder="Age"
              />
              <Select
                closeMenuOnSelect={false}
                id="LoanAmount"
                value={selectedLoanAmount}
                onChange={(selected) => handleSelectChange(selected, setSelectedLoanAmount, loanAmountOptions)}
                options={loanAmountOptions}
                isMulti
                className=""
                placeholder="Loan Amt"
              />
            </div>
            <div className="col-span-3 flex justify-end gap-3">
              <button
                onClick={handleSubmit}
                className="sm:w-auto text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
              <button
                onClick={handleReset}
                className="sm:w-auto text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Reset
              </button>
            </div>

          </div>
        </div>
      </div >

      <CustomTable data={logs} columns={columns} loading={loading} tableName={'Duration'} />
    </>
  );
}

export default App;
