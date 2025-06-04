import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaStar, FaInfoCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Hero = ({ movies = [] }) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-slide functionality
    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % movies.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [movies.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    };

    if (!movies || movies.length === 0) {
        return (
            <div className="relative h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-6xl font-bold mb-4">MovieBook</h1>
                    <p className="text-xl">Loading amazing movies...</p>
                </div>
            </div>
        );
    }

    const currentMovie = movies[currentSlide];

    return (
        <div className="relative h-screen overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={currentMovie.backdropImage || currentMovie.image}
                            alt={currentMovie.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Multiple Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center">
                        <div className="max-w-7xl mx-auto px-4 w-full">
                            <div className="max-w-2xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    {/* Movie Title */}
                                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                        {currentMovie.title}
                                    </h1>

                                    {/* Movie Info */}
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="flex items-center gap-2">
                                            <FaStar className="text-yellow-400 text-xl" />
                                            <span className="text-white text-xl font-semibold">
                                                {currentMovie.rating?.toFixed(1) || 'N/A'}
                                            </span>
                                        </div>
                                        <span className="text-gray-300 text-lg">
                                            {currentMovie.releaseDate?.split('-')[0] || 'TBA'}
                                        </span>
                                        <span className="text-gray-300 text-lg">
                                            {currentMovie.duration || '120'} min
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-200 text-xl leading-relaxed mb-8 max-w-xl">
                                        {currentMovie.description}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/movie/${currentMovie.tmdbId}`)}
                                            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                                        >
                                            <FaPlay className="text-lg" />
                                            Book Tickets
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/movie/${currentMovie.tmdbId}`)}
                                            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-white/30 transition-all duration-300"
                                        >
                                            <FaInfoCircle className="text-lg" />
                                            More Info
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 z-20"
            >
                <FaChevronLeft className="text-xl" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 z-20"
            >
                <FaChevronRight className="text-xl" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/75'
                            }`}
                    />
                ))}
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
    );
};

Hero.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        tmdbId: PropTypes.string,
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
        backdropImage: PropTypes.string,
        rating: PropTypes.number,
        releaseDate: PropTypes.string,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string
    }))
};

export default Hero;
