const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [{ type: String, required: true }], // Changed to array for multiple genres
  duration: { type: Number, required: true }, // Changed to number (minutes)
  releaseDate: { type: Date, required: true }, // Changed to Date
  rating: { type: Number, required: true, min: 0, max: 10 },
  votes: { type: Number, required: true, default: 0 },
  description: { type: String, required: true },
  image: { type: String, default: "https://via.placeholder.com/500x750" },
  backdropImage: {
    type: String,
    default: "https://via.placeholder.com/1280x720",
  },
  trailer: { type: String }, // YouTube URL or video ID
  language: { type: String, default: "English" },
  country: { type: String, default: "USA" },
  budget: { type: Number },
  boxOffice: { type: Number },
  awards: [String],
  ageRating: {
    type: String,
    enum: ["G", "PG", "PG-13", "R", "NC-17", "U", "UA", "A"],
    default: "PG-13",
  },
  status: {
    type: String,
    enum: ["now_playing", "upcoming", "released"],
    default: "now_playing",
  },
  tmdbId: { type: Number, unique: true, sparse: true }, // TMDB API ID
  imdbId: { type: String, unique: true, sparse: true }, // IMDB ID
  cast: [
    {
      name: { type: String, required: true },
      character: { type: String, required: true },
      image: { type: String, default: "https://via.placeholder.com/200x300" },
      order: { type: Number, default: 0 },
    },
  ],
  crew: [
    {
      name: { type: String, required: true },
      job: { type: String, required: true },
      department: { type: String, required: true },
      image: { type: String, default: "https://via.placeholder.com/200x300" },
    },
  ],
  averageRating: { type: Number, default: 0, min: 0, max: 10 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Movie", movieSchema);
