import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn, Eye, EyeOff, X } from "lucide-react";
import API_URL from "../config/api";

const LoginModal = ({ onClose, onSwitchToRegister }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                formData
            );

            console.log("Login Login Response:", response.data);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Clear form data
            setFormData({
                email: "",
                password: ""
            });

            alert("Login successful 🎉");
            onClose(); // Close modal on success

            const userRole = response.data.user.role || "";
            if (userRole.toLowerCase() === "admin") {
                navigate("/admin");
            } else {
                navigate("/student");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Effect - Blurs the home screen behind */}
            <div
                className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-all"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white/90 backdrop-blur-xl w-full max-w-md rounded-2xl shadow-2xl p-8 border border-white/50 animate-fade-in-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <LogIn className="mx-auto text-primary-600" size={32} />
                    <h2 className="text-2xl font-bold mt-2 text-slate-900">Login</h2>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        autoComplete="off"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white/50"
                    />

                    {/* PASSWORD WITH EYE ICON */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            required
                            autoComplete="off"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-slate-200 rounded-lg pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white/50"
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-primary-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 transform hover:-translate-y-0.5"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-slate-600 text-sm">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="text-primary-600 font-bold hover:underline"
                            >
                                Register
                            </button>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default LoginModal;
