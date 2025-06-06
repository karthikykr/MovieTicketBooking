const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
});

const movieShowtimeSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
    date: { type: Date, required: true },
    showtimes: [
        {
            time: { type: String, required: true },
            format: { type: String, enum: ["2D", "3D", "IMAX", "4DX"], required: true },
            price: { type: Number, required: true },
            seats: [seatSchema]
        }
    ]
});

module.exports = mongoose.model("MovieShowtime", movieShowtimeSchema);
