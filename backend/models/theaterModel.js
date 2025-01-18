const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    theaterId: { type: String },
    name: { type: String, required: true },
    location: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'movie', required: true },
});

module.exports = mongoose.model('Theater', theaterSchema);