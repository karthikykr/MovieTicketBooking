const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");

// Create a new booking
router.post("/", async (req, res) => {
    try {
        const { user, movie, seats } = req.body;

        // Check if the movie exists
        const movieExists = await Movie.findById(movie);
        if (!movieExists)
            return res.status(404).json({ message: "Movie not found" });

        const booking = new Booking({ user, movie, seats });
        const savedBooking = await booking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all bookings
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find().populate("movie");
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single booking
router.get("/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("movie");
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a booking
router.delete("/:id", async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking)
            return res.status(404).json({ message: "Booking not found" });
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
