import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};

export default MovieGrid;
