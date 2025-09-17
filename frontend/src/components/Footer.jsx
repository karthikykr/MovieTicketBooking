import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="text-3xl font-bold text-yellow-400">
                            <span role="img" aria-label="clapperboard" className="text-4xl">🎬</span> MovieBook
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            Your ultimate destination for booking movie tickets online. Experience the magic of cinema with ease and convenience.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition duration-300">
                                <FiFacebook size={24} />
                            </a>
                            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition duration-300">
                                <FiTwitter size={24} />
                            </a>
                            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition duration-300">
                                <FiInstagram size={24} />
                            </a>
                            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition duration-300">
                                <FiYoutube size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-yellow-400">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-300 hover:text-yellow-300 transition duration-300">Home</a></li>
                            <li><a href="/movies" className="text-gray-300 hover:text-yellow-300 transition duration-300">Movies</a></li>
                            <li><a href="/theaters" className="text-gray-300 hover:text-yellow-300 transition duration-300">Theaters</a></li>
                            <li><a href="/showtimes" className="text-gray-300 hover:text-yellow-300 transition duration-300">Showtimes</a></li>
                            <li><a href="/dashboard" className="text-gray-300 hover:text-yellow-300 transition duration-300">My Account</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-yellow-400">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="/help" className="text-gray-300 hover:text-yellow-300 transition duration-300">Help Center</a></li>
                            <li><a href="/contact" className="text-gray-300 hover:text-yellow-300 transition duration-300">Contact Us</a></li>
                            <li><a href="/faq" className="text-gray-300 hover:text-yellow-300 transition duration-300">FAQ</a></li>
                            <li><a href="/terms" className="text-gray-300 hover:text-yellow-300 transition duration-300">Terms of Service</a></li>
                            <li><a href="/privacy" className="text-gray-300 hover:text-yellow-300 transition duration-300">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-yellow-400">Contact Info</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <FiMapPin className="text-yellow-400" />
                                <span className="text-gray-300">Mangalore, Karnataka, India</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiPhone className="text-yellow-400" />
                                <span className="text-gray-300">+91 123 456 7890</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiMail className="text-yellow-400" />
                                <span className="text-gray-300">support@moviebook.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} MovieBook. All rights reserved. Made with ❤️ for movie lovers.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
