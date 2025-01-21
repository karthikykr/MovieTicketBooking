import react from 'react';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-gray-500 text-white">
            <div className="flex justify-center w-full max-w-6xl mx-auto">
                {/* Left Side: Logo and Home */}
                <div className="flex items-center space-x-4">
                    <img
                        src="https://via.placeholder.com/40" // Replace with your logo URL
                        alt="Logo"
                        className="w-10 h-10 rounded-full"
                    />
                    <a href="/" className="text-xl font-semibold hover:underline">
                        Home
                    </a>
                </div>

                {/* Right Side: Sign In/Up, Profile, and Menu */}
                <div className="flex items-center space-x-4 ml-auto">
                    <button className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">
                        Sign In
                    </button>
                    <button className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">
                        Sign Up
                    </button>
                    <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800">
                        Profile
                    </button>
                    <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-800">
                        Menu
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;



