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
    Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview"); // overview, complaints, students
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
    const [complaints, setComplaints] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        fetchData();
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
            alert("Complaint deleted");
            fetchData();
        } catch (err) {
            alert("Error deleting complaint");
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!confirm("Are you sure you want to remove this student? This action cannot be undone.")) return;
        try {
            await axios.delete(`${API_URL}/api/users/${id}`);
            alert("Student removed");
            fetchData();
        } catch (err) {
            alert("Error removing student");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`${API_URL}/api/complaints/${id}/status`, { status: newStatus });
            // Optimistic Update
            setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
            // Recalculate stats locally or refetch
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const filteredComplaints = filterStatus === "All"
        ? complaints
        : complaints.filter(c => c.status === filterStatus);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-primary-200 via-primary-100 to-white">
            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 flex items-center gap-2 mb-6">
                    <div className="bg-primary-500 p-2 rounded-lg">
                        <ShieldCheck size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem
                        icon={<LayoutDashboard size={18} />}
                        label="Overview"
                        active={activeTab === "overview"}
                        onClick={() => setActiveTab("overview")}
                    />
                    <NavItem
                        icon={<ClipboardList size={18} />}
                        label="Complaints"
                        active={activeTab === "complaints"}
                        onClick={() => setActiveTab("complaints")}
                    />
                    <NavItem
                        icon={<Users size={18} />}
                        label="Students"
                        active={activeTab === "students"}
                        onClick={() => setActiveTab("students")}
                    />
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={() => { localStorage.removeItem("user"); navigate("/login"); }}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-400 w-full px-4 py-2"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {activeTab === "overview" && "Dashboard Overview"}
                            {activeTab === "complaints" && "Manage Complaints"}
                            {activeTab === "students" && "Registered Students"}
                        </h2>
                        <p className="text-slate-500">Welcome back, Admin</p>
                    </div>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard title="Total Tickets" count={stats.total} icon={<ClipboardList />} color="bg-blue-500" />
                            <StatCard title="Pending" count={stats.pending} icon={<Clock />} color="bg-orange-500" />
                            <StatCard title="In Progress" count={stats.inProgress} icon={<AlertCircle />} color="bg-primary-500" />
                            <StatCard title="Resolved" count={stats.resolved} icon={<CheckCircle2 />} color="bg-green-500" />
                        </div>
                    </div>
                )}

                {/* COMPLAINTS TAB (or used in Overview) */}
                {(activeTab === "overview" || activeTab === "complaints") && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-8">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-lg text-slate-800">
                                {activeTab === "overview" ? "Recent Activity" : "All Complaints"}
                            </h3>

                            {/* FILTERS (Only in Complaints Tab) */}
                            {activeTab === "complaints" && (
                                <div className="flex items-center gap-2">
                                    <Filter size={16} className="text-gray-400" />
                                    <select
                                        className="border rounded-lg px-3 py-2 text-sm outline-none"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                                    <tr>
                                        <th className="px-6 py-4">ISSUE</th>
                                        <th className="px-6 py-4">STUDENT</th>
                                        <th className="px-6 py-4">CATEGORY</th>
                                        <th className="px-6 py-4">STATUS</th>
                                        <th className="px-6 py-4">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading data...</td></tr>
                                    ) : filteredComplaints.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-400">No complaints found.</td></tr>
                                    ) : (
                                        filteredComplaints.slice(0, activeTab === "overview" ? 5 : undefined).map((c) => (
                                            <tr key={c._id} className="hover:bg-slate-50 transition bg-white">
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-slate-900">{c.title}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-xs">{c.description}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-slate-700">{c.user?.name || "Unknown"}</p>
                                                    <p className="text-xs text-slate-400">{c.user?.email}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{c.type}</span>
                                                    {c.urgency === "High" && (
                                                        <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded border border-red-200">
                                                            HOT 🔥
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={c.status}
                                                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                                        className={`border rounded-lg px-2 py-1 text-xs font-medium outline-none ${c.status === "Pending" ? "text-red-600 border-red-200 bg-red-50" :
                                                            c.status === "In Progress" ? "text-orange-600 border-orange-200 bg-orange-50" :
                                                                "text-green-600 border-green-200 bg-green-50"
                                                            }`}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDeleteComplaint(c._id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                                        title="Delete Complaint"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* STUDENTS TAB */}
                {activeTab === "students" && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-gray-50/50">
                            <h3 className="font-bold text-lg text-slate-800">All Registered Students</h3>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">NAME</th>
                                    <th className="px-6 py-4">EMAIL</th>
                                    <th className="px-6 py-4">ROLE</th>
                                    <th className="px-6 py-4">JOINED</th>
                                    <th className="px-6 py-4">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50 transition bg-white">
                                        <td className="px-6 py-4 font-semibold text-slate-900">{u.name}</td>
                                        <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs border ${u.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                {u.role || "Student"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.role !== 'Admin' && (
                                                <button
                                                    onClick={() => handleDeleteStudent(u._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                                    title="Remove Student"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${active
                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </div>
    );
}

function StatCard({ title, count, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
            <div className={`${color} text-white p-3 rounded-lg shadow-sm`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{count}</p>
            </div>
        </div>
    );
}
