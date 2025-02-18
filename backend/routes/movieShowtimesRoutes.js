const express = require("express");
const router = express.Router();
const MovieShowtime = require("../models/MovieShowtimeModel");

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

        // Update seat status
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


router.get("/movie/:movieId", async (req, res) => {
    try {
        const movieId = new mongoose.Types.ObjectId(req.params.movieId); // Convert to ObjectId
        const showtimes = await MovieShowtime.find({ movieId })
            .populate("theaterId")
            .populate("movieId");

        if (!showtimes.length) {
            return res.status(404).json({ message: "No showtimes available" });
        }

        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});


module.exports = router;
