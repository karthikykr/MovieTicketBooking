const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const moviesRoutes = require('./routes/moviesRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const theaterRoutes = require('./routes/theaterRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//connect to mongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

connectDB();

// authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/theater', theaterRoutes);

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server runninng on http://localhost:${PORT}`);
});



