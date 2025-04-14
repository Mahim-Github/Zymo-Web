import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroImage = () => {
  // Array of hero image URLs to display in the carousel
  const images = [
    "/images/HeroImages/hero_img_1.jpg",
    "/images/HeroImages/hero_img_2.jpg",
  ];

  // State to keep track of which image is currently being shown
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect to automatically change image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Loop back to the first image when reaching the end
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // 4000ms = 4 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // React Router's hook to navigate to different routes programmatically
  const navigate = useNavigate();

  return (
    // Container for the hero section with fixed max width and rounded corners
    <div className="relative w-[100%] max-w-5xl mx-auto overflow-hidden rounded-lg z-10">
      {/* Wrapper that handles sliding animation of images */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }} // Moves carousel
      >
        {/* Map over image array and render each one */}
        {images.map((carimg, index) => (
          <img
            key={index}
            src={carimg}
            alt={`Hero section ${index + 1}`} // Accessibility alt text
            className="w-full h-auto flex-shrink-0 object-cover rounded-lg cursor-pointer"
            onClick={() => navigate("/buy")} // Navigate to /buy on image click
          />
        ))}
      </div>
    </div>
  );
};

export default HeroImage;
