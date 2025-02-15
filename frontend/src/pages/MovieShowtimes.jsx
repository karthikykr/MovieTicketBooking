import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MovieShowtimes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/movies/${id}/showtimes`);
                if (!response.ok) throw new Error("Showtimes not found");
                const data = await response.json();
                setMovie(data.movie);
                setShowtimes(data.showtimes);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchShowtimes();
    }, [id]);

    if (loading) return <div className="text-center text-gray-700 text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500 text-lg">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-gray-700 hover:text-gray-900 transition flex items-center gap-1"
            >
                ← Back
            </button>

            {/* Movie Details */}
            <div className="bg-white shadow-xl rounded-xl p-6 mb-6">
                <h1 className="text-4xl font-bold text-gray-800">{movie.title}</h1>
                <p className="text-gray-500 mt-2">{movie.genre} | {movie.duration}</p>
            </div>

            {/* Showtimes */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Available Showtimes</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {showtimes.map((show, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(`/booking/${show.id}`)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                        >
                            {show.time} - {show.theater}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieShowtimes;
