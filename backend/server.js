const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const moviesRoutes = require("./routes/moviesRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const movieShowtimeRoutes = require("./routes/movieShowtimesRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config({ path: __dirname + "/.env" });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/showtimes", movieShowtimeRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

// Socket.IO for real-time seat selection
const seatSelections = new Map(); // Store temporary seat selections

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a showtime room
  socket.on("join-showtime", (showtimeId) => {
    socket.join(showtimeId);
    console.log(`User ${socket.id} joined showtime ${showtimeId}`);
  });

  // Handle seat selection
  socket.on("select-seat", (data) => {
    const { showtimeId, seatNumber, userId } = data;
    const key = `${showtimeId}-${seatNumber}`;

    // Store temporary selection
    seatSelections.set(key, {
      userId,
      socketId: socket.id,
      timestamp: Date.now(),
    });

    // Broadcast to all users in the showtime room
    socket.to(showtimeId).emit("seat-selected", {
      seatNumber,
      userId,
      isTemporary: true,
    });
  });

  // Handle seat deselection
  socket.on("deselect-seat", (data) => {
    const { showtimeId, seatNumber } = data;
    const key = `${showtimeId}-${seatNumber}`;

    // Remove temporary selection
    seatSelections.delete(key);

    // Broadcast to all users in the showtime room
    socket.to(showtimeId).emit("seat-deselected", {
      seatNumber,
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove all temporary selections for this socket
    for (const [key, selection] of seatSelections.entries()) {
      if (selection.socketId === socket.id) {
        seatSelections.delete(key);
        const [showtimeId, seatNumber] = key.split("-");
        socket.to(showtimeId).emit("seat-deselected", { seatNumber });
      }
    }
  });
});

// Clean up old temporary selections (older than 5 minutes)
setInterval(() => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  for (const [key, selection] of seatSelections.entries()) {
    if (selection.timestamp < fiveMinutesAgo) {
      seatSelections.delete(key);
    }
  }
}, 60000); // Run every minute

// Make io available to routes
app.set("io", io);

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
