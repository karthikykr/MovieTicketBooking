const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const MovieShowtime = require("../models/MovieShowtimeModel");
const Theater = require("../models/theaterModel");
const Movie = require("../models/movieModel");

// Get showtimes for a specific movie
router.get("/movie/:movieId", async (req, res) => {
    try {
        const showtimes = await MovieShowtime.find({ movieId: req.params.movieId }).populate("theaterId");
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching showtimes", error });
    }
});

// Get showtimes for a specific theater
router.get("/theater/:theaterId", async (req, res) => {
    try {
        const showtimes = await MovieShowtime.find({ theaterId: req.params.theaterId }).populate("movieId");
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching showtimes", error });
    }
});

//  Add a new movie showtime
router.post("/", async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging

        let { movieId, theaterId, date, showtimes } = req.body;

        // Convert string IDs to MongoDB ObjectIds
        movieId = new mongoose.Types.ObjectId(movieId);
        theaterId = new mongoose.Types.ObjectId(theaterId);

        // Validate if movie and theater exist
        const movieExists = await Movie.findById(movieId);
        const theaterExists = await Theater.findById(theaterId);

        if (!movieExists) {
            return res.status(404).json({ message: "Movie not found", movieId });
        }
        if (!theaterExists) {
            return res.status(404).json({ message: "Theater not found", theaterId });
        }

        // Create new showtime entry
        const newShowtime = new MovieShowtime({ movieId, theaterId, date, showtimes });
        await newShowtime.save();

        res.status(201).json({ message: "Showtime added successfully", newShowtime });
    } catch (error) {
        console.error("Error Details:", error); // Logs full error details
        res.status(500).json({ message: "Error adding showtime", error: error.message || error });
    }
});


// Get seat availability for a specific showtime
router.get("/:showtimeId/seats", async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.showtimeId);
        if (!showtime) return res.status(404).json({ message: "Showtime not found" });

        res.json(showtime.showtimes);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/:showtimeId/book", async (req, res) => {
    try {
        const { selectedSeats } = req.body;
        const showtime = await Showtime.findById(req.params.showtimeId);

        if (!showtime) return res.status(404).json({ message: "Showtime not found" });

        // Update seat status
        showtime.showtimes.forEach((st) => {
            if (st._id.toString() === req.params.showtimeId) {
                st.seats.forEach((seat) => {
                    if (selectedSeats.includes(seat.seatNumber)) {
                        if (seat.isBooked) {
                            return res.status(400).json({ message: `Seat ${seat.seatNumber} is already booked!` });
                        }
                        seat.isBooked = true;
                    }
                });
            }
        });

        await showtime.save();
        res.json({ message: "Seats booked successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
