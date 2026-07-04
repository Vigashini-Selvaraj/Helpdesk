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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="flex min-h-screen bg-gradient-to-br from-primary-200 via-primary-100 to-white relative">
            {/* MOBILE TOP BAR */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b px-6 flex items-center justify-between z-[60]">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={24} className="text-primary-600" />
                    <span className="font-bold text-gray-800">HelpDesk+</span>
                </div>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                    <LayoutDashboard size={24} />
                </button>
            </div>

            {/* SIDEBAR OVERLAY */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity z-[70] md:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* SIDEBAR */}
            <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r px-6 py-6 flex flex-col z-[80] transition-transform duration-300 md:translate-x-0 md:sticky ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
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

                <button onClick={() => { localStorage.clear(); navigate("/"); }} className="flex items-center gap-2 mt-6 text-gray-500 hover:text-red-500 font-medium">
                    <LogOut size={18} />
                    Logout
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 md:p-10 overflow-y-auto pt-20 md:pt-10">
                <div className="mb-6 md:mb-12">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">My Complaints</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base font-medium">Track your submitted grievances in real-time.</p>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading history...</div>
                ) : complaints.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center animate-fade-in">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <ClipboardList size={40} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-medium">No complaints submitted yet.</p>
                        <button onClick={() => navigate("/new-complaint")} className="mt-4 text-primary-600 font-bold hover:underline">File your first complaint →</button>
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

                                    <div className="flex flex-col sm:flex-row justify-between items-start pl-4 gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-bold uppercase tracking-wider">
                                            <span className="text-primary-500 bg-primary-50 px-2 py-1 rounded">#{c._id.slice(-6).toUpperCase()}</span>
                                            <span className="text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                            <span className={`px-2 py-0.5 rounded-full w-fit ${urgencyBadge}`}>
                                                {c.urgency || "Medium"} Priority
                                            </span>
                                        </div>

                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black ring-1 ring-inset ${color} whitespace-nowrap`}>
                                            <span>{emoji}</span>
                                            {c.status.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="pl-4 mt-4">
                                        <h3 className="text-lg font-bold text-slate-800">{c.title}</h3>
                                        <p className="text-slate-600 mt-1">{c.description}</p>

                                        <div className="mt-4 flex flex-wrap items-center gap-2">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Category: {c.type}</span>
                                            <span className="text-sm text-gray-400 italic">• {msg}</span>
                                        </div>

                                        {(c.resolutionNote || c.adminFeedback) && (
                                            <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <ShieldCheck size={16} className="text-primary-600" />
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Official Response</p>
                                                </div>
                                                {c.resolutionNote && <p className="text-sm text-slate-700 font-semibold leading-relaxed mb-4">"{c.resolutionNote}"</p>}
                                                {c.adminFeedback && (
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-primary-700 bg-primary-50/50 w-fit px-3 py-1.5 rounded-lg border border-primary-100">
                                                        <span className="text-primary-500">★</span>
                                                        <span>{c.adminFeedback}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
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
