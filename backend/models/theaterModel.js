const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    contact: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    totalSeats: { type: Number, required: true },
    availableSeats: [{ type: String }], // Array of available seat numbers like ["A1", "A2", "B1", etc.]
    seatLayout: {
      rows: { type: Number, default: 10 },
      seatsPerRow: { type: Number, default: 12 },
      premiumRows: [{ type: String }], // Premium row identifiers like ["A", "B"]
      wheelchairAccessible: [{ type: String }], // Wheelchair accessible seats
    },
    amenities: [
      {
        type: String,
        enum: [
          "IMAX",
          "4DX",
          "Dolby Atmos",
          "Recliner Seats",
          "Food Court",
          "Parking",
          "AC",
          "Wheelchair Access",
        ],
      },
    ],
    screens: [
      {
        screenNumber: { type: Number, required: true },
        screenType: {
          type: String,
          enum: ["Standard", "IMAX", "4DX", "Premium"],
          default: "Standard",
        },
        totalSeats: { type: Number, required: true },
        seatLayout: {
          rows: { type: Number, default: 10 },
          seatsPerRow: { type: Number, default: 12 },
        },
      },
    ],
    pricing: {
      standard: { type: Number, default: 12.99 },
      premium: { type: Number, default: 18.99 },
      imax: { type: Number, default: 22.99 },
      fourDX: { type: Number, default: 25.99 },
    },
    operatingHours: {
      weekdays: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "23:00" },
      },
      weekends: {
        open: { type: String, default: "08:00" },
        close: { type: String, default: "24:00" },
      },
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theater", theaterSchema);
