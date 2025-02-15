import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/movies/${id}`);
                if (!response.ok) throw new Error("Movie not found");
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

    if (loading) return <div className="text-center text-gray-700">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-gray-600 hover:text-gray-900 transition"
            >
                ← Back
            </button>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden p-6">
                <div className="flex flex-col md:flex-row">
                    {/* Movie Poster */}
                    <img
                        src={movie.image || "/assets/placeholder.jpg"}
                        alt={movie.title}
                        className="w-full md:w-1/3 object-cover rounded-lg"
                    />

                    {/* Movie Details */}
                    <div className="p-6 md:w-2/3">
                        <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mt-2">
                            <FaStar className="text-yellow-400" />
                            <span className="text-gray-700">{movie.rating} | {movie.votes} Votes</span>
                        </div>

                        {/* Genre, Duration, Release Date */}
                        <p className="text-gray-500 mt-2">{movie.genre} | {movie.duration} | {movie.releaseDate}</p>

                        {/* Description */}
                        <p className="text-gray-700 mt-4">{movie.description}</p>

                        {/* Booking Button */}
                        <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition">
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
                            <p className="text-sm text-gray-500">as {actor.role}</p>
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
                            <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
