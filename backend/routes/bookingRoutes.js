const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");

// Create a new booking
router.post("/book", async (req, res) => {
    try {
        const { user, movie, theater, seats, totalPrice } = req.body;

        const booking = new Booking({ user, movie, theater, seats, totalPrice });
        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all bookings
router.get("/bookings", async (req, res) => {
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

//create group booking
router.post("/api/bookings/group", async (req, res) => {
    try {
        const { groupLeader, groupMembers, movie, theater, seats, totalPrice } = req.body;

        // Validate request data
        if (!groupLeader || !movie || !theater || !seats || !Array.isArray(groupMembers)) {
            return res.status(400).json({ message: 'Invalid group booking data!' });
        }

        // Check seat availability
        const theaterData = await Theater.findById(theater);
        const unavailableSeats = seats.filter(seat => !theaterData.availableSeats.includes(seat));

        if (unavailableSeats.length > 0) {
            return res.status(400).json({ message: 'Some seats are unavailable!', unavailableSeats });
        }

        // Create group booking
        const booking = new Booking({
            groupLeader,
            groupMembers,
            movie,
            theater,
            seats,
            totalPrice,
            isGroupBooking: true,
        });

        // Update seat availability
        theaterData.availableSeats = theaterData.availableSeats.filter(seat => !seats.includes(seat));
        await theaterData.save();
        await booking.save();

        res.status(201).json({
            message: 'Group booking created successfully!',
            booking,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating group booking', error: error.message });
    }
});

module.exports = router;
