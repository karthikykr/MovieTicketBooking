const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const router = express.Router();

//generate JWT 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

//Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            userId: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await user.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                userId: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });

        } else {
            res.status(401).json({ message: 'Invalid email or password' });

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;