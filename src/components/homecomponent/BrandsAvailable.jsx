import { useEffect, useRef } from "react";

const BrandsAvailable = () => {
    // Array of car brand names and their corresponding logo paths
    const brands = [
        { name: "Kia", logo: "/images/CarLogos/Kia.png" },
        { name: "Toyota", logo: "/images/CarLogos/toyota.png" },
        { name: "Mahindra", logo: "/images/CarLogos/mahindraa.png" },
        { name: "MG", logo: "/images/CarLogos/mg.png" },
        { name: "Tata", logo: "/images/CarLogos/tata.png" },
        { name: "Honda", logo: "/images/CarLogos/honda.png" },
        { name: "BMW", logo: "/images/CarLogos/bmw.png" },
        { name: "Mercedes-Benz", logo: "/images/CarLogos/mbenz.png" },
        { name: "Maruti", logo: "/images/CarLogos/suzuki.png" },
        { name: "Audi", logo: "/images/CarLogos/audi.png" },
    ];

    // Ref to access the scroll container DOM element
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current; // Get DOM element from ref
        let scrollAmount = 0; // Initialize scroll amount

        // Create a looped scroll effect using setInterval
        const scrollInterval = setInterval(() => {
            if (scrollContainer) {
                scrollAmount += 1; // Increase scroll amount
                scrollContainer.scrollLeft = scrollAmount; // Set horizontal scroll

                // If halfway through the total scroll width, reset back to start
                if (scrollAmount >= scrollContainer.scrollWidth / 2) {
                    scrollAmount = 0;
                }
            }
        }, 30); // Interval in milliseconds — controls scroll speed

        // Cleanup the interval when the component unmounts
        return () => clearInterval(scrollInterval);
    }, []);

    return (
        // Main container with padding and background
        <div className="text-white py-10">
            {/* Section title */}
            <h2 className="text-center text-xl font-bold mb-6">
                Brands Available
            </h2>

            {/* Scrolling container with styling */}
            <div className="bg-darkGrey2 rounded-lg p-6 py-8 mx-auto max-w-4xl overflow-hidden">
                {/* Inner scrollable row for logos */}
                <div
                    ref={scrollRef}
                    className="flex space-x-6 overflow-hidden whitespace-nowrap scroll-container"
                >
                    {/* Duplicate brand array for seamless looping scroll */}
                    {[...brands, ...brands].map((brand, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center flex-shrink-0 w-32"
                        >
                            {/* Brand logo */}
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="w-18 h-18"
                            />
                            {/* Brand name */}
                            <span className="text-sm mt-2">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandsAvailable;
