import React, { useState } from 'react';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import Filters from '../components/Filters';

const HomePage = () => {
    const [movies, setMovies] = useState([
        { id: 1, title: 'Movie 1', rating: '8.5', image: '/assets/placeholder.jpg' },
        { id: 2, title: 'Movie 2', rating: '7.8', image: '/assets/placeholder.jpg' },
        { id: 3, title: 'Movie 3', rating: '9.0', image: '/assets/placeholder.jpg' },
        { id: 4, title: 'Movie 4', rating: '6.5', image: '/assets/placeholder.jpg' },
        { id: 4, title: 'Movie 4', rating: '6.5', image: '/assets/placeholder.jpg' },
        { id: 4, title: 'Movie 4', rating: '6.5', image: '/assets/placeholder.jpg' },
        { id: 4, title: 'Movie 4', rating: '6.5', image: '/assets/placeholder.jpg' },
        { id: 4, title: 'Movie 4', rating: '6.5', image: '/assets/placeholder.jpg' },
    ]);

    return (
        <div>
            <Hero />
            <Filters />
            <div className="p-4">
                <MovieGrid movies={movies} />
            </div>
        </div>
    );
};

export default HomePage;
