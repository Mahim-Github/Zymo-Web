import React from 'react';

export default function StepsofZymo() {
  return (
    <div>
      {/* Main container with dark background */}
      <div className="bg-[#212121] text-white p-6">
        {/* Centered content with max width */}
        <div className="max-w-4xl mx-auto">
          {/* Section heading */}
          <h2 className="text-2xl font-bold text-center">
            A quick guide to ZYMO
          </h2>
          {/* Subheading with gray text */}
          <p className="text-gray-400 mb-8 text-center">
            Here's how the Zymo works, step by step:
          </p>

          {/* Timeline container */}
          <div className="relative flex flex-col items-center">
            {/* Vertical timeline line */}
            <div className="w-1 bg-gray-300 absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2"></div>
            
            {/* Mapping through steps array to render each timeline item */}
            {[
              {
                title: "Getting Started",
                text: "The user logs into Zymo, enters source, and time. Zymo shows a list of rental cars, enabling easy comparison by price, type, and features.",
                image: "/images/About/image1.png",
              },
              {
                title: "Choosing & Confirming Booking",
                text: "The user selects the best-fit car after comparing options. Key details are shown before confirming the booking.",
                image: "/images/About/confirmbooking.jpeg",
              },
              {
                title: "Payment & Confirmation",
                text: "Payment is completed securely. Booking confirmation is sent instantly via email and WhatsApp.",
                image: "/images/About/image3.png",
              },
              {
                title: "Car Usage & Return",
                text: "The user picks up the car, uses it during the booked time, and returns it hassle-free.",
                image: "/images/About/image4.png",
              },
              {
                title: "Providing Feedback",
                text: "After the trip, the user rates the service and shares feedback, helping others choose better.",
                image: "/images/About/image5.png",
              },
            ].map((step, index) => (
              // Timeline item container
              <div key={index} className="flex items-center mb-8 w-full relative">
                {/* Left side (image) */}
                <div className="w-1/2 pr-6 flex justify-end">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full max-w-[250px] h-auto rounded object-cover"
                    style={{ maxHeight: '200px', objectFit: 'contain' }} // Image styling
                  />
                </div>
                {/* Timeline dot */}
                <div className="w-4 h-4 bg-white rounded-full absolute left-1/2 transform -translate-x-1/2"></div>
                {/* Right side (text content) */}
                <div className="w-1/2 pl-6 relative">
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-gray-300">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}