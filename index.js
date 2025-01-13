const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

//express initialization
const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to th Movie Ticket Booking API.');
})

//server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});