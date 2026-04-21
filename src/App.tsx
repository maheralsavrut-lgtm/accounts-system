import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { motion } from "motion/react";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Legal from "./pages/Legal";
import Standards from "./pages/Standards";

function AppContent() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center flex-col gap-6" dir="rtl">
        <motion.img 
          src="/favicon.png" 
          className="w-16 h-16 object-contain" 
          alt="Loading..."
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <div className="flex flex-col items-center gap-2">
          <span className="text-royal-blue font-black italic tracking-widest text-sm uppercase">Black Box Accounts</span>
          <div className="h-0.5 w-32 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
               className="h-full bg-royal-blue"
               animate={{ x: [-128, 128] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-royal-blue font-sans relative overflow-x-hidden text-right" dir="rtl">
      
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/marketing-background.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/50 to-[#050505]" />
      </div>

      <Header />

      {/* Content */}
      <main className="relative z-10 pt-24 md:pt-32 min-h-[calc(100vh-80px)] text-right"> 
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/profile" : "/login"} />} />
          
          <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/profile" /> : <Signup />} />
          
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />

          {/* Ecosystem Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/standards" element={<Standards />} />

          {/* Compatibility Redirects */}
          <Route path="/:userID" element={<Navigate to="/profile" />} />
          <Route path="/:userID/Profile" element={<Navigate to="/profile" />} />
          <Route path="/:userID/Settings" element={<Navigate to="/settings" />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
