import { useState } from "react";
import {
    LayoutDashboard,
    PlusCircle,
    ClipboardList,
    LogOut,
    ShieldCheck,
    Wand2,
    BookOpen,
    Wifi,
    Home,
    MoreHorizontal,
    ArrowRight,
    Sparkles
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewComplaint() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [formData, setFormData] = useState({
        title: "",
        category: "Academic",
        description: "",
        urgency: "Medium"
    });

    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // FAKE AI LOGIC
    const handleAIAssist = () => {
        if (!formData.description) {
            alert("Please enter a description first so the AI can analyze it!");
            return;
        }
        setAiLoading(true);
        setTimeout(() => {
            const desc = formData.description.toLowerCase();
            let newTitle = "Issue Reported";
            let newCategory = "Other";
            let newUrgency = "Medium";

            if (desc.includes("wifi") || desc.includes("net") || desc.includes("slow")) {
                newTitle = "Network Connectivity Issue";
                newCategory = "Infrastructure";
                newUrgency = "High";
            } else if (desc.includes("food") || desc.includes("mess") || desc.includes("water")) {
                newTitle = "Hostel/Mess Quality Concern";
                newCategory = "Hostel";
                newUrgency = "High";
            } else if (desc.includes("grade") || desc.includes("exam") || desc.includes("class")) {
                newTitle = "Academic Query / Grading Issue";
                newCategory = "Academic";
            }

            setFormData(prev => ({
                ...prev,
                title: newTitle,
                category: newCategory,
                urgency: newUrgency
            }));
            setAiLoading(false);
        }, 1200); // Slightly longer for "effect"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("http://localhost:5000/api/complaints", {
                userId: user.id || user._id,
                title: formData.title,
                description: formData.description,
                type: formData.category,
                urgency: formData.urgency
            });

            // Simulate a smooth exit or success state if needed
            alert("Complaint submitted successfully! 🚀");
            navigate("/student");
        } catch (err) {
            console.error(err);
            alert("Failed to submit complaint. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-primary-200 via-primary-100 to-white font-sans">
            {/* SIDEBAR (Hidden on Mobile for focus) */}
            <aside className="w-20 lg:w-72 bg-white border-r py-8 flex flex-col hidden md:flex sticky top-0 h-screen transition-all duration-300">
                <div className="flex items-center gap-3 px-6 mb-12">
                    <div className="bg-primary-600 text-white p-2.5 rounded-xl shadow-lg shadow-primary-200">
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight hidden lg:block">HelpDesk+</h1>
                </div>

                <nav className="flex-1 space-y-3 px-4">
                    <div onClick={() => navigate("/student")} className="flex items-center gap-4 px-4 py-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl cursor-pointer transition-all duration-200">
                        <LayoutDashboard size={24} />
                        <span className="hidden lg:block font-medium">Dashboard</span>
                    </div>

                    <div className="flex items-center gap-4 px-4 py-4 bg-primary-50 text-primary-700 rounded-xl cursor-pointer shadow-sm ring-1 ring-primary-100">
                        <PlusCircle size={24} />
                        <span className="hidden lg:block font-bold">New Complaint</span>
                    </div>

                    <div onClick={() => navigate("/history")} className="flex items-center gap-4 px-4 py-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl cursor-pointer transition-all duration-200">
                        <ClipboardList size={24} />
                        <span className="hidden lg:block font-medium">My History</span>
                    </div>
                </nav>

                <div className="px-4 mt-auto">
                    <button onClick={() => { localStorage.removeItem("user"); navigate("/login"); }} className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition-colors px-4 py-3">
                        <LogOut size={24} />
                        <span className="hidden lg:block font-medium">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* BACK BUTTON (Mobile) */}
                <div className="md:hidden p-4 bg-white border-b flex items-center gap-2">
                    <button onClick={() => navigate("/student")} className="text-gray-500">
                        <ArrowRight className="rotate-180" />
                    </button>
                    <span className="font-bold text-gray-800">New Complaint</span>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT PANEL: BRANDING & INFO (Hidden on mobile) */}
                    <div className="hidden lg:flex flex-col justify-between w-2/5 bg-gradient-to-br from-slate-900 to-primary-900 text-white p-12 relative overflow-hidden">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-primary-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-700/50 text-primary-200 text-sm font-medium mb-8">
                                <Sparkles size={16} />
                                <span>AI-Powered Support</span>
                            </div>
                            <h2 className="text-5xl font-extrabold tracking-tight leading-tight mb-6">
                                We're Here to <br /> <span className="text-primary-400">Resolve It.</span>
                            </h2>
                            <p className="text-primary-200 text-lg max-w-md leading-relaxed">
                                Experiencing issues with campus facilities? Submit a ticket and our automated system will categorize, prioritize, and route it to the right team instantly.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="bg-primary-500/20 p-3 rounded-xl text-primary-300">
                                    <Wand2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold">Smart Auto-Fill</h4>
                                    <p className="text-primary-300 text-sm">Describe your issue and let AI set the title & category.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="bg-green-500/20 p-3 rounded-xl text-green-300">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold">Real-time Tracking</h4>
                                    <p className="text-primary-300 text-sm">Monitor status updates and estimates live.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: FORM */}
                    <div className="flex-1 bg-white overflow-y-auto w-full">
                        <div className="max-w-2xl mx-auto p-8 lg:p-16">
                            <div className="mb-10">
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">Submit a Ticket</h3>
                                <p className="text-gray-500">Please provide detailed information for faster resolution.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* 1. DESCRIPTION + AI */}
                                <div className="group">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-bold text-gray-700 tracking-wide">ISSUE DESCRIPTION</label>
                                        <button
                                            type="button"
                                            onClick={handleAIAssist}
                                            disabled={aiLoading}
                                            className={`
                                                flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all duration-300
                                                ${aiLoading ? "bg-gray-100 text-gray-400" : "bg-gradient-to-r from-violet-600 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-200 hover:scale-105"}
                                            `}
                                        >
                                            <Wand2 size={14} className={aiLoading ? "animate-spin" : ""} />
                                            {aiLoading ? "Analyzing..." : "Auto-Fill with AI"}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full p-6 border-2 border-gray-100 rounded-2xl h-40 resize-none focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all bg-gray-50 focus:bg-white text-gray-700 text-lg leading-relaxed placeholder-gray-400"
                                            placeholder="Example: The 2nd floor water cooler in Block A is making a loud noise and not cooling..."
                                            required
                                        />
                                        <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
                                            Min. 10 characters
                                        </div>
                                    </div>
                                </div>

                                {/* 2. CATEGORY SELECTION */}
                                <div>
                                    <label className="text-sm font-bold text-gray-700 tracking-wide mb-3 block">CATEGORY</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {["Academic", "Infrastructure", "Hostel", "Other"].map((cat) => (
                                            <div
                                                key={cat}
                                                onClick={() => setFormData({ ...formData, category: cat })}
                                                className={`
                                                    p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all duration-200
                                                    ${formData.category === cat
                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform scale-[1.02]"
                                                        : "border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                                                    }
                                                `}
                                            >
                                                <div className={`
                                                    p-2 rounded-lg 
                                                    ${formData.category === cat ? "bg-indigo-200 text-indigo-700" : "bg-gray-200 text-gray-500"}
                                                `}>
                                                    {cat === "Academic" && <BookOpen size={20} />}
                                                    {cat === "Infrastructure" && <Wifi size={20} />}
                                                    {cat === "Hostel" && <Home size={20} />}
                                                    {cat === "Other" && <MoreHorizontal size={20} />}
                                                </div>
                                                <span className="font-bold text-sm">{cat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. URGENCY & TITLE */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Urgency */}
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 tracking-wide mb-3 block">URGENCY LEVEL</label>
                                        <div className="flex flex-col gap-3">
                                            {["Low", "Medium", "High"].map((level) => (
                                                <label key={level} className="cursor-pointer relative group">
                                                    <input
                                                        type="radio"
                                                        name="urgency"
                                                        value={level}
                                                        checked={formData.urgency === level}
                                                        onChange={handleChange}
                                                        className="peer sr-only"
                                                    />
                                                    <div className={`
                                                        px-4 py-3 rounded-xl border border-transparent flex items-center justify-between text-sm font-bold transition-all duration-200
                                                        bg-gray-50 text-gray-500 hover:bg-gray-100
                                                        peer-checked:shadow-md peer-checked:transform peer-checked:scale-105
                                                        ${level === "Low" ? "peer-checked:bg-green-100 peer-checked:text-green-700 peer-checked:border-green-200" : ""}
                                                        ${level === "Medium" ? "peer-checked:bg-orange-100 peer-checked:text-orange-700 peer-checked:border-orange-200" : ""}
                                                        ${level === "High" ? "peer-checked:bg-red-100 peer-checked:text-red-700 peer-checked:border-red-200" : ""}
                                                    `}>
                                                        <span>{level} Priority</span>
                                                        <div className={`w-3 h-3 rounded-full 
                                                            ${level === "Low" ? "bg-green-500" : ""}
                                                            ${level === "Medium" ? "bg-orange-500" : ""}
                                                            ${level === "High" ? "bg-red-500" : ""}
                                                            opacity-20 peer-checked:opacity-100
                                                        `}></div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 tracking-wide mb-3 block">ISSUE TITLE</label>
                                        <div className="relative">
                                            <input
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-800 placeholder-gray-300"
                                                placeholder="Brief Summary"
                                                required
                                            />
                                            {formData.title && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 ml-1">Auto-generated by AI based on description.</p>
                                    </div>
                                </div>

                                {/* SUBMIT */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>Submitting...</>
                                        ) : (
                                            <>
                                                Submit Complaint
                                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Importing Clock/CheckCircle2 at the top in case they were missing in snippets, 
// but assuming they are available from 'lucide-react' based on previous files.
// Adding them to the import list above.
import { Clock, CheckCircle2 } from "lucide-react";
