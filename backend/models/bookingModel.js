const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MovieShowtime",
      required: true,
    },
    seats: [
      {
        seatNumber: { type: String, required: true },
        seatType: {
          type: String,
          enum: ["standard", "premium", "wheelchair"],
          default: "standard",
        },
        price: { type: Number, required: true },
      },
    ],
    bookingDate: { type: Date, required: true },
    showDate: { type: Date, required: true },
    showTime: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "refunded"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "wallet", "cash"],
      default: "credit_card",
    },
    transactionId: { type: String },
    bookingReference: { type: String, unique: true, required: true },

    // Group booking fields
    isGroupBooking: { type: Boolean, default: false },
    groupLeader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupMembers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        seats: [String],
        amount: Number,
        paymentStatus: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending",
        },
      },
    ],

    // Additional features
    specialRequests: { type: String },
    loyaltyPointsUsed: { type: Number, default: 0 },
    loyaltyPointsEarned: { type: Number, default: 0 },

    // Cancellation details
    cancellationReason: { type: String },
    cancellationDate: { type: Date },
    refundAmount: { type: Number, default: 0 },

    // Notifications
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Generate booking reference before saving
bookingSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    this.bookingReference =
      "BK" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
