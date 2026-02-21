import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    ShieldCheck,
    MessageSquare,
    BarChart3,
    Users,
    Eye,
    Lock,
    Zap,
    Building2
} from "lucide-react";

const Home = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null); // 'login', 'register', or null
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const openLogin = () => setActiveModal('login');
    const openRegister = () => setActiveModal('register');
    const closeModal = () => setActiveModal(null);

    // Fetch stats on component mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/stats`);
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const scrollToStats = () => {
        const statsSection = document.getElementById('stats-section');
        if (statsSection) {
            statsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary-600 font-bold text-2xl tracking-tight">
                        <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                            <ShieldCheck size={24} />
                        </div>
                        <span>Tracklyy</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#" className="hover:text-primary-600 transition-colors">Home</a>
                        <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
                        <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
                        <button onClick={openLogin} className="hover:text-primary-600 transition-colors">Log in</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={openRegister}
                            className="hidden sm:block bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
                        >
                            Get Account
                        </button>
                        <button
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <MessageSquare size={24} />
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DRAWER */}
                <div className={`md:hidden fixed inset-0 z-[100] transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className={`absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-10">
                                <span className="font-bold text-xl text-primary-600">Menu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-6 text-lg font-bold text-slate-800">
                                <a href="#" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
                                <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
                                <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                                <div className="h-px bg-slate-100 my-2"></div>
                                <button onClick={() => { setIsMobileMenuOpen(false); openLogin(); }} className="text-left text-primary-600">Log in</button>
                                <button onClick={() => { setIsMobileMenuOpen(false); openRegister(); }} className="bg-primary-600 text-white p-4 rounded-2xl text-center">Get Started</button>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-40 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-primary-50/80 to-white -z-10" />
                <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
                <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/4 -z-10" />

                <div className="max-w-7xl mx-auto px-6 text-center animate-fade-in-up">
                    <span className="inline-flex items-center gap-2 bg-white border border-primary-100 text-primary-600 px-5 py-2 rounded-full text-base font-semibold shadow-sm mb-10">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                        </span>
                        Live Student Support System
                    </span>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 mb-10 leading-[1.1]">
                        Resolve Campus Issues <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                            Faster & Transparently
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed">
                        Tracklyy connects students directly with administration. Submit grievances, track real-time progress, and ensure your voice is heard without the red tape.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={openRegister}
                            className="group bg-primary-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-primary-700 transition-all shadow-xl hover:shadow-primary-200 flex items-center gap-3"
                        >
                            Get Started Now
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-10 py-5 rounded-2xl text-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors border-2 border-transparent hover:border-slate-200">
                            View Live Stats
                        </button>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-12 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Issues Resolved", value: "2,500+", icon: CheckCircle2, color: "text-green-600" },
                            { label: "Avg. Response Time", value: "24 Hrs", icon: Clock, color: "text-blue-600" },
                            { label: "Active Students", value: "10k+", icon: Users, color: "text-primary-600" },
                            { label: "Admin Departments", value: "15+", icon: BarChart3, color: "text-purple-600" },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-4">
                                <stat.icon className={`mb-3 ${stat.color}`} size={32} />
                                <h4 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h4>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Tracklyy Works</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                            We've simplified the grievance process into three easy steps to ensure efficiency.
                        </p>
                    </div>

                    <div className="relative grid md:grid-cols-3 gap-10">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-primary-200 -z-0" />

                        {[
                            {
                                step: "01",
                                title: "Submit Complaint",
                                desc: "Fill out a simple form detailing your issue. Attach photos or documents if needed.",
                                icon: MessageSquare,
                            },
                            {
                                step: "02",
                                title: "Track Progress",
                                desc: "Get real-time updates as admins review and assign your complaint to the right team.",
                                icon: Clock,
                            },
                            {
                                step: "03",
                                title: "Get Resolution",
                                desc: "Receive a formal resolution report. Rate the service and close the ticket.",
                                icon: CheckCircle2,
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center group">
                                {/* Icon Circle */}
                                <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6 relative z-10 group-hover:bg-primary-600 group-hover:border-primary-200 transition-all duration-300">
                                    <item.icon className="text-primary-600 group-hover:text-white transition-colors duration-300" size={32} />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm">
                                        {item.step}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                            Everything you need to manage and resolve campus issues efficiently.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Real-Time Tracking",
                                desc: "Monitor your complaint status in real-time with instant notifications and updates.",
                                color: "bg-yellow-100 text-yellow-600"
                            },
                            {
                                icon: Eye,
                                title: "Full Transparency",
                                desc: "Complete visibility into the resolution process from submission to closure.",
                                color: "bg-blue-100 text-blue-600"
                            },
                            {
                                icon: MessageSquare,
                                title: "Direct Communication",
                                desc: "Chat directly with administrators and get quick responses to your queries.",
                                color: "bg-green-100 text-green-600"
                            },
                            {
                                icon: BarChart3,
                                title: "Analytics Dashboard",
                                desc: "View comprehensive statistics, trends, and insights about complaint resolution.",
                                color: "bg-purple-100 text-purple-600"
                            },
                            {
                                icon: Building2,
                                title: "Multi-Department Routing",
                                desc: "Automatically route complaints to the right department for faster resolution.",
                                color: "bg-orange-100 text-orange-600"
                            },
                            {
                                icon: Lock,
                                title: "Secure & Private",
                                desc: "Your data is encrypted and protected with industry-standard security measures.",
                                color: "bg-red-100 text-red-600"
                            }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MODALS */}
            {activeModal === 'login' && (
                <LoginModal onClose={closeModal} onSwitchToRegister={openRegister} />
            )}
            {activeModal === 'register' && (
                <RegisterModal onClose={closeModal} onSwitchToLogin={openLogin} />
            )}

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-400 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-800 pb-12 mb-12">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-2xl mb-4">
                                <ShieldCheck />
                                <span>Tracklyy</span>
                            </div>
                            <p className="max-w-xs">
                                Empowering students, enabling solutions. A smarter way to manage campus life.
                            </p>
                        </div>
                        <div className="flex gap-8 text-sm font-medium">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
                        </div>
                    </div>
                    <div className="text-center text-sm text-slate-600">
                        © 2024 Tracklyy Student Helpdesk System. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
