import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, X } from "lucide-react";
import axios from "axios";
import API_URL from "../config/api";

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Student",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        console.log("📝 Attempting registration with:", formData);
        console.log("API URL:", API_URL);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/register`,
                formData
            );

            console.log("✅ Registration response:", response.data);

            // Clear form data
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "Student"
            });

            alert("Registration successful 🎉 Please log in.");
            onSwitchToLogin(); // Switch to login modal after success
        } catch (err) {
            console.error("❌ Registration error:", err);
            console.error("Error response:", err.response);

            if (err.response) {
                // Server responded with error status
                setError(err.response.data.message || "Registration failed");
            } else if (err.request) {
                // Request was made but no response
                setError("Cannot connect to server. Please check if backend is running.");
            } else {
                // Something else happened
                setError(err.message || "Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Effect */}
            <div
                className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white/90 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl p-8 border border-white/50 animate-fade-in-up max-h-[90vh] overflow-y-auto">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
                >
                    <X size={24} />
                </button>

                {/* HEADER */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl mb-3">
                        <UserPlus size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Join Tracklyy to resolve issues
                    </p>
                </div>

                {/* FORM */}
                <form className="space-y-4" onSubmit={handleSubmit}>

                    {/* NAME */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            autoComplete="off"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white/50"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                            University Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="student@university.edu"
                            required
                            autoComplete="off"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white/50"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white/50"
                        />
                    </div>

                    {/* ROLE */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            I am a
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="cursor-pointer group">
                                <input
                                    type="radio"
                                    name="role"
                                    value="Student"
                                    checked={formData.role === "Student"}
                                    onChange={handleChange}
                                    className="peer sr-only"
                                />
                                <div className="text-center py-2.5 border-2 border-slate-200 rounded-xl peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700 font-medium text-slate-600 transition-all group-hover:border-primary-300">
                                    Student
                                </div>
                            </label>

                            <label className="cursor-pointer group">
                                <input
                                    type="radio"
                                    name="role"
                                    value="Admin"
                                    checked={formData.role === "Admin"}
                                    onChange={handleChange}
                                    className="peer sr-only"
                                />
                                <div className="text-center py-2.5 border-2 border-slate-200 rounded-xl peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700 font-medium text-slate-600 transition-all group-hover:border-primary-300">
                                    Admin
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</p>
                    )}

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50 transform hover:-translate-y-0.5"
                    >
                        {loading ? "Creating account..." : "Register Account"}
                    </button>
                </form>

                {/* LOGIN LINK */}
                <p className="text-center mt-6 text-slate-500 text-sm">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-primary-600 font-bold cursor-pointer hover:underline"
                    >
                        Log in
                    </button>
                </p>

            </div>
        </div>
    );
};

export default RegisterModal;
