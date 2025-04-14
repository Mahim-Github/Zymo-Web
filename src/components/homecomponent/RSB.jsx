import { MapPinIcon, CalendarIcon, SparklesIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadScriptNext, Autocomplete } from "@react-google-maps/api";
import { toast } from "react-toastify";
import { getCurrentTime } from "../../utils/DateFunction.js";

const RSB = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState("rent"); // Toggle between rent/buy
    const [place, setPlace] = useState(null); // Full place details with lat/lng
    const [autocomplete, setAutocomplete] = useState(null); // Google Autocomplete object
    const [city, setCity] = useState(""); // Parsed city name from address
    const [address, setAddress] = useState(""); // Formatted address
    const [startDate, setStartDate] = useState(getCurrentTime()); // Rental start datetime
    const [endDate, setEndDate] = useState(""); // Rental end datetime
    const [tripDuration, setTripDuration] = useState("Select both dates"); // Duration text
    const [fade, setFade] = useState(false); // For header fade animation

    const navigate = useNavigate();

    // --- HEADER TEXT ANIMATION ---
    const headerTexts = [
        "Smart rentals, easy driving",
        "Affordable rides for less",
        "Great deals, Smooth drives",
        "Drive more, Spend less",
        "Compare and save on rental",
    ];
    const [headerIndex, setHeaderIndex] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true); // Trigger fade
            setTimeout(() => {
                setHeaderIndex((prev) => (prev + 1) % headerTexts.length); // Cycle headers
                setFade(false); // End fade
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // --- GOOGLE PLACES API SETUP ---
    const placesAPILibraries = useMemo(() => ["places"], []); // Memoize to prevent unnecessary re-renders
    const placesAPIKey = import.meta.env.VITE_PLACES_API_KEY;

    // Called on place selection
    const handlePlaceSelect = () => {
        if (autocomplete) {
            const placeDetails = autocomplete.getPlace();
            if (placeDetails.geometry) {
                const lat = placeDetails.geometry.location.lat();
                const lng = placeDetails.geometry.location.lng();

                setPlace({ name: placeDetails.name, lat, lng });

                // Extract a simplified address
                let address = placeDetails.formatted_address.split(",");
                address = address.length > 2
                    ? `${address[0]}, ${address[1]}, ${address.at(-2)}`
                    : address.join(", ");
                setAddress(address);

                // Get city from address_components
                const cityComponent = placeDetails.address_components.find(
                    (comp) => comp.types.includes("locality")
                );

                if (cityComponent) {
                    setCity(cityComponent.long_name);
                    console.log(cityComponent.long_name);
                } else {
                    console.error("No city found");
                    setCity("");
                }
            }
        }
    };

    // --- TRIP DURATION CALCULATION ---
    const calculateDuration = (start, end) => {
        const startTime = new Date(start);
        const endTime = new Date(end);

        if (isNaN(startTime) || isNaN(endTime)) {
            setTripDuration("Invalid Date");
            return;
        }

        const diff = endTime - startTime;
        if (diff < 0) {
            setTripDuration("0 Day(s) 0 Hour(s)");
            return;
        }

        const totalHours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;

        setTripDuration(`${days} Day(s) ${hours} Hour(s)`);
    };

    // --- INPUT DATE HANDLING ---
    const startInputRef = useRef(null);
    const endInputRef = useRef(null);

    const handleStartDateClick = () => {
        if (startInputRef.current) startInputRef.current.showPicker();
    };
    const handleEndDateClick = () => {
        if (endInputRef.current) endInputRef.current.showPicker();
    };

    const handleStartDateChange = (e) => {
        const newStart = e.target.value;
        setStartDate(newStart);
        if (endDate) calculateDuration(newStart, endDate);
    };

    const handleEndDateChange = (e) => {
        const newEnd = e.target.value;
        setEndDate(newEnd);
        if (startDate) calculateDuration(startDate, newEnd);
    };

    // --- SEARCH ACTION ---
    const handleSearch = () => {
        if (city && startDate && endDate) {
            const { lat, lng } = place;
            const formattedCity = city === "Bengaluru" ? "bangalore" : city.toLowerCase();

            const searchData = {
                address,
                lat,
                lng,
                startDate,
                endDate,
                tripDuration,
            };

            sessionStorage.setItem("fromSearch", true); // flag for post navigation logic

            // Redirect to the filtered results page
            navigate(`/self-drive-car-rentals/${formattedCity}/cars`, {
                state: searchData,
            });
        } else {
            // Show error if any required field is missing
            toast.error("Required fields are empty", {
                position: "top-center",
                autoClose: 5000,
            });
        }
    };

    return (
        // Main container with background, padding, and centering
        <div className=" bg-[#212121] p-4 flex items-center justify-center my-5 mt-7">
            <div className="w-full max-w-lg space-y-4 p-2 py-4 rounded-lg">
    
                {/* Header with dynamic text and icons */}
                <div className="bg-[#303030] rounded-full p-3">
                    <h1
                        className={`text-white text-center text-md transition-opacity duration-500 ${
                            fade ? "opacity-0" : "opacity-100"
                        }`}
                    >
                        <SparklesIcon className="inline-block w-5 h-5 mr-2 text-[#faffa4]" />
                        {headerTexts[headerIndex]}
                        <SparklesIcon className="inline-block w-5 h-5 ml-2 text-[#faffa4]" />
                    </h1>
                </div>
    
                {/* Book Now section title with horizontal lines */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="w-20 h-[1px] bg-gray-500"></div>
                        <h2 className="text-gray-400 font-normal">BOOK NOW</h2>
                        <div className="w-20 h-[1px] bg-gray-500"></div>
                    </div>
    
                    {/* Tabs for Rent, Subscribe, Buy */}
                    <div className="flex justify-center gap-8 mb-6">
                        <button
                            onClick={() => setActiveTab("rent")}
                            className={`text-lg ${
                                activeTab === "rent"
                                    ? "text-white border-b-2 border-white"
                                    : "text-gray-400"
                            }`}
                        >
                            Rent
                        </button>
                        <button
                            onClick={() => setActiveTab("subscribe")}
                            className={`text-sm ${
                                activeTab === "subscribe"
                                    ? "text-white border-b-2 border-white"
                                    : "text-gray-400"
                            }`}
                        >
                            Subscribe
                        </button>
                        <button
                            onClick={() => setActiveTab("buy")}
                            className={`text-sm ${
                                activeTab === "buy"
                                    ? "text-white border-b-2 border-white"
                                    : "text-gray-400"
                            }`}
                        >
                            Buy
                        </button>
                    </div>
    
                    {/* Location input with Google Places Autocomplete */}
                    <LoadScriptNext googleMapsApiKey={placesAPIKey} libraries={placesAPILibraries}>
                        <div className="bg-[#303030] rounded-full py-3 px-6 flex justify-between items-center mb-4">
                            <div className="flex items-center flex-grow">
                                <MapPinIcon className="w-6 h-5 text-gray-400 mr-2" />
                                <Autocomplete
                                    onLoad={setAutocomplete}
                                    onPlaceChanged={handlePlaceSelect}
                                    options={{ componentRestrictions: { country: "IN" } }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Enter a location"
                                        className="bg-[#303030] text-white outline-none w-full pl-2"
                                    />
                                </Autocomplete>
                            </div>
    
                            {/* Button for using current location */}
                            <button className="flex flex-col items-center text-white text-xs hover:text-[#faffa4]">
                                <img src="../public/images/Benefits/Group_1-removebg-preview.png" alt="Current Location" className="w-5 h-5" />
                                <span>Current Location</span>
                            </button>
                        </div>
                    </LoadScriptNext>
    
                    {/* Date pickers for start and end date */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Start date picker */}
                        <div
                            className="bg-[#303030] rounded-full p-2 flex items-center relative cursor-pointer text-sm"
                            onClick={handleStartDateClick}
                        >
                            <CalendarIcon className="w-6 h-5 text-gray-400 absolute left-3 " />
                            <input
                                type="datetime-local"
                                step="3600"
                                ref={startInputRef}
                                value={startDate}
                                onChange={handleStartDateChange}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />
                            <span className="text-white pl-8">
                                {startDate
                                    ? new Intl.DateTimeFormat("en-US", {
                                          month: "short",
                                          day: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                      }).format(new Date(startDate))
                                    : "Select Date"}
                            </span>
                        </div>
    
                        {/* End date picker */}
                        <div
                            className="bg-[#303030] rounded-full p-2 flex items-center relative cursor-pointer text-sm"
                            onClick={handleEndDateClick}
                        >
                            <CalendarIcon className="w-6 h-5 text-gray-400 absolute left-3" />
                            <input
                                type="datetime-local"
                                step="3600"
                                ref={endInputRef}
                                value={endDate}
                                onChange={handleEndDateChange}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />
                            <span className="text-white pl-8">
                                {endDate
                                    ? new Intl.DateTimeFormat("en-US", {
                                          month: "short",
                                          day: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                      }).format(new Date(endDate))
                                    : "Select End Date"}
                            </span>
                        </div>
                    </div>
    
                    {/* Display calculated trip duration */}
                    <div className="bg-[#303030] rounded-full p-2 mb-4">
                        <div className="text-gray-400 text-sm">
                            Trip Duration
                        </div>
                        <div className="text-white text-lg">{tripDuration}</div>
                    </div>
    
                    {/* Search button */}
                    <button
                        onClick={handleSearch}
                        className="w-full bg-[#eeff87] hover:bg-[#e2ff5d] text-black font-medium py-3 rounded-full transition-colors"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );    
};

export default RSB;
