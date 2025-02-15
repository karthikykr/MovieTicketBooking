import React from "react";
import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, onSeeMore }) => {
    return (
        <div className="relative max-w-screen-xl mx-auto px-4">
            {/* Header with Title and See More */}
            <div className="flex justify-between items-center mb-4 px-2 sm:px-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recommended Movies</h2>
                <button
                    onClick={onSeeMore}
                    className="text-red-500 hover:text-red-600 font-medium transition"
                >
                    See All &rarr;
                </button>
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mx-auto sm:h-10">
                {movies.map((movie) => (
                    <div key={movie.id} className="w-full">
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieGrid;
