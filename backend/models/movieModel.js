const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    duration: { type: String, required: true },
    releaseDate: { type: String, required: true },
    rating: { type: Number, required: true },
    votes: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "https://example.com/placeholder.jpg" },
    cast: [
        {
            name: { type: String, required: true },
            role: { type: String, required: true },
            image: { type: String, default: "https://example.com/person-placeholder.jpg" }
        }
    ],
    crew: [
        {
            name: { type: String, required: true },
            role: { type: String, required: true },
            image: { type: String, default: "https://example.com/person-placeholder.jpg" }
        }
    ]
});

module.exports = mongoose.model("Movie", movieSchema);
