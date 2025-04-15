import {
  Camera,
  Images,
  Check,
  ChevronRight,
} from 'lucide-react';

// UploadSection component for handling image uploads (camera/gallery)
const UploadSection = ({ title, image, onUpload }) => {
return (
  // Main container for the upload section
  <div className="upload-section mb-8">
    {/* Header section with title and status icon */}
    <div className="flex items-center gap-2 mb-4">
      {/* Show ChevronRight if no image, else show Check mark */}
      {image == null ? (
        <ChevronRight />
      ) : (
        <Check size={30} className="text-[#edff8d] check-icon" />
      )}
      {/* Section title */}
      <h3 className="section-title">{title}</h3>
    </div>

    {/* Content section */}
    <div>
      {/* Button container for upload options */}
      <div className="flex justify-center gap-[75px]">
        {/* Camera upload button */}
        <button
          onClick={() => onUpload("camera")} // Trigger camera upload
          className="upload-button group"
        >
          <Camera size={28} className="mb-2 text-[#edff8d]" />
        </button>

        {/* Gallery upload button */}
        <button
          onClick={() => onUpload("gallery")} // Trigger gallery upload
          className="upload-button group"
        >
          <Images size={30} className="mb-2 text-[#edff8d]" />
        </button>
      </div>

      {/* Preview section for uploaded image */}
      {image && (
        <div className="mt-2 flex justify-center items-center">
          <img
            src={image} // Image source
            alt={title} // Alt text from title prop
            width={250} // Fixed width
            height={300} // Fixed height
            className="rounded-lg" // Styling
          />
        </div>
      )}
    </div>
  </div>
);
};

export default UploadSection;