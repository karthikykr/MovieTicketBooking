const express = require('express');
const { addMovie, getMovies } = require('../controllers/movieController');

const router = express.Router();

router.post('/add', addMovie); //add a movie
router.get('/all', getMovies); //get all movie

module.exports = router; 