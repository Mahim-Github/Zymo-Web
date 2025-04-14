// Import useState hook and custom tracking hook
import { useState } from 'react'
import useTrackEvent from '../../hooks/useTrackEvent';

// Array of car type filters
const CarType = ["Automatic", "Hybrid", "Electric"];

// Filter component to handle car type filtering
const Filter = ({setFilterCar }) => {
  // State to track the currently selected filter
  const [selectedFilter, setSelectedFilter] = useState("Electric");
  // Custom hook for tracking events
  const trackEvent = useTrackEvent();

  // Function to handle the filter button click
  const handleFilterClick = (filter) => {
    setFilterCar(filter);
    setSelectedFilter(filter);
    trackEvent("Buy Section Filter Changed", "Buy Section Button Clicked", `${filter} Selected`);
  };

  return (
    <>
      // Container for filter buttons
      <div className="filter-container text-md flex justify-center my-3 mx-3 gap-2">
        // Map through CarType array to render filter buttons
        {CarType.map((typ, index) =>
          <button type="button"
          className={`p-2 px-5 rounded-2xl gap-1 transition-all ${
            selectedFilter === typ
              ? 'bg-white text-darkGrey'  // Selected filter color
              : 'bg-darkGrey2 text-white'  // Unselected filter color
          }`}
           key={index}
           onClick={()=> handleFilterClick(typ)}>{typ}</button>
        )}
      </div>
    </>
  )
}

// Export the Filter component
export default Filter