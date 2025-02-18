import React, { useEffect, useState } from "react";
import { FaChair } from "react-icons/fa";

const SelectSeatsModal = ({ showtime, onClose }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/showtimes/${showtime._id}/seats`);
                const data = await response.json();
                setSeats(data);
            } catch (error) {
                console.error("Error fetching seats:", error);
            }
        };
        fetchSeats();
    }, [showtime]);

    const handleSelectSeat = (seatNumber) => {
        setSelectedSeats((prev) =>
            prev.includes(seatNumber) ? prev.filter(s => s !== seatNumber) : [...prev, seatNumber]
        );
    };

    const handleBooking = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/showtimes/${showtime._id}/book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedSeats })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Booking successful!");
                onClose();
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Booking error:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Seats</h2>

                <div className="grid grid-cols-5 gap-3">
                    {seats.map((seat) => (
                        <button
                            key={seat.seatNumber}
                            className={`p-3 text-lg rounded flex justify-center items-center
                                ${seat.isBooked ? "bg-gray-400 text-white cursor-not-allowed" :
                                    selectedSeats.includes(seat.seatNumber) ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                                }`}
                            disabled={seat.isBooked}
                            onClick={() => handleSelectSeat(seat.seatNumber)}
                        >
                            <FaChair />
                        </button>
                    ))}
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
