import { useState } from "react";
import { useNavigate } from "react-router-dom";

const signUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3001/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed");

            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                    onChange={handleChange}
                    required
                />
                <button className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600" type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default signUp;
