import { useEffect, useRef } from "react";

const ServiceProvider = () => {
    // Array of brand objects containing name and logo path
    const brands = [
        { name: "avis", logo: "/images/ServiceProvider/avis.png" },
        { name: "carronrent", logo: "/images/ServiceProvider/carronrent.png" },
        { name: "doorcars", logo: "/images/ServiceProvider/doorcars.jpeg" },
        { name: "rnex", logo: "/images/ServiceProvider/renx.jpeg" },
        { name: "wheelup", logo: "/images/ServiceProvider/wheelup.png" },
        { name: "zoomcars", logo: "/images/ServiceProvider/zoomcars.png" },
    ];

    // Ref for the scroll container element
    const scrollRef = useRef(null);

    // Effect for auto-scrolling functionality
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        let scrollAmount = 0;

        // Set up interval for continuous scrolling
        const scrollInterval = setInterval(() => {
            if (scrollContainer) {
                scrollAmount += 1;
                scrollContainer.scrollLeft = scrollAmount;

                // Reset scroll position when halfway through
                if (scrollAmount >= scrollContainer.scrollWidth / 2) {
                    scrollAmount = 0; // Reset scroll
                }
            }
        }, 30); // Adjust speed

        // Clean up interval on component unmount
        return () => clearInterval(scrollInterval);
    }, []);

    // Component render
    return (
        <div className="text-white py-10">
            {/* Section title */}
            <h2 className="text-center text-xl font-bold mb-6">
                Service Provider
            </h2>
            
            {/* Scrollable container */}
            <div className="bg-darkGrey2 rounded-lg p-6 py-8 mx-auto max-w-4xl overflow-hidden">
                {/* Horizontal scroll container with brands */}
                <div
                    ref={scrollRef}
                    className="flex space-x-6 overflow-hidden whitespace-nowrap scroll-container"
                >
                    {/* Duplicate brands array to create seamless loop effect */}
                    {[...brands, ...brands].map((brand, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center flex-shrink-0 w-32 h-32"
                        >
                            {/* Brand logo container */}
                            <div className="w-24 h-24 flex items-center justify-center bg-white rounded-lg">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            {/* Brand name */}
                            <span className="text-sm mt-2">{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceProvider;