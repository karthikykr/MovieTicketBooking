const Joi = require('joi');
const Movie = require('../models/movieModel');
const joi = require('joi');

const movieSchema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().required(),
    releaseDate: Joi.date().optional(),
    genre: Joi.string().optional(),
    language: Joi.string().optional(),
    duration: Joi.string().optional(),
});

// Add new movie
exports.addMovie = async (req, res) => {
    try {
        const { error } = movieSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all movies
exports.getMovies = async (req, res) => {
    try {
        const { title, genre, language, releaseDate } = req.query;

        //Build the query object
        const query = {};
        if (title) query.title = { $regex: title, $options: 'i' }; //case-insensitive search
        if (genre) query.genre = genre;
        if (language) query.language = language;
        if (releaseDate) query.releaseDate = { $gte: new Date(releaseDate) };



        const movies = await Movie.find(query);
        res.status(200).json({ success: true,movies});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};