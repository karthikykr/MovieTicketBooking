const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const MovieShowtime = require("../models/MovieShowtimeModel");
const Theater = require("../models/theaterModel");
const Movie = require("../models/movieModel");

//  Get showtimes for a specific movie
router.get("/movie/:movieId", async (req, res) => {
    try {
        const showtimes = await MovieShowtime.find({ movieId: req.params.movieId }).populate("theaterId");
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching showtimes", error });
    }
});

//  Get showtimes for a specific theater
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

module.exports = router;
