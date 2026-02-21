import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import axios from "axios";
import API_URL from "../config/api";

const Register = () => {
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

    try {
      await axios.post(
        `${API_URL}/api/auth/register`,
        formData
      );

      // Clear form data
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "Student"
      });

      alert("Registration successful 🎉 Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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

      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl p-10 border border-white/50">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">
            Join Tracklyy to resolve issues
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* NAME */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={formData.role === "Student"}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="text-center py-3 border-2 rounded-xl peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700 font-medium">
                  Student
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="Admin"
                  checked={formData.role === "Admin"}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="text-center py-3 border-2 rounded-xl peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700 font-medium">
                  Admin
                </div>
              </label>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register Account"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center mt-8 text-slate-500 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-primary-600 font-bold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;
