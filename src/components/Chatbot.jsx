import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import axios from "axios";
import API_URL from "../config/api";

export default function Chatbot({ role = "student" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: `Hi! I'm Jaz, your ${role === 'admin' ? 'Admin' : 'Student'} Assistant. I can help you with your schedule, meetings, or reminders. Try saying 'Remind me to call Mom'!`, sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Process Bot Response
        // We make this async to handle API calls
        await processBotResponse(input);
    };

    const processBotResponse = async (text) => {
        const lowerText = text.toLowerCase();
        let botResponseText = "";
        let botResponseElement = null;

        // --- REMINDERS LOGIC (Backend Integrated) ---
        if (lowerText.startsWith("remind me to ")) {
            const task = text.slice(13);
            if (user && user._id) {
                try {
                    await axios.post(`${API_URL}/api/reminders`, {
                        userId: user._id,
                        text: task
                    });
                    botResponseText = `Okay, I've added "${task}" to your reminders. 📝`;
                } catch (error) {
                    console.error("Error saving reminder", error);
                    botResponseText = "I couldn't save that reminder due to an error. 😓";
                }
            } else {
                botResponseText = "Please log in to save reminders.";
            }
        }
        else if (lowerText.includes("my reminders") || lowerText.includes("show reminders")) {
            if (user && user._id) {
                try {
                    const res = await axios.get(`${API_URL}/api/reminders/${user._id}`);
                    const reminders = res.data;
                    if (reminders.length === 0) {
                        botResponseText = "You have no pending reminders.";
                    } else {
                        botResponseElement = (
                            <div className="space-y-2">
                                <p className="font-bold">Your Reminders:</p>
                                <ul className="list-disc pl-4 text-sm space-y-1">
                                    {reminders.map((r) => <li key={r._id}>{r.text}</li>)}
                                </ul>
                            </div>
                        );
                    }
                } catch (error) {
                    console.error("Error fetching reminders", error);
                    botResponseText = "I couldn't fetch your reminders at the moment.";
                }
            } else {
                botResponseText = "Please log in to view reminders.";
            }
        }
        else if (lowerText.includes("clear reminders")) {
            if (user && user._id) {
                try {
                    await axios.delete(`${API_URL}/api/reminders/clear/${user._id}`);
                    botResponseText = "All reminders cleared! ✅";
                } catch (error) {
                    botResponseText = "Failed to clear reminders.";
                }
            } else {
                botResponseText = "Please log in to manage reminders.";
            }
        }

        // --- ADMIN ROLE LOGIC ---
        else if (role === 'admin') {
            if (lowerText.includes("schedule") || lowerText.includes("routine")) {
                botResponseElement = (
                    <div className="space-y-2">
                        <p className="font-bold">Faculty Schedule (Today):</p>
                        <ul className="list-disc pl-4 text-sm space-y-1">
                            <li>09:00 AM - Dept. HOD Meeting</li>
                            <li>11:30 AM - Review Complaint Dashboard</li>
                            <li>02:00 PM - Campus Inspection</li>
                        </ul>
                    </div>
                );
            }
            else if (lowerText.includes("meeting") || lowerText.includes("meet")) {
                botResponseText = "You have a staff meeting at 4 PM in the Conference Hall. 👔";
            }
            // Fallback for Admin
            else if (!botResponseText) {
                botResponseText = "I'm Jaz, your Admin Assistant. You can ask me to set reminders or check your schedule.";
            }
        }

        // --- STUDENT ROLE LOGIC (Default) ---
        else {
            if (lowerText.includes("schedule") || lowerText.includes("class") || lowerText.includes("routine")) {
                botResponseElement = (
                    <div className="space-y-2">
                        <p className="font-bold">Here is your schedule for today:</p>
                        <ul className="list-disc pl-4 text-sm space-y-1">
                            <li>09:00 AM - Data Structures (CS101)</li>
                            <li>11:00 AM - Web Development Lab</li>
                            <li>02:00 PM - Discrete Mathematics</li>
                        </ul>
                    </div>
                );
            }
            else if (lowerText.includes("meeting") || lowerText.includes("meet")) {
                botResponseElement = (
                    <div className="space-y-2">
                        <p className="font-bold">Upcoming Meetings:</p>
                        <ul className="list-disc pl-4 text-sm space-y-1">
                            <li>Today, 4:00 PM - Coding Club Sync</li>
                            <li>Tomorrow, 10:00 AM - Project Review with Prof. Smith</li>
                        </ul>
                    </div>
                );
            }
            else if (lowerText.includes("food") || lowerText.includes("lunch") || lowerText.includes("mess")) {
                botResponseText = "Today's lunch menu: Rajma Chawal, Curd, Salad, and Pickle. 🍛";
            }
            else if (lowerText.includes("exam") || lowerText.includes("test")) {
                botResponseText = "Mid-semester exams start from October 15th. Check the notice board for the detailed date sheet! 📅";
            }
            else if (lowerText.includes("wifi") || lowerText.includes("internet")) {
                botResponseText = "If you're facing WiFi issues, please try forgetting the network and reconnecting. If it persists, file a complaint in the 'Infrastructure' category.";
            }
            else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
                botResponseText = `Hello! I'm Jaz. How can I assist you today? 😊`;
            }
            // Fallback for Student
            else if (!botResponseText) {
                botResponseText = "I'm not sure about that. Try asking about 'schedule', 'meetings', or say 'Remind me to [task]'.";
            }
        }

        // Add response to chat
        const botMsg = {
            id: Date.now() + 1,
            text: botResponseElement || botResponseText,
            sender: "bot"
        };
        setMessages(prev => [...prev, botMsg]);
    };


    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* CHAT WINDOW */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col font-sans animate-in slide-in-from-bottom-10 fade-in duration-300 mb-4 h-[500px]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Jaz ({role === 'admin' ? 'Admin' : 'Student'} Assistant)</h3>
                                <div className="flex items-center gap-1.5 opacity-90">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-medium tracking-wide">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${msg.sender === "user"
                                    ? "bg-purple-600 text-white rounded-tr-none"
                                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full border border-transparent focus-within:border-purple-300 focus-within:bg-white focus-within:shadow-sm transition-all"
                        >
                            <input
                                type="text"
                                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 min-w-0"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:scale-105 active:scale-95"
                            >
                                <Send size={16} className="-ml-0.5 mt-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TOGGLE BUTTON */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center gap-3 animate-bounce-slow active:scale-95"
                >
                    <MessageCircle size={28} />
                    <span className="font-bold hidden md:block pr-2">Chat with Jaz</span>

                    {/* Notification Dot */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            )}
        </div>
    );
}
