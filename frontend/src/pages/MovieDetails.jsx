import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { apiCall, API_ENDPOINTS } from "../utils/api";

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await apiCall(API_ENDPOINTS.MOVIES.BY_ID(id));
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Movie not found");
                    } else {
                        throw new Error("Failed to load movie details");
                    }
                }
                const data = await response.json();
                setMovie(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) return <div className="text-center text-gray-700 text-lg">Loading...</div>;
    if (error) return (
        <div className="text-center text-red-500 text-lg">
            {error}
            {!isLoggedIn && (
                <button
                    onClick={() => navigate("/login")}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Login
                </button>
            )}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-gray-700 hover:text-gray-900 transition flex items-center gap-1"
            >
                ← Back
            </button>

            <div className="bg-white shadow-xl rounded-xl overflow-hidden p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <img
                        src={movie.image || "/assets/placeholder.jpg"}
                        alt={movie.title}
                        className="w-full md:w-1/3 object-cover rounded-xl shadow-lg"
                    />
                    <div className="p-6 md:w-2/3">
                        <h1 className="text-4xl font-bold text-gray-800">{movie.title}</h1>
                        <div className="flex items-center space-x-2 mt-3">
                            <FaStar className="text-yellow-400 text-xl" />
                            <span className="text-gray-700 text-lg font-semibold">
                                {movie.rating} | {movie.votes} Votes
                            </span>
                        </div>
                        <p className="text-gray-500 mt-3 text-lg">
                            {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre} | {movie.duration} min | {new Date(movie.releaseDate).getFullYear()}
                        </p>
                        <p className="text-gray-700 mt-5 text-lg">{movie.description}</p>
                        <button
                            onClick={() => navigate(`/showtimes/${movie?.tmdbId || id}`)}
                            className="mt-5 px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition text-lg font-semibold"
                        >
                            Book Tickets
                        </button>
                    </div>
                </div>
            </div>
            {/* Cast Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {movie.cast?.map((actor, index) => (
                        <div key={index} className="text-center">
                            <img
                                src={actor.image || "/assets/person-placeholder.jpg"}
                                alt={actor.name}
                                className="w-24 h-24 rounded-full mx-auto"
                            />
                            <p className="mt-2 text-gray-700 font-semibold">{actor.name}</p>
                            <p className="text-sm text-gray-500">as {actor.character}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Crew Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800">Crew</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {movie.crew?.map((member, index) => (
                        <div key={index} className="text-center">
                            <img
                                src={member.image || "/assets/person-placeholder.jpg"}
                                alt={member.name}
                                className="w-24 h-24 rounded-full mx-auto"
                            />
                            <p className="mt-2 text-gray-700 font-semibold">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.job}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
