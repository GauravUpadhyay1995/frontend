import React, { useEffect, useState } from 'react';
import { companies } from './data';

function AgencyFinder() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(companies);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);

 
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); 
  };


  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };


  const handleSearch = () => {
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompanies(filtered);
    setCurrentPage(1); 
  };



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
          onClick={handleSearch}
          className="mt-2 md:mt-0 md:ml-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
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
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map(company => (
          <div key={company.id} className="p-4 border border-gray-300 rounded-md shadow-md">
            <img src={company.image} alt={company.name} className="w-full h-32 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold mb-2">{company.name}</h3>
            <p className="text-gray-700">{company.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AgencyFinder;
