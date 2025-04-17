import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, addDoc } from "firebase/firestore";
import { webDB } from "../../utils/firebase";
import useTrackEvent from '../../hooks/useTrackEvent';

// Component for confirming a test drive booking
const TestDriveConfirmPage = ({ title }) => {
  // Router hooks for navigation and location state
  const location = useLocation();
  const navigate = useNavigate();
  const trackEvent = useTrackEvent();

  // Refs to track processing state
  const isProcessing = useRef(false);
  const eventTracked = useRef(false);
  const processingComplete = useRef(false);

  // Extract car and user data from location state
  const { car, userData } = location.state || {};  
  
  // Get API URL from environment variables
  const functionsUrl = import.meta.env.VITE_FUNCTIONS_API_URL;

  // Effect to set document title
  useEffect(() => {
    document.title = title;
  }, [title]);

  // Callback to send WhatsApp confirmation message
  const sendWhatsAppMessage = useCallback(async (bookingData) => {
    try {
      const response = await fetch(`${functionsUrl}/message/test-drive-whatsapp-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingData }),
      });

      const data = await response.json();
      // Clear storage after successful message
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
    }
  }, [functionsUrl]);

  // Callback to upload booking data to Firebase
  const uploadDataToFirebase = useCallback(async(bookingData) => {
    try {
      const data = {
        carId: bookingData.carId,
        bookingId: 'Z' + new Date().getTime().toString(),
        carName: bookingData.name,
        carModel: bookingData.model,
        carType: bookingData.type,
        userName: bookingData.userName,
        email: bookingData.email,
        phone: bookingData.phone,
        dob: bookingData.dob,
        address: bookingData.address,
        city: bookingData.city,
        pincode: bookingData.pincode,
        price: bookingData.totalAmount,
        bookingType: "Test Drive",
        createdAt: new Date(),
      };
  
      await addDoc(collection(webDB, "BuySectionBookingDetail"), data);
    } catch (error) {
      console.error("Error uploading documents to Firebase:", error);
    }
  }, []);

  // Effect to process booking when component mounts
  useEffect(() => {
    const processBooking = async () => {
      // Skip if no data or already processing
      if (!car || !userData || isProcessing.current || processingComplete.current) {
        return;
      }

      try {
        isProcessing.current = true;
        const bookingData = { 
          ...car, 
          ...userData,
        };

        // Process both operations in parallel
        await Promise.all([
          sendWhatsAppMessage(bookingData),
          uploadDataToFirebase(bookingData)
        ]);
        
        // Track event only once
        if (!eventTracked.current) {
          trackEvent("Test Drive Booking", "Test Drive", "Payment Successful/Booking Confirmed");
          eventTracked.current = true; 
        }

        processingComplete.current = true;

      } catch (error) {
        console.error('Error processing booking:', error);
      } finally {
        isProcessing.current = false;
      }
    };

    processBooking();
  }, [car, userData, sendWhatsAppMessage, uploadDataToFirebase, trackEvent]);
  
  // Effect to auto-navigate after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 8000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  // Handler for manual navigation button
  const handlesubmit = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/', { replace: true })
  }

  return (
    <>
      {/* SEO meta tags */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Confirm your test drive details and get ready to experience your selected car with Zymo!" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Thank you for booking your test drive with Zymo. Check your confirmation details here." />
        <link rel="canonical" href="https://zymo.app/buy/test-drive-confirmpage" />
      </Helmet>
      
      {/* Confirmation UI */}
      <div className="flex items-center justify-center min-h-screen bg-[#212121]">
        <div className="w-full max-w-md p-6 bg-[#2c2c2c] border rounded-lg shadow-lg border-appColor text-center transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-semibold text-appColor mt-3">
            Your Test Drive Has Been Confirmed! 🚗
          </h2>
          <p className="text-gray-200 mt-2 text-lg">
            Thank you for booking a test drive with <b>Zymo</b>. We have scheduled
            your appointment, and you will receive further details soon.
          </p>
          <p className="text-gray-200 mt-2 text-lg">
            🚀 Get ready to experience your car on real roads!
          </p>
          <p className="text-gray-200 font-medium mt-4 text-lg">
            📅 Check your email for confirmation details.
          </p>

          <button
            onClick={handlesubmit}
            className="mt-6 bg-appColor text-[#212121] hover:bg-appColor py-2 px-4 rounded-lg text-lg font-semibold transition duration-300"
          >
            Go to Home
          </button>
        </div>
      </div>
    </>
  );
};
 
export default TestDriveConfirmPage;