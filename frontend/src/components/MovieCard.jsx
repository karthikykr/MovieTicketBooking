import React from 'react';
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie, onClick }) => {
    return (
        <div
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => onClick(movie.id)}
        >
            {/* Movie Image with Overlay */}
            <div className="relative">
                <img
                    src={movie.image || '/assets/placeholder.jpg'}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                        <FaStar className="text-red-500" />
                        <span className="text-sm font-semibold">{movie.rating}</span>
                    </div>
                    <span className="text-sm">{movie.votes} Votes</span>
                </div>
            </div>

            {/* Movie Details */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 truncate">{movie.title}</h3>
                <p className="text-sm text-gray-600">{movie.genre}</p>
            </div>
        </div>
    );
};

export default MovieCard;
