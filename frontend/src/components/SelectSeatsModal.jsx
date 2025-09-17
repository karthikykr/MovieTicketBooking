import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FaChair, FaTimes, FaCreditCard } from "react-icons/fa";
import io from "socket.io-client";

const SelectSeatsModal = ({ showtime, showtimeData, onClose }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [temporarySelections, setTemporarySelections] = useState(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    const userId = useRef(`user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);

    useEffect(() => {
        // Initialize Socket.IO connection
        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to server');
            // Join the showtime room
            socketRef.current.emit('join-showtime', showtimeData._id);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from server');
        });

        // Listen for real-time seat selections
        socketRef.current.on('seat-selected', (data) => {
            setTemporarySelections(prev => {
                const newMap = new Map(prev);
                newMap.set(data.seatNumber, {
                    userId: data.userId,
                    isTemporary: data.isTemporary
                });
                return newMap;
            });
        });

        socketRef.current.on('seat-deselected', (data) => {
            setTemporarySelections(prev => {
                const newMap = new Map(prev);
                newMap.delete(data.seatNumber);
                return newMap;
            });
        });

        // Use the seats from the showtime data directly
        if (showtime && showtime.seats) {
            setSeats(showtime.seats);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [showtime, showtimeData._id]);

    const handleSelectSeat = (seatNumber) => {
        const isCurrentlySelected = selectedSeats.includes(seatNumber);

        if (isCurrentlySelected) {
            // Deselecting seat
            setSelectedSeats(prev => prev.filter(s => s !== seatNumber));
            if (socketRef.current) {
                socketRef.current.emit('deselect-seat', {
                    showtimeId: showtimeData._id,
                    seatNumber,
                    userId: userId.current
                });
            }
        } else {
            // Selecting seat
            setSelectedSeats(prev => [...prev, seatNumber]);
            if (socketRef.current) {
                socketRef.current.emit('select-seat', {
                    showtimeId: showtimeData._id,
                    seatNumber,
                    userId: userId.current
                });
            }
        }
    };

    const getSeatStatus = (seat) => {
        if (seat.isBooked) return 'booked';
        if (selectedSeats.includes(seat.seatNumber)) return 'selected';
        if (temporarySelections.has(seat.seatNumber)) return 'temporary';
        return 'available';
    };

    const getSeatColor = (status) => {
        switch (status) {
            case 'booked':
                return 'bg-red-500 cursor-not-allowed';
            case 'selected':
                return 'bg-blue-600 hover:bg-blue-700 scale-110';
            case 'temporary':
                return 'bg-orange-500 cursor-not-allowed animate-pulse';
            default:
                return 'bg-green-500 hover:bg-green-600 hover:scale-105';
        }
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/showtimes/${showtimeData._id}/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ selectedSeats })
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Booking successful! Total: $${selectedSeats.length * showtime.price}`);
                onClose();
            } else {
                alert(data.message || "Booking failed");
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("Booking failed. Please try again.");
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Select Your Seats</h2>
                            <p className="text-gray-300 flex items-center gap-4">
                                <span>{showtime.format} - ${showtime.price} per seat</span>
                                {isConnected && (
                                    <span className="flex items-center gap-2 text-green-400">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        Live Updates
                                    </span>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    {/* Screen indicator */}
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-2xl inline-block shadow-lg">
                            <span className="text-lg font-semibold">SCREEN</span>
                        </div>
                        <div className="mt-2 text-gray-400 text-sm">All eyes this way please!</div>
                    </div>

                    {/* Seat Map */}
                    <div className="bg-gray-800/50 p-6 rounded-2xl mb-6">
                        <div className="grid grid-cols-12 gap-3">
                            {seats.map((seat, index) => {
                                const status = getSeatStatus(seat);
                                const isDisabled = status === 'booked' || status === 'temporary';

                                return (
                                    <motion.button
                                        key={seat.seatNumber}
                                        whileHover={!isDisabled ? { scale: 1.1 } : {}}
                                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.01 }}
                                        className={`
                                            relative p-3 text-xs font-semibold rounded-xl flex justify-center items-center aspect-square
                                            transition-all duration-300 ${getSeatColor(status)}
                                            ${!isDisabled ? 'shadow-lg hover:shadow-xl' : ''}
                                        `}
                                        disabled={isDisabled}
                                        onClick={() => !isDisabled && handleSelectSeat(seat.seatNumber)}
                                        title={`Seat ${seat.seatNumber} - ${status}`}
                                    >
                                        <FaChair className="text-white" />
                                        <span className="absolute -bottom-1 text-[10px] text-white/80">
                                            {seat.seatNumber}
                                        </span>
                                        {status === 'temporary' && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center flex-wrap gap-6 mb-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-lg"></div>
                            <span className="text-gray-300">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-600 rounded-lg"></div>
                            <span className="text-gray-300">Your Selection</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-500 rounded-lg animate-pulse"></div>
                            <span className="text-gray-300">Being Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-lg"></div>
                            <span className="text-gray-300">Booked</span>
                        </div>
                    </div>

                    {/* Selection Summary */}
                    <AnimatePresence>
                        {selectedSeats.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-6 rounded-2xl mb-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-semibold text-lg mb-1">
                                            Selected Seats: {selectedSeats.join(", ")}
                                        </p>
                                        <p className="text-gray-300">
                                            {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} × ${showtime.price}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">
                                            ${selectedSeats.length * showtime.price}
                                        </p>
                                        <p className="text-gray-400 text-sm">Total Amount</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: selectedSeats.length > 0 ? 1.02 : 1 }}
                            whileTap={{ scale: selectedSeats.length > 0 ? 0.98 : 1 }}
                            onClick={handleBooking}
                            disabled={selectedSeats.length === 0}
                            className={`
                                flex-2 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3
                                ${selectedSeats.length > 0
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }
                            `}
                        >
                            <FaCreditCard />
                            Book {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

SelectSeatsModal.propTypes = {
    showtime: PropTypes.shape({
        seats: PropTypes.arrayOf(PropTypes.shape({
            seatNumber: PropTypes.string.isRequired,
            isBooked: PropTypes.bool
        })),
        format: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
    }).isRequired,
    showtimeData: PropTypes.shape({
        _id: PropTypes.string.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

export default SelectSeatsModal;
