import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../utils/api";
import { motion } from "framer-motion";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "", role: "nurse" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <motion.form 
                initial={{ opacity: 0, y: -50 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }} 
                className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Login</h2>
                {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full mb-6 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full mb-6 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    onChange={handleChange}
                    required
                />
                <button className="w-full bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition font-semibold text-lg" type="submit">
                    Login
                </button>
            </motion.form>
        </div>
    );
};

export default Login;
