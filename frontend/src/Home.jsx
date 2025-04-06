// src/Home.jsx
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function Home() {
  return (

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

  );
}

// Protected Route (checks for JWT token)
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// Landing Page (Home)
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Schedulify</h1>
      <p className="text-xl mb-8 max-w-md text-center">
        The ultimate scheduling app to organize your tasks, meetings, and events efficiently.
      </p>
      <div className="flex gap-4">
        <Link to="/login"
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Login
        </Link>
        <Link to="/register"
          className="bg-transparent border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}