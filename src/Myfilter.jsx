import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

      const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      localDate.setDate(localDate.getDate() + 1);

      return localDate.toISOString().split('T')[0];
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
      const res = await fetch(
        "/api/report1/getCityByState",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ states }),
        }
      );
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
      const res = await fetch(
        "/api/report1/getPinByCity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cities }),
        }
      );
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
    const states = selectedOptions.map((option) => option.value);
    setSelectedStateLocal(selectedOptions);
    setSelectedState(states);
    setSelectedCityLocal([]);
    setSelectedPincodeLocal([]);

    if (states.length > 0) {
      fetchCities(states);
    } else {
      fetchInitialData();
    }
  };

  const handleCityChange = (selectedOptions) => {
    const cities = selectedOptions.map((option) => option.value);
    setSelectedCityLocal(selectedOptions);
    setSelectedCity(cities);
    setSelectedPincodeLocal([]);

    if (cities.length > 0) {
      fetchPincodes(cities);
    } else {
      fetchInitialData();
    }
  };

  const handlePincodeChange = (selectedOptions) => {
    const pincodes = selectedOptions.map((option) => String(option.value));
    setSelectedPincodeLocal(selectedOptions);
    setSelectedPincode(pincodes);
  };

  const handleProductChange = (selectedOptions) => {
    const products = selectedOptions.map((option) => option.value);
    setSelectedProductLocal(selectedOptions);
    setSelectedProduct(products);
  };

  const handleCampaignChange = (selectedOptions) => {
    const campaigns = selectedOptions.map((option) => option.value);
    setSelectedCampaignLocal(selectedOptions);
    setSelectedCampaign(campaigns);
  };

  const handleAgeChange = (selectedOptions) => {
    const ages = selectedOptions.map((option) => option.value);
    setSelectedAgeLocal(selectedOptions);
    setSelectedAge(ages);
  };

  const handleLoanChange = (selectedOptions) => {
    const loans = selectedOptions.map((option) => option.value);
    setSelectedLoanLocal(selectedOptions);
    setSelectedLoan(loans);
  };

  const handleReset = () => {
    setSelectedState([]);
    setSelectedCity([]);
    setSelectedPincode([]);
    setSelectedProduct([]);
    setSelectedCampaign([]);
    setSelectedAge([]);
    setSelectedLoan([]);
    setSelectedStateLocal([]);
    setSelectedCityLocal([]);
    setSelectedPincodeLocal([]);
    setSelectedProductLocal([]);
    setSelectedCampaignLocal([]);
    setSelectedAgeLocal([]);
    setSelectedLoanLocal([]);
    setStartDateLocal(null);
    setEndDateLocal(null);
    fetchInitialData();
  };

  return (
    <div className="filter p-6 m-5 bg-white shadow-md rounded-lg">

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="box grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="filter-group">
          <label htmlFor="state" className="block text-gray-700 mb-2">
            State
          </label>
          <Select
            className="state z-30 text-black "
            id="state"
            value={selectedState}
            onChange={handleStateChange}
            options={filterOptions.state}
            isMulti
          />
        </div>

        <div className="filter-group">
          <label htmlFor="city" className="block text-gray-700 mb-2">
            City
          </label>
          <Select
            className="city z-30 text-black"
            id="city"
            value={selectedCity}
            onChange={handleCityChange}
            options={filterOptions.city}
            isMulti
          />
        </div>

        <div className="filter-group">
          <label htmlFor="pincode" className="block text-gray-700 mb-2">
            Pincode
          </label>
          <Select
            className="pincode z-30 text-black"
            id="pincode"
            value={selectedPincode}
            onChange={handlePincodeChange}
            options={filterOptions.pincode}
            isMulti
          />
        </div>

        <div className="filter-group">
          <label htmlFor="product" className="block text-gray-700 mb-2">
            Product
          </label>
          <Select
            className="product z-20 text-black"
            id="product"
            value={selectedProduct}
            onChange={handleProductChange}
            options={filterOptions.product}
            isMulti
          />
        </div>

        <div className="filter-group">
          <label htmlFor="campaign" className="block text-gray-700 mb-2">
            Campaign
          </label>
          <Select
            className="campaign z-20 text-black"
            id="campaign"
            value={selectedCampaign}
            onChange={handleCampaignChange}
            options={filterOptions.campaign}
            isMulti
          />
        </div>

        <div className="filter-group">
          <label htmlFor="age" className="block text-gray-700 mb-2">
            Age
          </label>
          <Select
            className="age z-20 text-black"
            id="age"
            value={selectedAge}
            onChange={handleAgeChange}
            options={filterOptions.age}
            isMulti
          />
        </div>

        <div className="filter-group">
          <label htmlFor="loan" className="block text-gray-700 mb-2">
            Loan Amt
          </label>
          <Select
            className="loan z-10 text-black"
            id="loan"
            value={selectedLoan}
            onChange={handleLoanChange}
            options={filterOptions.loan}
            isMulti
          />
        </div>

        <div className="flex flex-md-column gap-5 z-30">
          <div className="filter-group">
            <label htmlFor="startDate" className="block text-gray-700 mb-2">
              Start Date
            </label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={(date) => setStartDateLocal(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="text-black border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md p-2"
              placeholderText="YYYY-MM-DD"
              dateFormat="yyyy-MM-dd"
              style={{ width: "100%", height: "2.5rem" }}
            />
          </div>

          {/* End Date */}
          <div className="filter-group">
            <label htmlFor="endDate" className="block text-gray-700 mb-2">
              End Date
            </label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={(date) => setEndDateLocal(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="text-black border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border rounded-md p-2"
              placeholderText="YYYY-MM-DD"
              dateFormat="yyyy-MM-dd"
              style={{ width: "100%", height: "2.5rem" }}
            />
          </div>
        </div>

        <div className="relative right-0 mt-8">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
export default Myfilter;
