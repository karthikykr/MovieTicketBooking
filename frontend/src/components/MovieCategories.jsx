import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaStar, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MovieCategories = ({ nowPlaying, popular, upcoming }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('nowPlaying');

    const categories = {
        nowPlaying: { label: 'Now Playing', movies: nowPlaying, icon: FaPlay },
        popular: { label: 'Popular', movies: popular, icon: FaStar },
        upcoming: { label: 'Coming Soon', movies: upcoming, icon: FaCalendarAlt }
    };

    const tabVariants = {
        inactive: {
            scale: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        },
        active: {
            scale: 1.05,
            backgroundColor: 'rgba(147, 51, 234, 0.8)',
            transition: { duration: 0.3 }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <section className="py-20 px-4 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl font-bold text-white mb-4">
                        Explore Movies
                    </h2>
                    <p className="text-xl text-gray-300">
                        Choose from different categories
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-2 flex gap-2">
                        {Object.entries(categories).map(([key, category]) => {
                            const IconComponent = category.icon;
                            return (
                                <motion.button
                                    key={key}
                                    variants={tabVariants}
                                    animate={activeTab === key ? 'active' : 'inactive'}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab(key)}
                                    className="flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300"
                                >
                                    <IconComponent className="text-lg" />
                                    {category.label}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Movie Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {categories[activeTab].movies.slice(0, 8).map((movie, index) => (
                            <motion.div
                                key={movie.tmdbId || index}
                                variants={cardVariants}
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative"
                            >
                                <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                                    {/* Movie Poster */}
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={movie.image || '/placeholder.jpg'}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                        {/* Rating Badge */}
                                        <div className="absolute top-3 right-3">
                                            <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                                                <FaStar className="text-yellow-400 text-xs" />
                                                <span className="text-white text-sm font-semibold">
                                                    {movie.rating?.toFixed(1) || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    const movieId = movie.tmdbId || movie._id;
                                                    if (movieId) {
                                                        navigate(`/movie/${movieId}`);
                                                    } else {
                                                        alert("Movie ID is missing. Cannot navigate to details.");
                                                    }
                                                }}
                                                className="bg-purple-600/80 backdrop-blur-sm p-3 rounded-full hover:bg-purple-700/80 transition-colors"
                                            >
                                                <FaPlay className="text-white ml-1" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Movie Info */}
                                    <div className="p-4">
                                        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                                            {movie.title}
                                        </h3>

                                        <div className="flex items-center gap-3 mb-3 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <FaClock className="text-xs" />
                                                <span>{movie.duration || '120'} min</span>
                                            </div>
                                            <span>•</span>
                                            <span>{movie.releaseDate?.split('-')[0] || 'TBA'}</span>
                                        </div>

                                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                            {movie.description}
                                        </p>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                const movieId = movie.tmdbId || movie._id;
                                                if (movieId) {
                                                    navigate(`/movie/${movieId}`);
                                                } else {
                                                    alert("Movie ID is missing. Cannot navigate to details.");
                                                }
                                            }}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                        >
                                            View Details
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* View More Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                    >
                        View More {categories[activeTab].label}
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

MovieCategories.propTypes = {
    nowPlaying: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        tmdbId: PropTypes.string,
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
        rating: PropTypes.number,
        releaseDate: PropTypes.string,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string
    })),
    popular: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        tmdbId: PropTypes.string,
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
        rating: PropTypes.number,
        releaseDate: PropTypes.string,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string
    })),
    upcoming: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        tmdbId: PropTypes.string,
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
        rating: PropTypes.number,
        releaseDate: PropTypes.string,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string
    }))
};

export default MovieCategories;
