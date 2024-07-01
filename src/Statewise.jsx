import React, { useEffect, useState } from "react";
import Table from "./Mytable";
import Filter from "./Myfilter";
import Tab from "./Tab";
import { Loader } from "./Loader";

function Statewise() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState([]);
  const [selectedAge, setSelectedAge] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState([]);
  const [activeEndPoint, setActiveEndPoint] = useState("getStateData");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchApi = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`api/report1/${activeEndPoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          state: selectedState,
          city: selectedCity,
          pincode: selectedPincode,
          product: selectedProduct,
          campaign: selectedCampaign,
          age: selectedAge,
          loanAmount: selectedLoan,
          start_date: startDate,
          end_date: endDate,
          group_by: "state",
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [
    selectedState,
    selectedCity,
    selectedPincode,
    selectedCampaign,
    selectedProduct,
    selectedAge,
    selectedLoan,
    startDate,
    endDate,
    activeEndPoint,
  ]);

  useEffect(() => {
    filterAndSortData(data);
  }, [data]);

  const filterAndSortData = (data) => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    if (data[0] && data[0].newdata) {
      const transformedData = data.map((item) => ({
        state: item.newdata.state,
        ...item.newdata.counting.reduce((acc, entry) => {
          acc[entry.payment_date] = entry.percentage_pos;
          return acc;
        }, {}),
      }));
      setFilteredData(transformedData);
    } else {
      const transformedData = Object.entries(data).map(([state, dateData]) => ({
        state,
        ...dateData,
      }));
      setFilteredData(transformedData);
    }
  };

  return (
    <div className="max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-300">
        <Tab setActiveEndPoint={setActiveEndPoint} />
        <Filter
          setSelectedState={setSelectedState}
          setSelectedCity={setSelectedCity}
          setSelectedPincode={setSelectedPincode}
          setSelectedProduct={setSelectedProduct}
          setSelectedCampaign={setSelectedCampaign}
          setSelectedAge={setSelectedAge}
          setSelectedLoan={setSelectedLoan}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        {loading ? <Loader /> : <Table data={filteredData} error={error} />}
      </div>
    </div>
  );
}

export default Statewise;
