import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaStar, FaPlay, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TrendingSection = ({ movies }) => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold text-white mb-4">
                        Trending Now
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Discover the most popular movies everyone&apos;s talking about
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    {movies.slice(0, 8).map((movie, index) => (
                        <motion.div
                            key={movie.tmdbId || index}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.05,
                                rotateY: 5,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative"
                        >
                            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                                {/* Movie Poster */}
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={movie.image || '/placeholder.jpg'}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    {/* Trending Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            #{index + 1} Trending
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                                            <FaHeart className="text-white" />
                                        </button>
                                    </div>

                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/movie/${movie.tmdbId}`)}
                                            className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-colors"
                                        >
                                            <FaPlay className="text-white text-xl ml-1" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Movie Info */}
                                <div className="p-6">
                                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                                        {movie.title}
                                    </h3>

                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex items-center gap-1">
                                            <FaStar className="text-yellow-400 text-sm" />
                                            <span className="text-gray-300 text-sm">
                                                {movie.rating?.toFixed(1) || 'N/A'}
                                            </span>
                                        </div>
                                        <span className="text-gray-400 text-sm">
                                            {movie.releaseDate?.split('-')[0] || 'TBA'}
                                        </span>
                                    </div>

                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                        {movie.description}
                                    </p>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate(`/movie/${movie.tmdbId}`)}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                    >
                                        Book Tickets
                                    </motion.button>
                                </div>
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-16"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
                    >
                        View All Trending Movies
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

TrendingSection.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        tmdbId: PropTypes.string,
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
        rating: PropTypes.number,
        releaseDate: PropTypes.string,
        description: PropTypes.string
    })).isRequired
};

export default TrendingSection;
