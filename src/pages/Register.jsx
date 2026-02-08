import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import axios from "axios";

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
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert("Registration successful 🎉 Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-200 via-primary-100 to-white flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10">

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
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50"
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
