import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, onMovieClick, onSeeMore }) => {
    return (
        <div className="relative">
            {/* Header with Title and See More */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Recommended Movies</h2>
                <button
                    onClick={onSeeMore}
                    className="text-red-500 hover:text-red-600 font-medium transition"
                >
                    See All &rarr;
                </button>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mx-auto max-w-7xl px-4">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
                ))}
            </div>
        </div>
    );
};

export default MovieGrid;
