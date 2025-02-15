import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiUser, FiMenu, FiX, FiMapPin, FiBookmark, FiHeart, FiSettings, FiLogOut } from "react-icons/fi";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null); // Reference for profile dropdown

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

    return (
        <nav className="bg-white shadow-md relative z-50">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold text-gray-800">
                    <a href="/">🎬 MovieBook</a>
                </div>

                {/* Large Screen Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <a href="/" className="hover:text-blue-600 font-medium">
                        Home
                    </a>

                    {/* Location Display (No Dropdown) */}
                    <div className="flex items-center space-x-2 text-gray-700">
                        <FiMapPin />
                        <span>Mumbai</span>
                    </div>

                    {/* Search Box */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="pl-10 pr-4 py-2 border rounded-md bg-gray-100 text-gray-700 focus:ring-2 focus:ring-blue-400"
                        />
                        <FiSearch className="absolute left-3 top-3 text-gray-500" />
                    </div>

                    <a href="/signup" className="hover:text-blue-600 font-medium">
                        Sign Up
                    </a>

                    {/* Profile Section */}
                    <div className="relative" ref={profileRef}>
                        <FiUser
                            className="text-xl cursor-pointer text-gray-700 hover:text-blue-600"
                            onClick={() => setProfileOpen(!profileOpen)}
                        />

                        {/* Profile Dropdown */}
                        {profileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                                <a href="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <FiUser className="mr-2" /> My Profile
                                </a>
                                <a href="/bookings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <FiBookmark className="mr-2" /> My Bookings
                                </a>
                                <a href="/favorites" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <FiHeart className="mr-2" /> Favorites
                                </a>
                                <a href="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <FiSettings className="mr-2" /> Settings
                                </a>
                                <a href="/logout" className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100">
                                    <FiLogOut className="mr-2" /> Logout
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    {menuOpen ? (
                        <FiX className="text-2xl cursor-pointer text-gray-800" onClick={() => setMenuOpen(false)} />
                    ) : (
                        <FiMenu className="text-2xl cursor-pointer text-gray-800" onClick={() => setMenuOpen(true)} />
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t shadow-md py-4 px-6 space-y-4">
                    <a href="/" className="block text-gray-800 hover:text-blue-600">
                        Home
                    </a>
                    <span className="block text-gray-800">📍 Mumbai</span>
                    <a href="/signup" className="block text-gray-800 hover:text-blue-600">
                        Sign Up
                    </a>
                    <a href="/profile" className="block text-gray-800 hover:text-blue-600">
                        My Profile
                    </a>
                    <a href="/bookings" className="block text-gray-800 hover:text-blue-600">
                        My Bookings
                    </a>
                    <a href="/favorites" className="block text-gray-800 hover:text-blue-600">
                        Favorites
                    </a>
                    <a href="/settings" className="block text-gray-800 hover:text-blue-600">
                        Settings
                    </a>
                    <a href="/logout" className="block text-red-600 hover:text-blue-600">
                        Logout
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
