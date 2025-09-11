const Movie = require("../models/movieModel");
const tmdbService = require("../services/tmdbService");

// Create a new movie
const addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all movies from database (now playing)
const getNowPlayingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({ status: "now_playing" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments({ status: "now_playing" });

    res.status(200).json({
      results: movies,
      page: page,
      total_pages: Math.ceil(total / limit),
      total_results: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get popular movies from database (sorted by rating and votes)
const getPopularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({ isActive: true })
      .sort({ rating: -1, votes: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments({ isActive: true });

    res.status(200).json({
      results: movies,
      page: page,
      total_pages: Math.ceil(total / limit),
      total_results: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get upcoming movies from database
const getUpcomingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({
      status: "upcoming",
      releaseDate: { $gt: new Date() },
    })
      .sort({ releaseDate: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments({
      status: "upcoming",
      releaseDate: { $gt: new Date() },
    });

    res.status(200).json({
      results: movies,
      page: page,
      total_pages: Math.ceil(total / limit),
      total_results: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search movies from database
const searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const limit = 20;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, "i");
    const movies = await Movie.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { genre: { $in: [searchRegex] } },
        { "cast.name": searchRegex },
        { "crew.name": searchRegex },
      ],
      isActive: true,
    })
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { genre: { $in: [searchRegex] } },
        { "cast.name": searchRegex },
        { "crew.name": searchRegex },
      ],
      isActive: true,
    });

    res.status(200).json({
      results: movies,
      page: parseInt(page),
      total_pages: Math.ceil(total / limit),
      total_results: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single movie from database
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching movie with ID:", id);

    // Try to get from database first
    let movie = await Movie.findById(id);

    if (!movie) {
      // If not found by MongoDB ID, try to find by tmdbId
      movie = await Movie.findOne({ tmdbId: parseInt(id) });
    }

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a movie
const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a movie
const deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params._id);
    if (!deletedMovie)
      return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addMovie,
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getAllMovies,
};
