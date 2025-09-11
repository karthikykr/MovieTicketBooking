
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaPlay, FaHeart } from "react-icons/fa";

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    // Defensive check for valid movie ID
    const movieId = movie.tmdbId || movie._id;
    if (!movieId) {
        console.warn("MovieCard: Missing movie ID for navigation", movie);
    }

    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
            }}
            className="group relative w-full h-full aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer shadow-xl flex flex-col"
            onClick={() => {
                if (movieId) {
                    navigate(`/movie/${movieId}`);
                } else {
                    alert("Movie ID is missing. Cannot navigate to details.");
                }
            }}
        >
            {/* Background Image */}
            <img
                src={movie.image || '/assets/placeholder.jpg'}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Rating Badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-white text-sm font-semibold">
                        {movie.rating?.toFixed(1) || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites logic
                    }}
                >
                    <FaHeart className="text-white text-sm" />
                </motion.button>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movie/${movie.tmdbId || movie._id}`);
                    }}
                >
                    <FaPlay className="text-white text-xl ml-1" />
                </motion.button>
            </div>

            {/* Movie Details Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {movie.title}
                </h3>

                {/* Movie Info */}
                <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
                    <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'TBA'}</span>
                    <span>•</span>
                    <span>{movie.duration || '120'} min</span>
                </div>

                {/* Genre */}
                <p className="text-sm text-gray-400 line-clamp-1 mb-3">
                    {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                </p>

                {/* Book Now Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/movie/${movie.tmdbId || movie._id}`);
                    }}
                >
                    Book Tickets
                </motion.button>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
        </motion.div>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        _id: PropTypes.string,
        tmdbId: PropTypes.string,
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
        rating: PropTypes.number,
        releaseDate: PropTypes.string,
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        genre: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    }).isRequired
};

export default MovieCard;
