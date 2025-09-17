import { useState, useEffect, useRef } from "react";
import { FiSearch, FiUser, FiMenu, FiX, FiMapPin, FiBookmark, FiHeart, FiSettings, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const profileRef = useRef(null); // Reference for profile dropdown

    // Check authentication status
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userData));
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        }

        // Attach event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        setProfileOpen(false);
        navigate('/');
    };

    return (
<nav className="bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 shadow-2xl backdrop-blur-sm bg-opacity-95 relative z-50 border-b border-purple-500/20">
            <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                {/* Logo */}
                <div className="text-4xl font-black text-white drop-shadow-2xl tracking-wide">
                    <a href="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl shadow-lg">
                            <span role="img" aria-label="clapperboard" className="text-2xl">🎬</span>
                        </div>
                        <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                            MovieBook
                        </span>
                    </a>
                </div>

                {/* Large Screen Navigation */}
                <div className="hidden md:flex items-center space-x-10">
                    <a href="/" className="relative group font-semibold text-white hover:text-yellow-300 transition-all duration-300 text-lg">
                        <span className="relative z-10">Home</span>
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></div>
                    </a>

                    {/* Location Display (No Dropdown) */}
                    <div className="flex items-center space-x-2 text-yellow-200 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                        <FiMapPin className="text-yellow-400" />
                        <span className="font-medium">Mangalore</span>
                    </div>

                    {/* Search Box */}
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="pl-12 pr-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 w-64"
                        />
                        <FiSearch className="absolute left-4 top-4 text-yellow-400 group-focus-within:text-yellow-300 transition-colors" />
                    </div>

                    {!isLoggedIn ? (
                        <>
                            <a href="/login" className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-full hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Login
                            </a>
                            <a href="/signup" className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Sign Up
                            </a>
                        </>
                    ) : (
                        <>
                            <span className="text-yellow-200 font-medium bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                Welcome, {user?.name}!
                            </span>

                            {/* Profile Section */}
                            <div className="relative" ref={profileRef}>
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <FiUser
                                        className="text-black text-xl"
                                        onClick={() => setProfileOpen(!profileOpen)}
                                    />
                                </div>

                                {/* Profile Dropdown */}
                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-3 w-56 bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        <a href="/dashboard" className="flex items-center px-5 py-3 text-gray-300 hover:bg-purple-600/20 hover:text-white transition-all duration-200">
                                            <FiUser className="mr-3 text-yellow-400" /> Dashboard
                                        </a>
                                        <a href="/dashboard" className="flex items-center px-5 py-3 text-gray-300 hover:bg-purple-600/20 hover:text-white transition-all duration-200">
                                            <FiBookmark className="mr-3 text-yellow-400" /> My Bookings
                                        </a>
                                        <a href="/favorites" className="flex items-center px-5 py-3 text-gray-300 hover:bg-purple-600/20 hover:text-white transition-all duration-200">
                                            <FiHeart className="mr-3 text-yellow-400" /> Favorites
                                        </a>
                                        <a href="/settings" className="flex items-center px-5 py-3 text-gray-300 hover:bg-purple-600/20 hover:text-white transition-all duration-200">
                                            <FiSettings className="mr-3 text-yellow-400" /> Settings
                                        </a>
                                        <div className="border-t border-purple-500/20"></div>
                                        <button onClick={handleLogout} className="flex items-center w-full px-5 py-3 text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200">
                                            <FiLogOut className="mr-3" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        className="p-2 bg-black/20 backdrop-blur-md rounded-lg border border-white/20 hover:bg-black/30 transition-all duration-300"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? (
                            <FiX className="text-2xl text-white" />
                        ) : (
                            <FiMenu className="text-2xl text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 border-t border-purple-500/20 shadow-xl py-6 px-6 space-y-4 text-yellow-200 backdrop-blur-sm">
                    <a href="/" className="block hover:text-yellow-300 transition-colors py-2 text-lg font-medium">
                        Home
                    </a>
                    <div className="flex items-center space-x-2 py-2">
                        <FiMapPin className="text-yellow-400" />
                        <span>Mangalore</span>
                    </div>
                    {!isLoggedIn ? (
                        <>
                            <a href="/login" className="block bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 px-6 rounded-full text-center hover:from-yellow-400 hover:to-orange-400 transition-all duration-300">
                                Login
                            </a>
                            <a href="/signup" className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-full text-center hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
                                Sign Up
                            </a>
                        </>
                    ) : (
                        <>
                            <span className="block py-2 text-lg font-medium">Welcome, {user?.name}!</span>
                            <a href="/dashboard" className="block hover:text-yellow-300 transition-colors py-2">
                                Dashboard
                            </a>
                            <a href="/dashboard" className="block hover:text-yellow-300 transition-colors py-2">
                                My Bookings
                            </a>
                            <a href="/favorites" className="block hover:text-yellow-300 transition-colors py-2">
                                Favorites
                            </a>
                            <a href="/settings" className="block hover:text-yellow-300 transition-colors py-2">
                                Settings
                            </a>
                            <button onClick={handleLogout} className="block text-red-400 hover:text-red-300 transition-colors py-2 text-left w-full">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
