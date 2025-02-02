import React, { useState } from 'react';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import Filters from '../components/Filters';
import Navbar from '../components/Navbar';

const HomePage = () => {
    const [movies, setMovies] = useState([
        {
            id: 1,
            title: 'Middle Class Family',
            rating: '9.9/10',
            votes: '179',
            genre: 'Drama/Family/Romantic',
            image: 'https://example.com/middle-class-family.jpg',
        },
        {
            id: 2,
            title: 'Deva',
            rating: '7.5/10',
            votes: '3.4K',
            genre: 'Action/Thriller',
            image: 'https://example.com/deva.jpg',
        },
        {
            id: 3,
            title: 'Sky Force',
            rating: '8.9/10',
            votes: '35.3K',
            genre: 'Action/Historical/Thriller',
            image: 'https://example.com/sky-force.jpg',
        },
        {
            id: 4,
            title: 'Ponman',
            rating: '8.9/10',
            votes: '2.8K',
            genre: 'Drama',
            image: 'https://example.com/ponman.jpg',
        },
        {
            id: 5,
            title: 'Gana',
            rating: '9.8/10',
            votes: '145',
            genre: 'Action/Sci-Fi/Thriller',
            image: 'https://example.com/gana.jpg',
        },
    ]);

    return (
        <div>
            <Navbar />
            <Hero />

            <div className="p-4">
                <MovieGrid movies={movies} />
            </div>
        </div>
    );
};

export default HomePage;
