const express = require("express");
const router = express.Router();
const Theater = require("../models/theaterModel");

//  Get all theaters
router.get("/", async (req, res) => {
    try {
        const theaters = await Theater.find();
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ message: "Error fetching theaters", error });
    }
});

//  Add a new theater
router.post("/", async (req, res) => {
    try {
        const { name, location, totalSeats, availableSeats } = req.body;
        const newTheater = new Theater({ name, location, totalSeats, availableSeats });
        await newTheater.save();
        res.status(201).json({ message: "Theater added successfully", newTheater });
    } catch (error) {
        res.status(500).json({ message: "Error adding theater", error });
    }
});

module.exports = router;
