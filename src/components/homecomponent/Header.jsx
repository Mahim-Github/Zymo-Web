import React from 'react';

// Header component to display the main slogan and subheading
const Header = () => {
    return (
        <>
            {/* Main banner container with background color, padding, and spacing */}
            <div className="bg-yellow text-white p-4 py-10 text-center my-2">
                
                {/* Primary heading with large bold text */}
                <h1 className="text-white text-3xl font-bold">
                    Drive Your Dreams with Zymo
                </h1>

                {/* Subheading with smaller, muted gray text */}
                <h4 className="text-gray-400 text-md mt-2">
                    Experience the future of car rentals. Book, drive, and explore with ease.
                </h4>
            </div>
        </>
    );
};

export default Header;
