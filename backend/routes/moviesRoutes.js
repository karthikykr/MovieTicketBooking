const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModel');

//create a new movie : working
router.post("/addMovie", async (req, res) => {
    try {
        const movie = new Movie(req.body);
        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Get all movie : working
router.get("/allMovie", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Get a single movie : working
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching movie with ID:", id); // Debugging log
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



//Update a movie : working
router.put("/:_id", async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params._id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// Delete a movie : working
router.delete("/:_id", async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.body);
        if (!deletedMovie)
            return res.status(404).json({ message: "Movie not found" });
        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;