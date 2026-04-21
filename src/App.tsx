import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Legal from "./pages/Legal";
import Standards from "./pages/Standards";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#050505] text-white selection:bg-royal-blue font-sans relative overflow-x-hidden" dir="rtl">
          
          {/* Background Layer */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/marketing-background.png')" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/50 to-[#050505]" />
          </div>

          <Header />

          {/* Content */}
          <main className="relative z-10 pt-24 md:pt-32 min-h-[calc(100vh-80px)]"> 
            <Routes>
              <Route path="/" element={<Navigate to="/profile" />} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

              {/* Ecosystem Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/standards" element={<Standards />} />

              {/* UserID Compatibility Routes (Redirect to profile for now) */}
              <Route path="/:userID" element={<Navigate to="/profile" />} />
              <Route path="/:userID/Profile" element={<Navigate to="/profile" />} />
              <Route path="/:userID/Settings" element={<Navigate to="/settings" />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/profile" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
