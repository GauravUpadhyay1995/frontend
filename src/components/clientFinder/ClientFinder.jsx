import React, { useState, useEffect } from 'react';
import axios from "../../utils/apiclient";
import { MdBlock } from "react-icons/md";

function ClientFinder() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [tot, settot] = useState(10)

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(currentPage);
  };


  const handleSearchQueryChange = (event) => {
    setCurrentPage(1);
    setSearchQuery(event.target.value);
  };


  const handleReset = () => {
    setSearchQuery('')
    setItemsPerPage(10)
    setCurrentPage(1);
  };

  const getToken = () => localStorage.getItem('token');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/clientFinder/fetchClients',
          { filter: searchQuery, page: currentPage, limit: itemsPerPage },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        setFilteredCompanies(response.data.data); // Adjust based on actual API response structure
        settot(response.data.tot_count); // Adjust based on actual API response structure
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const debounceFetch = setTimeout(fetchData, 300); // Debounce API calls
    return () => clearTimeout(debounceFetch);
  }, [searchQuery, currentPage, itemsPerPage, setCurrentPage]); // Removed limit from dependencies

  return (
    <div className="container mx-auto p-4 border">
      <div className="flex flex-col md:flex-row items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search for an agency"
        />
        <button
          onClick={handleReset}
          className="mt-2 md:mt-0 md:ml-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Reset
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-gray-700">
          Items per page:
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map(company => (
          <div key={company.id} className="p-4 border border-gray-300 rounded-md shadow-md">

            <h3 className="text-xl font-bold mb-2">{company.client_name}</h3>
            <p className="text-gray-700">{company.state} , {company.city} , {company.pincode}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <>

          <button
            disabled={currentPage === 1 ? true : ""}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700 ${currentPage === 1 ? "cursor-not-allowed" : ""}`}
          >
            Prev
          </button>
          <button
            disabled={(filteredCompanies.length === 0 || tot < itemsPerPage || tot === 0) ? true : ""}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700 ${(filteredCompanies.length === 0 || tot < itemsPerPage || tot === 0) ? "cursor-not-allowed" : ""}`}
          >
            Next
          </button>
        </>
      </div>
    </div >
  );
}

export default ClientFinder;