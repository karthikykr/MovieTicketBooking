const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MovieShowtime = require("../models/MovieShowtimeModel");

// Get showtimes based on movieId
router.get("/movies/:movieId", async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.movieId); // Ensure correct ObjectId type
        const showtimes = await MovieShowtime.find({ movieId })
            .populate("theaterId") // Populate theater details
            .populate("movieId"); // Populate movie details

        if (!showtimes.length) {
            return res.status(404).json({ message: "No showtimes available for this movie." });
        }

        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

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
        const showtime = await MovieShowtime.findById(req.params.showtimeId);

        if (!showtime) return res.status(404).json({ message: "Showtime not found" });

        showtime.showtimes[0].seats.forEach(seat => {
            if (selectedSeats.includes(seat.seatNumber)) {
                if (seat.isBooked) {
                    return res.status(400).json({ message: `Seat ${seat.seatNumber} is already booked!` });
                }
                seat.isBooked = true;
            }
        });

        await showtime.save();
        res.json({ message: "Seats booked successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
