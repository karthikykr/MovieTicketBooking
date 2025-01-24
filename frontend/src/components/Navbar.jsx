import React, { useState } from "react";
import { FiSearch, FiUser, FiMenu, FiX, FiMapPin } from "react-icons/fi";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <a href="/">🎥 MovieBook</a>
                </div>

                {/* Large Screen Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <a href="/" className="hover:text-yellow-400">
                        Home
                    </a>
                    <div className="relative">
                        <FiMapPin className="absolute left-3 top-2 text-gray-500" />
                        <select
                            className="pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
                            aria-label="Select location"
                        >
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Chennai">Chennai</option>
                        </select>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="pl-10 pr-4 py-2 rounded bg-gray-800 text-white"
                        />
                        <FiSearch className="absolute left-3 top-2 text-gray-500" />
                    </div>
                    <a href="/signup" className="hover:text-yellow-400">
                        Sign Up
                    </a>
                    <div className="relative group">
                        <FiUser className="text-xl cursor-pointer hover:text-yellow-400" />
                        {/* Profile Dropdown */}
                        <div className="absolute right-0 bg-gray-800 text-white rounded shadow-md hidden group-hover:block">
                            <a href="/profile" className="block px-4 py-2 hover:bg-gray-700">
                                My Profile
                            </a>
                            <a href="/logout" className="block px-4 py-2 hover:bg-gray-700">
                                Logout
                            </a>
                        </div>
                    </div>
                </div>

                {/* Hamburger Menu for Mobile */}
                <div className="md:hidden">
                    {menuOpen ? (
                        <FiX
                            className="text-2xl cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}
                        />
                    ) : (
                        <FiMenu
                            className="text-2xl cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}
                        />
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-gray-800 text-white space-y-4 py-4 px-4">
                    <a href="/" className="block hover:text-yellow-400">
                        Home
                    </a>
                    <select
                        className="w-full pl-4 pr-4 py-2 rounded bg-gray-700"
                        aria-label="Select location"
                    >
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                    </select>
                    <a href="/signup" className="block hover:text-yellow-400">
                        Sign Up
                    </a>
                    <a href="/profile" className="block hover:text-yellow-400">
                        My Profile
                    </a>
                    <a href="/logout" className="block hover:text-yellow-400">
                        Logout
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
