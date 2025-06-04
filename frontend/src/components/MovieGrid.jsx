
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, onSeeMore, title = "Recommended Movies" }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="relative max-w-7xl mx-auto px-4">
            {/* Header with Title and See More */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">{title}</h2>
                {onSeeMore && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSeeMore}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center gap-2"
                    >
                        See All
                        <span className="text-lg">→</span>
                    </motion.button>
                )}
            </div>

            {/* Movie Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
                {movies.map((movie, index) => (
                    <motion.div
                        key={movie.tmdbId || movie._id || index}
                        variants={itemVariants}
                        className="w-full"
                    >
                        <MovieCard movie={movie} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {movies.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <div className="text-gray-400 text-lg mb-4">No movies found</div>
                    <p className="text-gray-500">Check back later for new releases!</p>
                </motion.div>
            )}
        </div>
    );
};

MovieGrid.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string,
        tmdbId: PropTypes.string,
        title: PropTypes.string.isRequired
    })).isRequired,
    onSeeMore: PropTypes.func,
    title: PropTypes.string
};

export default MovieGrid;
