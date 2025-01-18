const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' },
    seats: [{ type: Number }], // Array of seat numbers
    totalPrice: { type: Number, required: true },
    isGroupBooking: { type: Boolean, default: false },
    groupLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Group leader ID
    groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Group members
});

module.exports = mongoose.model("Booking", bookingSchema);