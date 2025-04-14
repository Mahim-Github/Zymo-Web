// PaymentConfirmationPage component to display payment confirmation modal
const PaymentConfirmationPage = ({ isOpen, close }) => {
  // console.log("Confirm page");
  return (
    <>
      // Conditional rendering of the modal based on isOpen prop
      {isOpen && (
        // Modal overlay with backdrop
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          // Modal content container
          <div className="bg-darkGrey2 rounded-lg shadow-lg p-6 w-80 text-center">
            // Loading spinner container
            <div className="font-bold w-16 h-16 bg-[#faffa4] rounded-full flex items-center justify-center mx-auto text-darkGrey2">
              // Loading spinner
              <div className="animate-spin rounded-full border-t-4 border-b-4 border-[#faffa4] w-8 h-8"></div>
            </div>
            // Modal title
            <h2 className="text-xl font-bold mt-4 text-white">Checking your payment...</h2>
            // Modal description
            <p className="text-white mt-2">Please wait while we confirm your payment status.</p>
          </div>
        </div>
      )}
    </>
  );
};

// Export the PaymentConfirmationPage component
export default PaymentConfirmationPage;