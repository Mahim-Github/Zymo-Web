// Import the Card component
import Card from './Card';

// Cards component to render a list of car cards
const Cards = ({ cars }) => { // Destructure the 'cars' prop
    return (
        // Container for the grid of cards
        <div className="bg-darkGrey grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 py-6 my-3 rounded-lg mx-auto max-w-[1240px]">
            // Map through cars array to render individual Card components
            {cars && cars.map((car) => (
                <Card key={car.carId} car={car} />
            ))}
        </div>
    );
};

// Export the Cards component
export default Cards;