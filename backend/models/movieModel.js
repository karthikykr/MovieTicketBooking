const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    releaseDate: { type: Date },
    genre: { type: String },
    language: { type: String },
    duration: { type: Number },
});


module.exports = mongoose.model('Movie', movieSchema);