import React, { useState } from "react";

const SelectSeatsModal = ({ showtime, onClose }) => {
    const [numSeats, setNumSeats] = useState(1);

    const handleBooking = () => {
        alert(`You have selected ${numSeats} seats for ${showtime.time}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform scale-105">
                <h2 className="text-2xl font-bold text-gray-800">Select Number of Seats</h2>
                <p className="text-gray-500">{showtime.time} - {showtime.date}</p>

                <div className="mt-4">
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={numSeats}
                        onChange={(e) => setNumSeats(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                    <button onClick={handleBooking} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default SelectSeatsModal;
