import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import SelectSeatsModal from "../components/SelectSeatsModal"; // Import the modal component

const ShowtimesPage = () => {
    const { id: movieId } = useParams(); // Use movieId instead of showtimeId
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedShowtimeData, setSelectedShowtimeData] = useState(null);

    useEffect(() => {
        const fetchMovieAndShowtimes = async () => {
            try {
                // Fetch showtimes based on movieId
                const response = await fetch(`http://localhost:3001/api/showtimes/movies/${movieId}`);
                if (!response.ok) throw new Error("Showtimes not found");
                const showtimeData = await response.json();
                if (!showtimeData.length) throw new Error("No showtimes available");

                setShowtimes(showtimeData);

                // Fetch movie details
                const movieResponse = await fetch(`http://localhost:3001/api/movies/${movieId}`);
                if (!movieResponse.ok) throw new Error("Movie not found");
                const movieData = await movieResponse.json();
                setMovie(movieData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieAndShowtimes();
    }, [movieId]);

    const getNextThreeDates = () => {
        const dates = [];
        for (let i = 0; i < 3; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date.toISOString().split("T")[0]);
        }
        return dates;
    };

    const handleShowtimeClick = (showtime, showtimeData) => {
        setSelectedShowtime(showtime);
        setSelectedShowtimeData(showtimeData);
    };

    if (loading) return <div className="text-center text-gray-700 text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500 text-lg">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
            <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-gray-700 hover:text-gray-900 transition">
                <FaArrowLeft className="mr-2" /> Back
            </button>

            {movie && (
                <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
                    <h1 className="text-4xl font-bold text-gray-900">{movie.title}</h1>
                    <p className="text-gray-500 mt-2">{movie.genre} | {movie.duration} mins</p>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Available Showtimes</h2>

                <div className="mb-4 flex space-x-4">
                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="border border-gray-400 p-2 rounded-lg">
                        <option value="all">All Locations</option>
                        {[...new Set(showtimes.map(show => show.theaterId?.location))].map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>

                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="border border-gray-400 p-2 rounded-lg">
                        <option value="all">All Dates</option>
                        {getNextThreeDates().map(date => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </select>
                </div>

                {showtimes.length > 0 ? (
                    <div className="space-y-6">
                        {showtimes.map((show) => (
                            <div key={show._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-800">{show.theaterId?.name || "Unknown Theater"}</h3>
                                <p className="text-gray-500 text-sm">{show.theaterId?.location || "Location unavailable"}</p>
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {show.showtimes?.map((st, index) => (
                                        <button
                                            key={index}
                                            className="px-4 py-2 border border-blue-500 text-blue-500 bg-white rounded-lg shadow-md hover:bg-blue-100 transition"
                                            onClick={() => handleShowtimeClick(st, show)}
                                        >
                                            <div className="text-center">
                                                <div className="font-semibold">{st.time}</div>
                                                <div className="text-xs">{st.format} - ${st.price}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No showtimes available.</p>
                )}
            </div>

            {selectedShowtime && selectedShowtimeData && (
                <SelectSeatsModal
                    showtime={selectedShowtime}
                    showtimeData={selectedShowtimeData}
                    onClose={() => {
                        setSelectedShowtime(null);
                        setSelectedShowtimeData(null);
                    }}
                />
            )}
        </div>
    );
};

export default ShowtimesPage;
