const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: [{ type: String }], // Array of available seat numbers like ["A1", "A2", "B1", etc.]
    seatLayout: {
        rows: { type: Number, default: 10 },
        seatsPerRow: { type: Number, default: 12 }
    }
});

module.exports = mongoose.model("Theater", theaterSchema);
