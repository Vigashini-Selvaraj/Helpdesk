import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn, Eye, EyeOff } from "lucide-react";
import API_URL from "../config/api";

const Login = () => {
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
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Gradients from Home */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary-50/80 to-white -z-20" />
      <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-20" />
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/4 -z-20" />

      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm -z-10" />

      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-2xl shadow-2xl p-8 border border-white/50">

        <div className="text-center mb-6">
          <LogIn className="mx-auto text-primary-600" size={32} />
          <h2 className="text-2xl font-bold mt-2">Login</h2>
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
            className="w-full p-3 border rounded-lg"
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
              className="w-full p-3 border rounded-lg pr-10"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
