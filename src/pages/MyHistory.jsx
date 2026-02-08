import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";
import {
    LayoutDashboard,
    PlusCircle,
    ClipboardList,
    LogOut,
    ShieldCheck,
} from "lucide-react";

const MyHistory = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user.email) {
            navigate("/login");
            return;
        }
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const userId = user.id || user._id;
            const res = await axios.get(`${API_URL}/api/complaints/my/${userId}`);
            setComplaints(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case "Resolved": return { color: "bg-green-100 text-green-700", emoji: "😊", msg: "We're glad we could help!" };
            case "In Progress": return { color: "bg-yellow-100 text-yellow-700", emoji: "🙂", msg: "Working on it right now." };
            default: return { color: "bg-gray-100 text-gray-700", emoji: "😐", msg: "We received it. Hang tight." };
        }
    };

    const getUrgencyBadge = (urgency) => {
        switch (urgency) {
            case "High": return "bg-red-500 text-white";
            case "Medium": return "bg-orange-400 text-white";
            default: return "bg-green-500 text-white";
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-primary-200 via-primary-100 to-white">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r px-6 py-6 flex flex-col">
                <div className="flex items-center gap-2 mb-10">
                    <div className="bg-primary-600 text-white p-2 rounded-lg">
                        <ShieldCheck size={20} />
                    </div>
                    <h1 className="text-xl font-bold">HelpDesk+</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <div onClick={() => navigate("/student")} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </div>
                    <div onClick={() => navigate("/new-complaint")} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <PlusCircle size={18} />
                        New Complaint
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-600 font-medium cursor-pointer">
                        <ClipboardList size={18} />
                        My History
                    </div>
                </nav>

                <button onClick={() => { localStorage.removeItem("user"); navigate("/login"); }} className="flex items-center gap-2 mt-6 text-gray-500 hover:text-red-500">
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
                    <p className="text-gray-500 mt-2">Track the status of your submitted grievances.</p>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading history...</div>
                ) : complaints.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-dashed">
                        <p className="text-gray-500">No complaints yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {complaints.map((c) => {
                            const { color, emoji, msg } = getStatusInfo(c.status);
                            const urgencyBadge = getUrgencyBadge(c.urgency || "Medium");

                            return (
                                <div
                                    key={c._id}
                                    onClick={() => navigate(`/complaint/${c._id}`)}
                                    className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition relative overflow-hidden cursor-pointer group"
                                >
                                    {/* EMOTION STRIP (Left Border) */}
                                    {c.status === "Pending" && <div className="absolute left-0 top-0 bottom-0 w-2 bg-gray-300 group-hover:bg-gray-400 transition"></div>}
                                    {c.status === "In Progress" && <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-400 group-hover:bg-yellow-500 transition"></div>}
                                    {c.status === "Resolved" && <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-400 group-hover:bg-green-500 transition"></div>}

                                    <div className="flex justify-between items-start pl-4">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="font-mono text-gray-400">#{c._id.slice(-6).toUpperCase()}</span>
                                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${urgencyBadge}`}>
                                                {c.urgency || "Medium"} Priority
                                            </span>
                                        </div>

                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${color}`}>
                                            <span>{emoji}</span>
                                            {c.status}
                                        </div>
                                    </div>

                                    <div className="pl-4 mt-4">
                                        <h3 className="text-lg font-bold text-slate-800">{c.title}</h3>
                                        <p className="text-slate-600 mt-1">{c.description}</p>

                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Category: {c.type}</span>
                                            <span className="text-sm text-gray-400 italic">• {msg}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyHistory;
