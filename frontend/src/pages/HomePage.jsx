import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import Navbar from '../components/Navbar';

const HomePage = () => {
    const [movies, setMovies] = useState([]);

    // Fetch movies from the backend
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/movies/allMovie');
                const data = await response.json();
                setMovies(data); // Set movies from the backend
            } catch (error) {
                console.error('Error fetching movies:', error.message);
            }
        };

        fetchMovies();
    }, []);

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
