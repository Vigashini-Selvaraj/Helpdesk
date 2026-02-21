import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    LogOut,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Clock,
    Search,
    Trash2,
    Filter,
    Bell,
    Calendar,
    ChevronRight,
    MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";
import Chatbot from "../components/Chatbot";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview"); // overview, complaints, students
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
    const [complaints, setComplaints] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [complaintsRes, studentsRes] = await Promise.all([
                axios.get(`${API_URL}/api/complaints/all`),
                axios.get(`${API_URL}/api/users/all`)
            ]);

            const cData = complaintsRes.data;
            // Sort: High Urgency First
            const sortedData = cData.sort((a, b) => {
                const urgencyOrder = { "High": 3, "Medium": 2, "Low": 1 };
                return (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0);
            });

            setComplaints(sortedData);
            setStudents(studentsRes.data);

            const total = cData.length;
            const pending = cData.filter(c => c.status === "Pending").length;
            const resolved = cData.filter(c => c.status === "Resolved").length;
            const inProgress = cData.filter(c => c.status === "In Progress").length;

            setStats({ total, pending, resolved, inProgress });
        } catch (err) {
            console.error("Error loading admin data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComplaint = async (id) => {
        if (!confirm("Are you sure you want to delete this complaint?")) return;
        try {
            await axios.delete(`${API_URL}/api/complaints/${id}`);
            // Optimistic update
            setComplaints(prev => prev.filter(c => c._id !== id));
            // Recalculate stats locally
            const deleted = complaints.find(c => c._id === id);
            if (deleted) {
                setStats(prev => ({
                    ...prev,
                    total: prev.total - 1,
                    [deleted.status === 'In Progress' ? 'inProgress' : deleted.status.toLowerCase()]: prev[deleted.status === 'In Progress' ? 'inProgress' : deleted.status.toLowerCase()] - 1
                }));
            }
        } catch (err) {
            alert("Error deleting complaint");
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!confirm("Are you sure you want to remove this student? This action cannot be undone.")) return;
        try {
            await axios.delete(`${API_URL}/api/users/${id}`);
            setStudents(prev => prev.filter(s => s._id !== id));
        } catch (err) {
            alert("Error removing student");
        }
    };

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [nextStatus, setNextStatus] = useState("");

    const handleStatusChange = async (id, newStatus, resolutionData = null) => {
        if (!resolutionData) {
            setSelectedComplaintId(id);
            setNextStatus(newStatus);
            setShowStatusModal(true);
            return;
        }

        try {
            await axios.put(`${API_URL}/api/complaints/${id}/status`, {
                status: newStatus,
                ...resolutionData
            });
            setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus, ...resolutionData } : c));
            fetchData();
            setShowStatusModal(false);
            setSelectedComplaintId(null);
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const filteredComplaints = filterStatus === "All"
        ? complaints
        : complaints.filter(c => c.status === filterStatus);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 font-sans">
            {/* SIDEBAR */}
            <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-50">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-gradient-to-tr from-purple-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-purple-500/20">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Tracklyy</h1>
                            <p className="text-xs text-slate-400 font-medium">Admin Dashboard</p>
                        </div>
                    </div>

                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
                    <nav className="space-y-2">
                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            label="Overview"
                            active={activeTab === "overview"}
                            onClick={() => setActiveTab("overview")}
                        />
                        <NavItem
                            icon={<ClipboardList size={20} />}
                            label="Complaints"
                            active={activeTab === "complaints"}
                            onClick={() => setActiveTab("complaints")}
                            badge={complaints.filter(c => c.status === 'Pending').length}
                        />
                        <NavItem
                            icon={<Users size={20} />}
                            label="Students"
                            active={activeTab === "students"}
                            onClick={() => setActiveTab("students")}
                        />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <button
                        onClick={() => { localStorage.clear(); navigate("/"); }}
                        className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 w-full px-4 py-3 rounded-xl transition-all group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                    <p className="text-center text-xs text-slate-600 mt-4">v1.2.0 • Grid System</p>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-72 p-8 lg:p-12 overflow-y-auto bg-transparent">
                {/* HEADER */}
                <header className="flex justify-between items-center mb-12 animate-fade-in-up">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {getGreeting()}, Admin 👋
                        </h2>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <Calendar size={14} />
                            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2.5 bg-white rounded-full text-slate-400 hover:text-purple-600 hover:bg-purple-50 border border-slate-100 shadow-sm transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                A
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-slate-700">Administrator</p>
                                <p className="text-xs text-slate-500">Super User</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="space-y-10 animate-fade-in-up">
                        {/* STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Tickets"
                                count={stats.total}
                                icon={<ClipboardList size={24} />}
                                color="bg-blue-500"
                                gradient="from-blue-500 to-blue-600"
                                trend="+12% this week"
                            />
                            <StatCard
                                title="Pending"
                                count={stats.pending}
                                icon={<Clock size={24} />}
                                color="bg-orange-500"
                                gradient="from-orange-500 to-pink-500"
                                subtext="Requires attention"
                            />
                            <StatCard
                                title="In Progress"
                                count={stats.inProgress}
                                icon={<AlertCircle size={24} />}
                                color="bg-purple-500"
                                gradient="from-purple-500 to-indigo-600"
                                trend="Active resolution"
                            />
                            <StatCard
                                title="Resolved"
                                count={stats.resolved}
                                icon={<CheckCircle2 size={24} />}
                                color="bg-green-500"
                                gradient="from-emerald-400 to-green-600"
                                trend="Completion rate"
                            />
                        </div>

                        {/* Recent Activity Section */}
                        <div>
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Recent Complaints</h3>
                                    <p className="text-slate-500 text-sm">Latest submissions needing review</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('complaints')}
                                    className="text-purple-600 font-semibold text-sm hover:underline flex items-center gap-1"
                                >
                                    View All <ChevronRight size={16} />
                                </button>
                            </div>
                            <ComplaintsTable
                                complaints={filteredComplaints.slice(0, 5)}
                                loading={loading}
                                handleDelete={handleDeleteComplaint}
                                handleStatusChange={handleStatusChange}
                                compact={true}
                            />
                        </div>
                    </div>
                )}

                {/* COMPLAINTS TAB */}
                {activeTab === "complaints" && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Manage Complaints</h3>
                                <p className="text-slate-500 text-sm">Track and resolve student grievances</p>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                                <Filter size={18} className="text-slate-400 ml-2" />
                                <select
                                    className="text-sm font-medium text-slate-600 outline-none bg-transparent pr-4 py-1.5 cursor-pointer hover:text-purple-600 transition-colors"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending Review</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <ComplaintsTable
                                complaints={filteredComplaints}
                                loading={loading}
                                handleDelete={handleDeleteComplaint}
                                handleStatusChange={handleStatusChange}
                            />
                        </div>
                    </div>
                )}

                {/* STUDENTS TAB */}
                {activeTab === "students" && (
                    <div className="animate-fade-in-up bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Registered Students</h3>
                                <p className="text-slate-500 text-sm mt-1">Manage user access and accounts</p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-2 text-slate-400 text-sm shadow-sm">
                                <Search size={16} />
                                <input type="text" placeholder="Search students..." className="outline-none text-slate-700 w-48 placeholder-slate-400" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4 w-16">#</th>
                                        <th className="px-6 py-4">NAME</th>
                                        <th className="px-6 py-4">EMAIL</th>
                                        <th className="px-6 py-4">ROLE</th>
                                        <th className="px-6 py-4">JOINED</th>
                                        <th className="px-6 py-4 text-right">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {students.map((u, i) => (
                                        <tr key={u._id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-8 py-4 text-slate-400 font-medium">{i + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${u.role === 'Admin'
                                                    ? 'bg-purple-50 text-purple-600 border-purple-200'
                                                    : 'bg-blue-50 text-blue-600 border-blue-200'
                                                    }`}>
                                                    {u.role || "Student"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {u.role !== 'Admin' && (
                                                    <button
                                                        onClick={() => handleDeleteStudent(u._id)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                        title="Remove Student"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
            <Chatbot role="admin" />
            {showStatusModal && (
                <StatusUpdateModal
                    status={nextStatus}
                    onClose={() => setShowStatusModal(false)}
                    onSubmit={(data) => handleStatusChange(selectedComplaintId, nextStatus, data)}
                />
            )}
        </div>
    );
}

// --- SUB COMPONENTS ---

function NavItem({ icon, label, active, onClick, badge }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between px-4 py-3.5 mx-2 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${active
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
        >
            <div className="flex items-center gap-3.5 relative z-10">
                <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {icon}
                </span>
                <span className="font-semibold tracking-wide">{label}</span>
            </div>
            {badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                    {badge}
                </span>
            )}
            {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-100 z-0"></div>
            )}
        </div>
    );
}

function StatCard({ title, count, icon, color, gradient, trend, subtext }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                {trend && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>}
                {subtext && <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{subtext}</span>}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">{count}</h3>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full opacity-50 z-0 pointer-events-none"></div>
        </div>
    );
}

function ComplaintsTable({ complaints, loading, handleDelete, handleStatusChange, compact = false }) {
    if (loading) return <div className="p-12 text-center text-slate-400 font-medium animate-pulse">Loading data...</div>;
    if (complaints.length === 0) return <div className="p-12 text-center text-slate-400 font-medium bg-slate-50 rounded-lg m-4 border border-dashed border-slate-200">No complaints found.</div>;

    const getCategoryEmoji = (category) => {
        const map = {
            'Food': '🍔',
            'Hostel': '🏢',
            'Infrastructure': '🚿',
            'Academic': '📚',
            'Wifi': '📶',
            'Other': '📝',
            'Cleanliness': '🧹',
            'Electricity': '💡'
        };
        return map[category] || '📌';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                {!compact && (
                    <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-8 py-4">Issue</th>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                )}
                <tbody className="divide-y divide-slate-50">
                    {complaints.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-8 py-5">
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold text-slate-800 text-base flex items-center gap-2">
                                        <span className="text-xl">{getCategoryEmoji(c.type)}</span>
                                        {c.title}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate max-w-xs">{c.description}</p>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                        {c.user?.name ? c.user.name.charAt(0) : '?'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700">{c.user?.name || "Unknown"}</p>
                                        <p className="text-xs text-slate-400">{c.user?.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                    {c.type}
                                </span>
                                {c.urgency === "High" && (
                                    <span className="ml-2 inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-wide">
                                        High
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-5">
                                <select
                                    value={c.status}
                                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold shadow-sm outline-none cursor-pointer transition-all border-2 ${c.status === "Pending" ? "text-red-600 border-red-100 bg-red-50 hover:bg-red-100" :
                                        c.status === "In Progress" ? "text-orange-600 border-orange-100 bg-orange-50 hover:bg-orange-100" :
                                            "text-green-600 border-green-100 bg-green-50 hover:bg-green-100"
                                        }`}
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.2rem center`, backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">Processing</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <button
                                    onClick={() => handleDelete(c._id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Complaint"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatusUpdateModal({ status, onClose, onSubmit }) {
    const [data, setData] = useState({
        resolutionNote: "",
        adminFeedback: "Thank you for raising this complaint and helping the administration."
    });

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden p-8 animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Update Status: {status}</h2>
                <p className="text-slate-500 mb-6 text-sm">Provide details or notes about the current state of this complaint.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Admin Note</label>
                        <textarea
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm h-32"
                            placeholder="Add a note for the student..."
                            value={data.resolutionNote}
                            onChange={(e) => setData({ ...data, resolutionNote: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Admin Feedback / Appreciation</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                            value={data.adminFeedback}
                            onChange={(e) => setData({ ...data, adminFeedback: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(data)}
                        className="flex-[2] px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition transform hover:-translate-y-0.5"
                    >
                        Confirm Status Change
                    </button>
                </div>
            </div>
        </div>
    );
}
