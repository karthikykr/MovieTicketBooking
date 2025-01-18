import React from 'react';

const MovieCard = ({ movie }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
                src={movie.image || '/assets/placeholder.jpg'}
                alt={movie.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <p className="text-sm text-gray-600">Rating: {movie.rating}</p>
            </div>
        </div>
    );
};

export default MovieCard;
