const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModel');


//fetch available seats for a specific theater
router.get('/:_id/seats', async (req, res) => {
    try {
        const { _id } = req.params;

        // Find the theater by ID
        const theater = await Theater.findById(_id).populate('movie');

        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }

        res.status(200).json({
            message: 'Seats fetched successfully',
            movie: theater.movie.title,
            theater: theater.name,
            availableSeats: theater.availableSeats,
        });
    } catch (error) {
        console.error('Error fetching seats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//book seats for specific theater
router.post('/:theaterId/book', async (req, res) => {
    try {
        const { theaterId } = req.params;
        const { seats } = req.body;

        if (!seats || seats <= 0) {
            return res.status(400).json({ message: 'Invalid seat count' });
        }

        // Find the theater
        const theater = await Theater.findById(theaterId);

        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }

        if (theater.availableSeats < seats) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        theater.availableSeats -= seats;
        await theater.save();

        res.status(200).json({
            message: 'Booking successful',
            remainingSeats: theater.availableSeats,
        });
    } catch (error) {
        console.error('Error updating seat availability:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
