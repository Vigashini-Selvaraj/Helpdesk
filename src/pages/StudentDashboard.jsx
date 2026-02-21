import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    PlusCircle,
    ClipboardList,
    LogOut,
    ShieldCheck,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Bell,
    HelpCircle,
    Megaphone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";
import Chatbot from "../components/Chatbot";

export default function StudentDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
    const [loading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        if (!user.email) {
            navigate("/login");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userId = user.id || user._id;
            const res = await axios.get(`${API_URL}/api/complaints/my/${userId}`);
            const data = res.data;

            // Calculate Stats
            const total = data.length;
            const pending = data.filter(c => c.status === "Pending").length;
            const resolved = data.filter(c => c.status === "Resolved").length;
            const inProgress = data.filter(c => c.status === "In Progress").length;

            setStats({ total, pending, resolved, inProgress });
        } catch (err) {
            console.error("Error fetching dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 font-sans">

            {/* SIDEBAR */}
            <aside className="w-72 bg-white border-r px-8 py-8 flex flex-col hidden md:flex sticky top-0 h-screen">
                {/* LOGO */}
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-purple-200">
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">HelpDesk+</h1>
                </div>

                {/* NAV */}
                <nav className="flex-1 space-y-3">
                    <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-purple-50 text-purple-700 font-bold shadow-sm ring-1 ring-purple-100">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </div>

                    <div
                        onClick={() => navigate("/new-complaint")}
                        className="flex items-center gap-4 px-5 py-4 text-gray-500 hover:bg-gradient-to-br from-purple-50 to-white hover:text-gray-900 rounded-xl cursor-pointer transition-all duration-200 font-medium"
                    >
                        <PlusCircle size={20} />
                        New Complaint
                    </div>

                    <div
                        onClick={() => navigate("/history")}
                        className="flex items-center gap-4 px-5 py-4 text-gray-500 hover:bg-gradient-to-br from-purple-50 to-white hover:text-gray-900 rounded-xl cursor-pointer transition-all duration-200 font-medium"
                    >
                        <ClipboardList size={20} />
                        My History
                    </div>
                </nav>

                {/* ACCESS MODE */}
                <div className="mt-10 bg-gradient-to-br from-purple-50 to-white p-4 rounded-2xl border border-purple-50 cursor-pointer hover:bg-purple-100 transition group" onClick={() => setShowProfile(true)}>
                    <p className="text-xs font-bold text-gray-400 mb-3 tracking-wider uppercase group-hover:text-purple-500">Current Session</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold group-hover:bg-purple-600 group-hover:text-white transition">
                            {user.name ? user.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user.name || "Student"}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* LOGOUT */}
                <button
                    onClick={() => { localStorage.clear(); navigate("/"); }}
                    className="flex items-center gap-3 mt-8 text-gray-400 hover:text-red-500 transition-colors px-2 font-medium"
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">

                {/* HEADER */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                        Student Dashboard
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl">
                        Track your complaints, stay updated with campus news, and find answers quickly.
                    </p>
                </div>

                {/* 1. BIG STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Tickets" count={stats.total} icon={<ClipboardList size={28} />} color="bg-blue-600" />
                    <StatCard title="Pending" count={stats.pending} icon={<Clock size={28} />} color="bg-orange-500" />
                    <StatCard title="In Progress" count={stats.inProgress} icon={<AlertCircle size={28} />} color="bg-purple-600" />
                    <StatCard title="Resolved" count={stats.resolved} icon={<CheckCircle2 size={28} />} color="bg-green-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* QUICK ACTIONS */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-purple-600" /> Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ActionCard
                                    onClick={() => navigate("/new-complaint")}
                                    title="File a New Complaint"
                                    desc="Submit a new issue regarding hostel, academic, or infrastructure."
                                    icon={<PlusCircle size={32} className="text-white" />}
                                    bg="bg-purple-600 text-white hover:bg-purple-700"
                                    text="text-purple-100"
                                />
                                <ActionCard
                                    onClick={() => navigate("/history")}
                                    title="View My History"
                                    desc="Check the status of your previous complaints and chat with AI."
                                    icon={<ClipboardList size={32} className="text-purple-600" />}
                                    bg="bg-white text-gray-800 border border-gray-200 hover:border-purple-300"
                                    text="text-gray-500"
                                />
                            </div>
                        </section>

                        {/* CAMPUS NEWS (Filler Content for Scroll) */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Megaphone className="text-orange-500" /> Campus Updates
                            </h3>
                            <div className="space-y-4">
                                <NewsCard
                                    date="Oct 24, 2023"
                                    title="Library Hours Extended"
                                    desc="The central library will now remain open until midnight for exam preparation."
                                    tag="Academic"
                                />
                                <NewsCard
                                    date="Oct 22, 2023"
                                    title="Wifi Maintenance Scheduled"
                                    desc="Hostel Block A will experience downtime on Saturday from 2 PM to 4 PM."
                                    tag="Infrastructure"
                                />
                                <NewsCard
                                    date="Oct 15, 2023"
                                    title="Annual Sports Meet Registration"
                                    desc="Registration for the inter-hostel sports tournament is now open. Visit the gymkhana to sign up."
                                    tag="Events"
                                />
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN (1/3) */}
                    <div className="space-y-10">

                        {/* HELP / EMERGENCY */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <Bell className="animate-pulse" /> Emergency?
                            </h3>
                            <p className="text-purple-100 mb-8 leading-relaxed">
                                For urgent safety or medical emergencies, do not use this portal. Call the 24/7 helpline immediately.
                            </p>
                            <button className="w-full bg-white text-purple-700 py-4 rounded-xl font-bold hover:bg-purple-50 transition shadow-md text-lg">
                                📞 Call 911-CAMPUS
                            </button>
                        </div>

                        {/* FAQ */}
                        <section>
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <HelpCircle className="text-green-600" /> FAQ
                            </h3>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                                <FAQItem q="How long does resolution take?" a="Typically 24-48 hours depending on priority." />
                                <div className="border-b border-gray-100"></div>
                                <FAQItem q="Can I edit a complaint?" a="No, but you can chat with the AI to add details." />
                                <div className="border-b border-gray-100"></div>
                                <FAQItem q="Is my identity anonymous?" a="Admins see your name to verify authenticity." />
                            </div>
                        </section>

                    </div>

                </div>

                {/* CHATBOT INTEGRATION */}
                <Chatbot />

            </main>

            {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
        </div>
    );
}

/* BIG STAT CARD */
function StatCard({ title, count, icon, color }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 flex items-center gap-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className={`${color} text-white p-4 rounded-2xl shadow-md`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">{title}</p>
                <p className="text-4xl font-extrabold text-gray-800">{count}</p>
            </div>
        </div>
    );
}

/* BIG ACTION CARD */
function ActionCard({ title, desc, onClick, icon, bg, text }) {
    return (
        <div
            onClick={onClick}
            className={`${bg} p-8 rounded-3xl cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[200px]`}
        >
            <div className="mb-6">
                <div className="mb-4 inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                    {icon}
                </div>
                <h4 className="text-2xl font-bold mb-2">{title}</h4>
                <p className={`text-sm ${text} leading-relaxed`}>{desc}</p>
            </div>
            <div className="flex justify-end">
                <ChevronRight size={24} className="opacity-70" />
            </div>
        </div>
    );
}

/* NEWS CARD */
function NewsCard({ date, title, desc, tag }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-100 transition shadow-sm hover:shadow-md cursor-default">
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{date}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-bold">{tag}</span>
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">{title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

/* FAQ ITEM */
function FAQItem({ q, a }) {
    return (
        <div>
            <p className="font-bold text-gray-800 text-sm mb-1">{q}</p>
            <p className="text-gray-500 text-sm">{a}</p>
        </div>
    );
}
/* PROFILE MODAL */
function ProfileModal({ user, onClose }) {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">

                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

                {/* Avatar */}
                <div className="flex justify-center -mt-16 relative">
                    <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center text-4xl font-bold text-purple-600">
                            {user.name ? user.name.charAt(0).toUpperCase() : "S"}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center px-8 pb-8 pt-4">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-purple-600 font-medium bg-purple-50 inline-block px-3 py-1 rounded-full text-sm mt-1">
                        Student Account
                    </p>

                    <div className="mt-8 space-y-4 text-left">
                        <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-gray-500">📧</div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Email Address</p>
                                <p className="text-gray-800 font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-gray-500">🎓</div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Role</p>
                                <p className="text-gray-800 font-medium">Undergraduate Student</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-gray-500">🆔</div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">User ID</p>
                                <p className="text-gray-800 font-mono text-sm">#{user.id ? user.id.slice(-6).toUpperCase() : "UNKNOWN"}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-8 w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                    >
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
