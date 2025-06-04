const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MovieShowtime = require("../models/MovieShowtimeModel");

// Get showtimes based on movieId (TMDB ID)
router.get("/movies/:movieId", async (req, res) => {
    try {
        const tmdbId = req.params.movieId; // This is a TMDB ID, not MongoDB ObjectId

        // For now, return mock data since we're using TMDB IDs
        // In a real app, you'd need to map TMDB IDs to your internal movie IDs
        const mockShowtimes = [
            {
                _id: "64a1b2c3d4e5f6789012345a",
                movieId: tmdbId,
                theaterId: {
                    _id: "64a1b2c3d4e5f6789012345b",
                    name: "AMC Empire 25",
                    location: "New York, NY"
                },
                date: new Date(),
                showtimes: [
                    {
                        time: "10:00 AM",
                        format: "2D",
                        price: 12.99,
                        seats: generateSeats()
                    },
                    {
                        time: "1:30 PM",
                        format: "3D",
                        price: 15.99,
                        seats: generateSeats()
                    },
                    {
                        time: "4:00 PM",
                        format: "IMAX",
                        price: 18.99,
                        seats: generateSeats()
                    },
                    {
                        time: "7:30 PM",
                        format: "2D",
                        price: 12.99,
                        seats: generateSeats()
                    },
                    {
                        time: "10:00 PM",
                        format: "3D",
                        price: 15.99,
                        seats: generateSeats()
                    }
                ]
            },
            {
                _id: "64a1b2c3d4e5f6789012345c",
                movieId: tmdbId,
                theaterId: {
                    _id: "64a1b2c3d4e5f6789012345d",
                    name: "Regal Cinemas",
                    location: "Los Angeles, CA"
                },
                date: new Date(),
                showtimes: [
                    {
                        time: "11:00 AM",
                        format: "2D",
                        price: 11.99,
                        seats: generateSeats()
                    },
                    {
                        time: "2:00 PM",
                        format: "4DX",
                        price: 22.99,
                        seats: generateSeats()
                    },
                    {
                        time: "5:30 PM",
                        format: "IMAX",
                        price: 17.99,
                        seats: generateSeats()
                    },
                    {
                        time: "8:45 PM",
                        format: "2D",
                        price: 11.99,
                        seats: generateSeats()
                    }
                ]
            }
        ];

        res.json(mockShowtimes);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Helper function to generate seat layout
function generateSeats() {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;

    for (let row of rows) {
        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
            seats.push({
                seatNumber: `${row}${seatNum}`,
                isBooked: Math.random() < 0.3 // 30% chance of being booked
            });
        }
    }

    return seats;
}

// Get available seats for a specific showtime
router.get("/:showtimeId/seats", async (req, res) => {
    try {
        const showtime = await MovieShowtime.findById(req.params.showtimeId);
        if (!showtime) return res.status(404).json({ message: "Showtime not found" });

        res.json(showtime.showtimes[0].seats);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Book selected seats
router.post("/:showtimeId/book", async (req, res) => {
    try {
        const { selectedSeats } = req.body;
        const { showtimeId } = req.params;

        // For mock implementation, just return success
        // In a real app, you'd update the database
        console.log(`Booking seats ${selectedSeats.join(', ')} for showtime ${showtimeId}`);

        // Simulate some validation
        if (!selectedSeats || selectedSeats.length === 0) {
            return res.status(400).json({ message: "No seats selected" });
        }

        // Simulate booking success
        res.json({
            message: "Seats booked successfully!",
            bookedSeats: selectedSeats,
            showtimeId: showtimeId,
            bookingId: `booking_${Date.now()}`
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
