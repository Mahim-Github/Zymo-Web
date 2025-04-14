import { Link } from 'react-router-dom';

// Card component to display car details
const Card = ( {car} ) => {
    
    return (

        // Main container for the card
        <div className="flex flex-col md:flex-row bg-[#303030] border border-gray-500 rounded-2xl p-4 py-1 text-white mx-auto w-full max-w-[900px] min-h-[300px] md:items-center">

            // Left Section: Car Details
            <div className="flex md:flex-col justify-between w-full md:w-1/3 text-center md:text-left gap-8">
                <div>
                    <h2 className="text-2xl font-bold">{car.name}</h2>
                    <p className="text-xl">{car.model}</p>
                </div>
                <div className="mt-2">
                    <div className="text-center md:text-start mb-1">
                        <span className="text-sm text-[#faffa4]">★ {car.rating}</span>
                    </div>
                    <div className="text-sm text-gray-400 flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-1">
                            <i className="fa fa-user-group"></i>
                            <span>{car.passengers} Passengers</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <i className="fa-solid fa-gear"></i>
                            <span>{car.transmission}</span>
                        </div>
                    </div>
                </div>
            </div>

            // Center Section: Car Image
            <div className="relative flex items-center justify-center rounded-xl p-1 w-full md:w-auto mt-4 md:mt-0">
                <img
                loading='lazy'
                    src="/images/Cars/newtnexcar.png"
                    alt={car.name}
                    className="h-auto object-contain rounded-xl w-full md:w-auto max-h-50 p-2 hover:scale-100 transition-transform duration-700"
                />
            </div>

            // Right Section: Price & CTA
            <div className="flex md:flex-col items-center md:items-end text-center md:text-right justify-between w-full md:w-1/3 mt-4 md:mt-0 gap-8">
                <div>
                    <div className='p-0'>
                        <p className="text-lg font-bold">₹{`${car.price.min_price}-${car.price.max_price}`} Lakh</p>
                        <p className="text-sm text-gray-400">onwards</p>
                        <p className="text-xs text-right mb-4">Avg. Ex-Showroom price</p>
                    </div>
                </div>
                <Link to={`/buy/car-details/${car.carId}`} className="mt-3">
                    <button className="w-20 h-10 rounded-lg bg-[#faffa4] flex items-center justify-center hover:bg-[#dff566] transition-colors">
                        <i className="fa-solid fa-arrow-right text-darkGrey2"></i>
                    </button>
                </Link>
            </div>
        </div>

    );
};

// Export the Card component
export default Card;