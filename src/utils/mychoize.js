// Import helper functions
import { getVendorDetails, toPascalCase } from "./helperFunctions";
// Calculate total kilometers allowed based on trip duration and rate plans
const getTotalKms = (tripDurationHours) => {
    return {
        FF: `${(120 / 24) * tripDurationHours} KMs`, // Fixed Fare - 120 KM/Day
        MP: `${(300 / 24) * tripDurationHours} KMs`, // Monthly Plan - 300 KM/Day
        DR: "Unlimited KMs", // Daily Rental - Unlimited KM
    };
};
// Return readable string for each rate basis
const findPackage = (rateBasis) => {
    if (rateBasis === "FF") return "120km/day";
    if (rateBasis === "MP") return "300km/day";
    if (rateBasis === "DR") return "Unlimited KMs";
    return "Undefined";
};
// Format date to MyChoize API expected format
const formatDateForMyChoize = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return null; // Handle invalid date input
    return `\/Date(${date.getTime()}+0530)\/`;
};
// Utility to retry fetch request on failure, with exponential delay
const fetchWithRetry = async (url, options, retries = 5, delay = 500) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error("MyChoize API error");
            return await response.json();
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i < retries - 1)
                await new Promise((res) => setTimeout(res, delay * (i + 1)));
        }
    }
    throw new Error("MyChoize API failed after multiple retries.");
};
// API URL from environment variable
let apiUrl = import.meta.env.VITE_FUNCTIONS_API_URL;
// const apiUrl = "http://127.0.0.1:5001/zymo-prod/us-central1/api";

// Fetch subscription cars (MLK plan) from MyChoize
const fetchSubscriptionCars = async (CityName, formattedPickDate, formattedDropDate) => {
    try {
        const response = await fetch(`${apiUrl}/mychoize/search-cars`, {
            method: "POST",
            body: JSON.stringify({
                data: {
                    CityName,
                    PickDate: formattedPickDate,
                    DropDate: formattedDropDate,
                },
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error("MyChoize API error");

        const mychoizeData = await response.json();
        // Ensure response contains expected model
        if (!mychoizeData.SearchBookingModel) {
            console.error("MyChoize API response missing expected data.");
            return [];
        }

        // Filter cars where RateBasis is "MLK"
        const subscriptionCars = mychoizeData.SearchBookingModel
            .filter((car) => car.RateBasis === "MLK" && car.BrandName)
            .map((car) => ({
                id: car.TariffKey,
                brand: toPascalCase(car.BrandName.split(" ")[0]),
                name: toPascalCase(car.BrandName.split(" ")[1]),
                options: [car.TransMissionType, car.FuelType, `${car.SeatingCapacity} Seats`],
                address: car.LocationName,
                locationkey: car.LocationKey,
                hourly_amount: car.PerUnitCharges,
                images: [car.VehicleBrandImageName],
                ratingData: { text: "No ratings available" },
                extrakm_charge: `₹${car.ExKMRate}/km`,
                trips: car.TotalBookinCount,
                source: "mychoize",
                sourceImg: "/images/ServiceProvider/mychoize.png",
                fare: `₹${car.TotalExpCharge}`, // Directly assign fare
                rateBasis: car.rateBasis,
            }));

        return subscriptionCars;
    } catch (error) {
        console.error("MyChoize API failed:", error);
        return [];
    }
};
// Fetch regular MyChoize cars (non-subscription) and group by car type
const fetchMyChoizeCars = async (
    CityName,
    formattedPickDate,
    formattedDropDate,
    tripDurationHours
) => {
    // Retry-enabled API fetch
    try {
        const mychoizeData = await fetchWithRetry(
            `${apiUrl}/mychoize/search-cars`,
            {
                method: "POST",
                body: JSON.stringify({
                    data: {
                        CityName,
                        PickDate: formattedPickDate,
                        DropDate: formattedDropDate,
                    },
                }),
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!mychoizeData.SearchBookingModel) {
            console.error("MyChoize API response missing expected data.");
            return [];
        }
         // Group cars by GroupKey and enrich car info
        const groupedCars = {};
        mychoizeData.SearchBookingModel.filter(
            (car) => car.RateBasis !== "MLK" && car.BrandName
        ).forEach((car) => {
            const key = car.GroupKey;

            if (!groupedCars[key]) {
                groupedCars[key] = {
                    id: car.TariffKey,
                    brand: toPascalCase(car.BrandName.split(" ")[0]),
                    name: toPascalCase(car.BrandName.split(" ")[1]),
                    options: [
                        car.TransMissionType,
                        car.FuelType,
                        `${car.SeatingCapacity} Seats`,
                    ],
                    address: car.LocationName,
                    location_id: car.LocationKey,
                    hourly_amount: car.PerUnitCharges,
                    images: [car.VehicleBrandImageName],
                    ratingData: { text: "No ratings available" },
                    total_km: getTotalKms(tripDurationHours),
                    extrakm_charge: `₹${car.ExKMRate}/km`,
                    trips: car.TotalBookinCount,
                    source: "mychoize",
                    sourceImg: "/images/ServiceProvider/mychoize.png",
                    rateBasisFare: {},
                    all_fares: [],

                    brandGroundLength: car.BrandGroundLength,
                    brandKey: car.BrandKey,
                    brandLength: car.BrandLength,
                    fuelType: car.FuelType,
                    groupKey: car.GroupKey,
                    locationKey: car.LocationKey,
                    luggageCapacity: car.LuggageCapacity,
                    rftEngineCapacity: car.RFTEngineCapacity,
                    seatingCapacity: car.SeatingCapacity,
                    tariffKey: car.TariffKey,
                    transmissionType: car.TransmissionType,
                    vtrHybridFlag: car.VTRHybridFlag,
                    vtrSUVFlag: car.VTRSUVFlag,
                };
            }
             // Add fare based on rate basis
            groupedCars[key].rateBasisFare[car.RateBasis] = car.TotalExpCharge;
            Object.values(groupedCars[key].rateBasisFare).forEach((fare) => {
                if (!groupedCars[key].all_fares.includes(fare)) {
                    groupedCars[key].all_fares.push(fare);
                }
            });
        });

        // Get vendor details (like pricing multiplier)
        const vendorData = await getVendorDetails("mychoize");
        // Format grouped cars with minimum and inflated fare
        return Object.values(groupedCars).map((car) => ({
            ...car,
            fare: `₹${Math.min(...car.all_fares)}`,
            inflated_fare: `₹${parseInt(vendorData?.CurrentrateSd * Math.min(...car.all_fares))}`,
        }));
    } catch (error) {
        console.error(error.message);
        return [];
    }
};

// Fetch list of locations available in MyChoize for a given city and date
const fetchMyChoizeLocationList = async (
    city,
    formattedDropDate,
    formattedPickDate
) => {

    try {
        const response = await fetch(`${apiUrl}/mychoize/location-list`, {
            method: "POST",
            body: JSON.stringify({
                data: {
                    CityName: city,
                    PickDate: formattedPickDate,
                    DropDate: formattedDropDate,
                },
            }),
            headers: { "Content-Type": "application/json" },
        });
        return response.json();
    } catch (error) {
        console.error(error.message);
    }
};
// Export utility and fetch functions
export {
    findPackage,
    fetchMyChoizeCars,
    fetchMyChoizeLocationList,
    formatDateForMyChoize,
    fetchSubscriptionCars
};
