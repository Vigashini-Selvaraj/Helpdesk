import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SelectPortal from "./pages/SelectPortal";
import StudentDashboard from "./pages/StudentDashboard";
import NewComplaint from "./pages/NewComplaint";

import MyHistory from "./pages/MyHistory";
import RecentComplaints from "./pages/RecentComplaints";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintDetails from "./pages/ComplaintDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/select-portal" element={<SelectPortal />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/new-complaint" element={<NewComplaint />} />
                <Route path="/history" element={<MyHistory />} />
                <Route path="/complaint/:id" element={<ComplaintDetails />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
