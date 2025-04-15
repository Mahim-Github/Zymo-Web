import { useState } from 'react';
import { carData } from "../../api/NewCarData";

// SearchBar component for filtering car data
const SearchBar = ({ setSearchResults }) => {
  // State for storing the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Handler for search input changes
  const setSearchResultsChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query) {
      // Filter cars based on name or model matching the query
      const filteredCars = carData.filter(car =>
        car.name.toLowerCase().includes(query.toLowerCase()) ||
        car.model.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredCars);
    } else {
      // Show all cars when search is empty
      setSearchResults(carData);
    }
  };

  return (
    // Search bar container with styling
    <div className="flex items-center border-2 border-darkGrey2 rounded-md px-3 py-1 max-w-full mx-auto gap-3 mt-2">
      {/* Search icon */}
      <i className="fa fa-search text-md text-[#e8ff81] sm:mr-2"></i>
      
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search car or model"
        value={searchQuery}
        onChange={setSearchResultsChange}
        className="outline-none bg-transparent text-white text-base"
      />
    </div>
  );
};

export default SearchBar;