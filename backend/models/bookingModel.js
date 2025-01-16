const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    seats: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);