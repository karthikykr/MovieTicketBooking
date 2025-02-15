const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true }
});

module.exports = mongoose.model("Theater", theaterSchema);
