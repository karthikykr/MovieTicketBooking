const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { protect } = require("../middleware/auth");

// Routes using controller methods
router.post("/addMovie", movieController.addMovie);
router.get("/allMovie", movieController.getNowPlayingMovies);
router.get("/popular", movieController.getPopularMovies);
router.get("/upcoming", movieController.getUpcomingMovies);
router.get("/search", movieController.searchMovies);
router.get("/:id", movieController.getMovieById);
router.put("/:_id", movieController.updateMovie);
router.delete("/:_id", movieController.deleteMovie);
router.get("/", movieController.getAllMovies);

module.exports = router;
