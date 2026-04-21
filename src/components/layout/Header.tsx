import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, LogOut, Settings as SettingsIcon } from "lucide-react";

export default function Header() {
  const { user, userData, logout } = useAuth();

  return (
    <header className="absolute top-0 inset-x-0 z-50 h-16 md:h-20 flex items-center justify-between px-6 md:px-12 bg-transparent">
      {/* Account / Auth Status */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
             <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full border border-royal-blue/30 flex items-center justify-center bg-royal-blue/10 overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={16} className="text-royal-blue" />
                )}
              </div>
              <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors hidden md:block italic">
                {userData?.displayName || user.displayName || "مستخدم"}
              </span>
            </Link>
            <div className="h-6 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-2">
              <Link to="/settings" className="p-2 text-gray-500 hover:text-white transition-colors" title="الاعدادات">
                <SettingsIcon size={18} />
              </Link>
              <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 transition-colors" title="تسجيل الخروج">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
             <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
              دخول
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-royal-blue/20 border border-royal-blue/30 rounded-xl text-sm font-black text-white hover:bg-royal-blue transition-all uppercase tracking-tighter italic">
              انشاء حساب
            </Link>
          </div>
        )}
      </div>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 cursor-pointer group" dir="ltr">
        <motion.img 
          src="/favicon.png" 
          className="w-8 h-8 md:w-10 md:h-10 object-contain" 
          alt="Logo" 
          whileHover={{ rotateY: 360 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <div className="flex flex-col leading-none">
          <span className="text-lg md:text-xl font-black italic uppercase tracking-tighter text-white">Black Box</span>
          <span className="text-[8px] md:text-[9px] font-bold text-royal-blue tracking-[0.3em] uppercase">accounts</span>
        </div>
      </Link>
    </header>
  );
}
