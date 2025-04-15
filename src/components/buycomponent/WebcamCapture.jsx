import React from "react";
import Webcam from "react-webcam"; // Ensure you've installed the `react-webcam` package

// WebcamCapture component that provides a webcam interface and capture functionality
const WebcamCapture = ({ capturePhoto }) => {
  return (
    // Container div for the webcam and capture button
    <div className="webcam-capture-container">
      {/* Webcam component with configurations for audio, dimensions, and format */}
      <Webcam
        audio={false} // Disable audio capture
        height={500} // Set webcam height
        screenshotFormat="image/jpeg" // Set screenshot format to JPEG
        width={500} // Set webcam width
        className="text-center" // Center-align the content
      >
        {/* Render prop function that provides access to the getScreenshot method */}
        {({ getScreenshot }) => (
          // Button to trigger photo capture
          <button
            onClick={() => {
              // Get the current webcam frame as a screenshot
              const imageSrc = getScreenshot();
              // If screenshot is successful, pass it to the parent component via callback
              if (imageSrc) {
                capturePhoto(imageSrc); // Callback function to capture photo
              }
            }}
            // Styling classes for the button
            className="mt-4 bg-[#edff8d] p-3 rounded-lg text-black"
          >
            Capture Photo
          </button>
        )}
      </Webcam>
    </div>
  );
};

export default WebcamCapture;