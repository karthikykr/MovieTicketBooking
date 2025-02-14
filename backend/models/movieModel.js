const mongoose = require('mongoose');
const theaterModel = require('./theaterModel');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    releaseDate: { type: Date },
    genre: { type: String },
    language: { type: String },
    duration: { type: Number },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'theater', required: false },
    rating: { type: String },
    image: { type: String },
    votes: { type: String },
    genre: { type: String },
});


module.exports = mongoose.model('Movie', movieSchema);