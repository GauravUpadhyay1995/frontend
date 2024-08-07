import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const customStyles = {
  control: (provided) => ({
    ...provided,
    maxHeight: '38px', 
    overflowY: 'auto', 
  }),
  menu: (provided) => ({
    ...provided,
    width: 300,
    zIndex: 20, 
  }),
  option: (provided, state) => ({
    ...provided,
    width: 300,
    backgroundColor: state.isSelected ? 'transparent' : 'white', // Adjust background color based on isSelected state
  }),
  multiValue: (provided) => ({
    ...provided,
    maxWidth: 'calc(100%)', 
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap', 
  }),
};

const CustomOption = ({ isSelected, ...props }) => {
  return (
    <components.Option {...props}>
      <div className={`flex items-center p-1 sm:p-2 ${isSelected ? 'bg-transparent' : 'bg-white'}`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => null}
          className="mr-2"
        />
        <label className="text-xs sm:text-sm text-gray-800 truncate">
          {props.label}
        </label>
      </div>
    </components.Option>
  );
};

function Myfilter({
  setSelectedState,
  setSelectedCity,
  setSelectedPincode,
  setSelectedProduct,
  setSelectedCampaign,
  setSelectedAge,
  setSelectedLoan,
  setStartDate,
  setEndDate,
}) {
  const [filterOptions, setFilterOptions] = useState({
    state: [],
    city: [],
    pincode: [],
    product: [],
    campaign: [],
    age: [],
    loan: [],
  });

  const [selectedState, setSelectedStateLocal] = useState([]);
  const [selectedCity, setSelectedCityLocal] = useState([]);
  const [selectedPincode, setSelectedPincodeLocal] = useState([]);
  const [selectedProduct, setSelectedProductLocal] = useState([]);
  const [selectedCampaign, setSelectedCampaignLocal] = useState([]);
  const [selectedAge, setSelectedAgeLocal] = useState([]);
  const [selectedLoan, setSelectedLoanLocal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startDate, setStartDateLocal] = useState(null);
  const [endDate, setEndDateLocal] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleFormatDate = (date) => {
    if (date) {
      const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      localDate.setDate(localDate.getDate() + 1);
      return localDate.toISOString().split("T")[0];
    } else {
      return null;
    }
  };

  useEffect(() => {
    setStartDate(handleFormatDate(startDate));
    setEndDate(handleFormatDate(endDate));
  }, [startDate, endDate]);

  const token = localStorage.getItem("token");

  const fetchInitialData = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);
    try {
      const [
        statesRes,
        citiesRes,
        pincodesRes,
        productRes,
        campaignRes,
        ageRes,
        loanRes,
      ] = await Promise.all([
        fetch("/api/report1/getAllState", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }),
        fetch("/api/report1/getCityData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }),
        fetch("/api/report1/getPinData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }),
        fetch("/api/report1/getAllProduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }),
        fetch("/api/report1/getAllCampaign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }),
        fetch("/api/report1/getAge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }),
        fetch("/api/report1/getLoanAmount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }),
      ]);

      if (
        !statesRes.ok ||
        !citiesRes.ok ||
        !pincodesRes.ok ||
        !productRes.ok ||
        !campaignRes.ok ||
        !ageRes.ok ||
        !loanRes.ok
      ) {
        throw new Error("Error fetching initial data");
      }

      const statesData = await statesRes.json();
      const citiesData = await citiesRes.json();
      const pincodesData = await pincodesRes.json();
      const campaignData = await campaignRes.json();
      const productsData = await productRes.json();
      const ageData = await ageRes.json();
      const loanData = await loanRes.json();

      if (
        statesData.success === 1 &&
        Array.isArray(statesData.data) &&
        citiesData.success === 1 &&
        Array.isArray(citiesData.data) &&
        pincodesData.success === 1 &&
        Array.isArray(pincodesData.data) &&
        productsData.success === 1 &&
        Array.isArray(productsData.data) &&
        campaignData.success === 1 &&
        Array.isArray(campaignData.data) &&
        ageData.success === 1 &&
        Array.isArray(ageData.data) &&
        loanData.success === 1 &&
        Array.isArray(loanData.data)
      ) {
        setFilterOptions({
          state: statesData.data.map((entry) => ({
            value: entry.state,
            label: entry.state,
          })),
          city: citiesData.data.map((entry) => ({
            value: entry.city,
            label: entry.city,
          })),
          pincode: pincodesData.data.map((entry) => ({
            value: entry.pincode,
            label: entry.pincode,
          })),
          product: productsData.data.map((entry) => ({
            value: entry.product_type,
            label: entry.product_type,
          })),
          campaign: campaignData.data.map((entry) => ({
            value: entry.campaign,
            label: entry.campaign,
          })),
          age: ageData.data.map((entry) => ({
            value: entry.ageRange,
            label: entry.ageRange,
          })),
          loan: loanData.data.map((entry) => ({
            value: entry.loanAmount,
            label: entry.loanAmount,
          })),
        });
      } else {
        setFilterOptions({
          state: [],
          city: [],
          pincode: [],
          product: [],
          campaign: [],
          age: [],
          loan: [],
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async (states) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/report1/getCityByState", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ states }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const cityData = await res.json();
      if (cityData.success === 1 && Array.isArray(cityData.data)) {
        const cities = cityData.data.map((entry) => ({
          value: entry.city,
          label: entry.city,
        }));
        setFilterOptions((prev) => ({
          ...prev,
          city: cities,
        }));
      } else {
        setFilterOptions((prev) => ({
          ...prev,
          city: [],
        }));
      }
    } catch (error) {
      setError("Error fetching city data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPincodes = async (cities) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/report1/getPinByCity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cities }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const pincodeData = await res.json();
      if (pincodeData.success === 1 && Array.isArray(pincodeData.data)) {
        const pincodes = pincodeData.data.map((entry) => ({
          value: entry.pincode,
          label: entry.pincode,
        }));
        setFilterOptions((prev) => ({
          ...prev,
          pincode: pincodes,
        }));
      } else {
        setFilterOptions((prev) => ({
          ...prev,
          pincode: [],
        }));
      }
    } catch (error) {
      setError("Error fetching pincode data");
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (selectedOptions) => {
    setSelectedStateLocal(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedState(selectedValues);
    fetchCities(selectedValues);
  };

  const handleCityChange = (selectedOptions) => {
    setSelectedCityLocal(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedCity(selectedValues);
    fetchPincodes(selectedValues);
  };

  const handlePincodeChange = (selectedOptions) => {
    setSelectedPincodeLocal(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedPincode(selectedValues);
  };

  const handleProductChange = (selectedOptions) => {
    setSelectedProductLocal(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedProduct(selectedValues);
  };

  const handleCampaignChange = (selectedOptions) => {
    setSelectedCampaignLocal(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedCampaign(selectedValues);
  };

  const handleAgeChange = (selectedOptions) => {
    setSelectedAgeLocal(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedAge(selectedValues);
  };

  const handleLoanChange = (selectedOptions) => {
    setSelectedLoanLocal(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedLoan(selectedValues);
  };

  const handleReset = () => {
    setSelectedState([]);
    setSelectedStateLocal([]);
    setSelectedCity([]);
    setSelectedCityLocal([]);
    setSelectedPincode([]);
    setSelectedPincodeLocal([]);
    setSelectedProduct([]);
    setSelectedProductLocal([]);
    setSelectedCampaign([]);
    setSelectedCampaignLocal([]);
    setSelectedAge([]);
    setSelectedAgeLocal([]);
    setSelectedLoan([]);
    setSelectedLoanLocal([]);
    setStartDate(null);
    setStartDateLocal(null);
    setEndDate(null);
    setEndDateLocal(null);
  };

  return (
    <div className="m-2  filter-form grid grid-cols-1 z-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-9 xl:grid-cols-9 2xl:grid-cols-9 gap-1 relative">
      <div className="form-row">
        <label htmlFor="state-select">State</label>
        <Select
          id="state-select"
          options={filterOptions.state}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option: CustomOption }}
          onChange={handleStateChange}
          styles={customStyles}
          value={selectedState}
          className=""
        />
      </div>
      <div className="form-row">
        <label htmlFor="city-select">City</label>
        <Select
          id="city-select"
          options={filterOptions.city}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option: CustomOption }}
          onChange={handleCityChange}
          styles={customStyles}
          value={selectedCity}
        />
      </div>
      <div className="form-row">
        <label htmlFor="pincode-select">Pincode</label>
        <Select
          id="pincode-select"
          options={filterOptions.pincode}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option: CustomOption }}
          onChange={handlePincodeChange}
          styles={customStyles}
          value={selectedPincode}
        />
      </div>
      <div className="form-row">
        <label htmlFor="product-select">Product</label>
        <Select
          id="product-select"
          options={filterOptions.product}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option: CustomOption }}
          onChange={handleProductChange}
          styles={customStyles}
          value={selectedProduct}
        />
      </div>
      <div className="form-row">
        <label htmlFor="campaign-select">Campaign</label>
        <Select
          id="campaign-select"
          options={filterOptions.campaign}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option: CustomOption }}
          onChange={handleCampaignChange}
          styles={customStyles}
          value={selectedCampaign}
        />
      </div>
      <div className="form-row ">
        <label htmlFor="age-select">Age</label>
        <Select
          id="age-select"
          options={filterOptions.age}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option: CustomOption }}
          onChange={handleAgeChange}
          styles={customStyles}
          value={selectedAge}
        />
      </div>
      <div className="form-row flex flex-col">
        <label htmlFor="start-date" className="mb-1">
          Start Date
        </label>
        <DatePicker
          id="start-date"
          selected={startDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          onChange={(date) => setStartDateLocal(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="YYYY-MM-DD"
          className="text-black border-gray-300 block w-full sm:text-sm border rounded-md p-2"
        />
      </div>
      <div className="form-row flex flex-col">
        <label htmlFor="end-date" className="mb-1">
          End Date
        </label>
        <DatePicker
          id="end-date"
          selected={endDate}
          onChange={(date) => setEndDateLocal(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="text-black border-gray-300 block w-full sm:text-sm border rounded-md p-2"
          placeholderText="YYYY-MM-DD"
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div className="form-row flex justify-end mt-6 mb-4">
        <button
          onClick={handleReset}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
        >
          Reset
        </button>
      </div>
      {error && <div>Error: {error}</div>}
    </div>
  );
}

export default Myfilter;
