import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import Navbar from '../components/Navbar';
import MovieCategories from '../components/MovieCategories';
import TrendingSection from '../components/TrendingSection';
import axios from 'axios';

const HomePage = () => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch movies from different categories
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const [nowPlayingRes, popularRes, upcomingRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/movies/allMovie'),
                    axios.get('http://localhost:3001/api/movies/popular'),
                    axios.get('http://localhost:3001/api/movies/upcoming')
                ]);

                setNowPlayingMovies(nowPlayingRes.data);
                setPopularMovies(popularRes.data);
                setUpcomingMovies(upcomingRes.data);
            } catch (error) {
                console.error('Error fetching movies:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                    />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
        >
            <Navbar />

            <motion.div variants={sectionVariants}>
                <Hero movies={popularMovies.slice(0, 5)} />
            </motion.div>

            <motion.div variants={sectionVariants}>
                <TrendingSection movies={popularMovies.slice(0, 10)} />
            </motion.div>

            <motion.div variants={sectionVariants}>
                <MovieCategories
                    nowPlaying={nowPlayingMovies}
                    popular={popularMovies}
                    upcoming={upcomingMovies}
                />
            </motion.div>

            <motion.div variants={sectionVariants} className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-white mb-8 text-center">
                        Now Playing
                    </h2>
                    <MovieGrid movies={nowPlayingMovies} />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HomePage;
