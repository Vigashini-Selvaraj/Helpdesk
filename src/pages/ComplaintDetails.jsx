import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    Send,
    Bot,
    User,
    Clock,
    CheckCircle2,
    ShieldCheck
} from "lucide-react";

export default function ComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/complaints/my/${JSON.parse(localStorage.getItem("user")).id || JSON.parse(localStorage.getItem("user"))._id}`);
            // Since API returns all, find the specific one. In real app, make a GET /:id endpoint.
            const found = res.data.find(c => c._id === id);
            setComplaint(found);
            generateAIHistory(found);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // THE "AI" LOGIC
    const generateAIHistory = (c) => {
        if (!c) return;
        const history = [];
        const user = JSON.parse(localStorage.getItem("user"));

        // 1. Initial Receipt
        history.push({
            sender: "AI",
            text: `👋 Hi ${user.name.split(" ")[0]}! I've received your complaint regarding "${c.title}".`,
            time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // 2. Timeline Estimation
        let estimate = "24-48 hours";
        if (c.urgency === "High") estimate = "2-4 hours (Priority Handling)";

        history.push({
            sender: "AI",
            text: `🕒 Based on the category (${c.type}), the estimated resolution time is ${estimate}.`,
            time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // 3. Priority Acknowledgement
        if (c.urgency === "High") {
            history.push({
                sender: "AI",
                text: `🚨 I see you marked this as HIGH Priority. I have instantly notified the Admin dashboard with a red alert tag.`,
                time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }

        // 4. Current Status Update
        if (c.status === "In Progress") {
            history.push({
                sender: "AI",
                text: `👷‍♂️ GOOD NEWS: An Admin has seen your ticket and marked it "In Progress". They are working on it right now.`,
                time: "Just now"
            });
        } else if (c.status === "Resolved") {
            history.push({
                sender: "AI",
                text: `✅ GREAT NEWS: Your issue has been marked as RESOLVED! Please check if everything is working fine now.`,
                time: "Just now"
            });
        } else {
            history.push({
                sender: "AI",
                text: `🧑‍💼 Your ticket is currently in the "Pending" queue. I will ping you as soon as an Admin opens it.`,
                time: "Just now"
            });
        }

        setMessages(history);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        // Add User Message
        const newMsg = { sender: "User", text: input, time: "Now" };
        setMessages(prev => [...prev, newMsg]);
        setInput("");

        // Fake AI Reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                sender: "AI",
                text: "I've noted that additional detail. The Admin will see it when they review your case.",
                time: "Now"
            }]);
        }, 1000);
    };

    if (loading) return <div className="p-10 text-center">Loading chat...</div>;
    if (!complaint) return <div className="p-10 text-center">Complaint not found</div>;

    return (
        <div className="flex h-screen bg-gray-100 justify-center items-center p-4">
            <div className="bg-white w-full max-w-md h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">

                {/* HEADER */}
                <div className="bg-primary-600 p-4 text-white flex items-center gap-3 shadow-md">
                    <button onClick={() => navigate(-1)} className="hover:bg-primary-500 p-2 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="font-bold flex items-center gap-2">
                            <Bot size={18} /> HelpDesk AI
                        </h2>
                        <p className="text-xs text-primary-200">
                            Ticket #{complaint._id.slice(-4).toUpperCase()} • {complaint.status}
                        </p>
                    </div>
                </div>

                {/* CHAT AREA */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${msg.sender === "User"
                                ? "bg-primary-600 text-white rounded-br-none"
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${msg.sender === "User" ? "text-primary-200" : "text-gray-400"}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* INPUT AREA */}
                <div className="p-4 bg-white border-t flex gap-2">
                    <input
                        className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 shadow-md transition"
                    >
                        <Send size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}
