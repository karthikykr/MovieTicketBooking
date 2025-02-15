import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const MovieCard = ({ movie }) => {
    const navigate = useNavigate(); // Hook for navigation

    return (
        <div
            className="relative w-full h-96 rounded-xl overflow-hidden cursor-pointer transition-transform transform hover:scale-105 shadow-lg"
            onClick={() => navigate(`/movie/${movie._id}`)} // Navigate to details page
        >
            {/* Background Image */}
            <img
                src={movie.image || '/assets/placeholder.jpg'}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

            {/* Movie Details Overlay */}
            <div className="absolute bottom-4 left-0 right-0 px-4 py-3 bg-black bg-opacity-10  rounded-b-xl text-white">
                <h3 className="text-lg font-semibold">{movie.title}</h3>

                {/* Rating and Votes */}
                <div className="flex items-center space-x-2 text-sm mt-1">
                    <FaStar className="text-yellow-400" />
                    <span>{movie.rating} | {movie.votes} Votes</span>
                </div>

                {/* Genre */}
                <p className="text-xs text-gray-300 mt-1">{movie.genre}</p>
            </div>
        </div>
    );
};

export default MovieCard;
