import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

// TestDrivePopup component for displaying test drive options
const TestDrivePopup = ({ title, isOpen, close, id, carDetail }) => {
  const navigate = useNavigate(); // Get the navigate function from react-router

  // Return null if popup is not open
  if (!isOpen) return null;

  // Update document title when title prop changes
  useEffect(() => {
    document.title = title;
  }, [title]);

  // Handler for navigation to summary page
  const handleNavigate = () => {
    navigate(`/buy/summary/${id}`, {
      state: { car: carDetail }, // Pass car details as state
    });
  };

  return (
    <>
      {/* SEO and meta tags management */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Book a test drive with Zymo and experience your next car before making a decision!" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Schedule a test drive with Zymo and get behind the wheel of your next car." />
        <link rel="canonical" href="https://zymo.app/testdrive" />
      </Helmet>

      {/* Popup overlay and container */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        {/* Popup content */}
        <div className="bg-[#212121] text-white p-6 rounded-lg w-80 shadow-lg">
          {/* Popup title */}
          <h2 className="text-xl font-semibold text-center mb-4">
            Choose Test Drive Option
          </h2>
          
          {/* Standard test drive option */}
          <div className="bg-[#2d2d2d] border border-white/10 p-4 rounded-lg text-center mb-4">
            <h3 className="text-lg font-semibold">Test Drive</h3>
            <p className="text-sm text-gray-300">
              Visit our showroom for a comprehensive test drive experience
            </p>
          </div>

          {/* Extended test drive option (clickable) */}
          <button onClick={handleNavigate} className="block w-full">
            <div className="bg-[#faffa4] text-black p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold">Extended Test Drive</h3>
              <p className="text-sm">
                Starts @₹52,500/-. Experience the car for a month with a refundable security deposit
              </p>
            </div>
          </button>

          {/* Close button */}
          <button
            className="mt-4 w-full bg-red-400 hover:bg-red-500 text-black py-2 rounded-lg"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default TestDrivePopup;