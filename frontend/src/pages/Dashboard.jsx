import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // For now, we'll use mock data since we don't have user authentication middleware
        // In a real app, you'd decode the JWT token to get user info
        setUser({
            name: 'John Doe',
            email: 'john@example.com'
        });

        // Mock booking data
        setBookings([
            {
                id: 1,
                movieTitle: 'Avengers: Endgame',
                theater: 'AMC Empire 25',
                date: '2024-01-20',
                time: '7:00 PM',
                seats: ['A5', 'A6'],
                total: 24,
                status: 'Confirmed'
            },
            {
                id: 2,
                movieTitle: 'Spider-Man: No Way Home',
                theater: 'Regal LA Live',
                date: '2024-01-15',
                time: '4:00 PM',
                seats: ['B3'],
                total: 15,
                status: 'Completed'
            }
        ]);

        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) {
        return <div className="text-center text-gray-700 text-lg">Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h2>

                    {bookings.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No bookings found</p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Browse Movies
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-800">{booking.movieTitle}</h3>
                                            <p className="text-gray-600">{booking.theater}</p>
                                            <div className="mt-2 text-sm text-gray-500">
                                                <p>Date: {booking.date}</p>
                                                <p>Time: {booking.time}</p>
                                                <p>Seats: {booking.seats.join(', ')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-800">${booking.total}</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'Confirmed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                        >
                            <h3 className="font-semibold text-gray-800">Browse Movies</h3>
                            <p className="text-sm text-gray-600">Find new movies to watch</p>
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                        >
                            <h3 className="font-semibold text-gray-800">Edit Profile</h3>
                            <p className="text-sm text-gray-600">Update your information</p>
                        </button>
                        <button
                            onClick={() => navigate('/help')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                        >
                            <h3 className="font-semibold text-gray-800">Help & Support</h3>
                            <p className="text-sm text-gray-600">Get help with your bookings</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
