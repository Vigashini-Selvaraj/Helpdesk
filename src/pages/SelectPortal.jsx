import { useNavigate } from "react-router-dom";

const SelectPortal = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-200 via-primary-100 to-white flex items-center justify-center px-6">
            {/* Back */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-8 left-8 text-gray-600 hover:text-primary-600"
            >
                ← Back to Home
            </button>

            {/* CARD */}
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl p-12 text-center">
                {/* ICON */}
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-primary-600 text-white rounded-2xl shadow-lg text-3xl mb-6">
                    🎓
                </div>

                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome Back
                </h1>
                <p className="text-gray-500 mt-2">
                    Select your portal to continue
                </p>

                {/* STUDENT */}
                <div
                    onClick={() => navigate("/student")}
                    className="mt-10 flex items-center gap-4 p-6 border rounded-2xl cursor-pointer hover:border-primary-600 hover:shadow transition"
                >
                    <div className="w-12 h-12 flex items-center justify-center bg-primary-100 text-primary-600 rounded-xl text-xl">
                        🎓
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-lg">Student Portal</h3>
                        <p className="text-gray-500 text-sm">
                            Submit and track complaints
                        </p>
                    </div>
                </div>

                {/* ADMIN */}
                <div
                    onClick={() => navigate("/admin")}
                    className="mt-5 flex items-center gap-4 p-6 border rounded-2xl cursor-pointer hover:border-primary-600 hover:shadow transition"
                >
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-600 rounded-xl text-xl">
                        🛡️
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-lg">Admin Portal</h3>
                        <p className="text-gray-500 text-sm">
                            Manage grievance resolution
                        </p>
                    </div>
                </div>

                Secure Access • Tracklyy System v1.0
            </div>
        </div>
    );
};

export default SelectPortal;
