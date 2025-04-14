import React, { useState, useEffect, useRef } from "react";

// Array containing benefits data with title and image source
const benefits = [
    { title: "Wide Range of Cars", imgSrc: "/images/Benefits/img-1-removebg-preview.png" },
    { title: "Quick and Easy Booking", imgSrc: "/images/Benefits/book.png" },
    { title: "No Hidden Charges", imgSrc: "/images/Benefits/img-9-removebg-preview.png" },
    { title: "Trusted by 100,00+ Happy Customers", imgSrc: "/images/Benefits/img-7.png" },
];

const Benefits = () => {
    // State to track visibility of each benefit box for animation
    const [visibleBoxes, setVisibleBoxes] = useState(Array(benefits.length).fill(false));
    
    // Ref to target the section element for intersection observer
    const sectionRef = useRef(null);

    useEffect(() => {
        // Intersection Observer callback function to trigger animation when the section is in view
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // When section is visible, set all boxes as visible (true)
                    setVisibleBoxes((prev) => prev.map(() => true));
                }
            },
            { threshold: 0.3 } // Trigger when 30% of the section is visible
        );

        // Start observing the section when it is mounted
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        // Cleanup the observer on component unmount
        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        // Main section wrapper with padding and ref for observer
        <section ref={sectionRef} className="text-white py-12">
            {/* Header section */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Zymo Benefits</h2>
            </div>

            {/* Container for all the benefit cards */}
            <div className="flex justify-center gap-8 px-6 flex-wrap bg-darkGrey">
                {/* Mapping through each benefit item to display */}
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        className={`
                            p-6 rounded-lg flex flex-col justify-center items-center w-[250px] md:w-[300px] text-center 
                            border border-[#faffa4] h-[200px]
                            transition-all duration-700 ease-in-out transform 
                            ${
                                // Apply animation classes based on visibility state
                                visibleBoxes[index] ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
                            }`}
                        // Staggered animation delay for each box
                        style={{ transitionDelay: `${index * 300}ms` }} 
                    >
                        {/* Image block, shown only if image source exists */}
                        {benefit.imgSrc && (
                            <img
                                src={benefit.imgSrc}
                                alt={benefit.title}
                                className={`w-16 h-16 mb-2 transition-opacity duration-700 ease-in-out ${
                                    visibleBoxes[index] ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        )}

                        {/* Benefit title text */}
                        <p className={`
                            text-[#faffa4] text-xl font-bold transition-opacity duration-700 ease-in-out 
                            ${visibleBoxes[index] ? "opacity-100" : "opacity-0"}
                        `}>
                            {benefit.title}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Benefits;
