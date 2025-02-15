const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater" },
    seats: [{ type: Number }],
    totalPrice: { type: Number, required: true },
    isGroupBooking: { type: Boolean, default: false },
    groupLeader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Booking", bookingSchema);
