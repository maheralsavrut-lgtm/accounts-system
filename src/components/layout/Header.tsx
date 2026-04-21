import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, LogOut, Settings as SettingsIcon, Bell, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, userData, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = userData?.notifications?.filter((n: any) => !n.read).length || 0;

  return (
    <header className="fixed top-0 inset-x-0 z-[100] h-16 md:h-20 flex items-center justify-between px-6 md:px-12 bg-[#050505]/40 backdrop-blur-md border-b border-white/5" dir="rtl">
      {/* Account / Auth Status */}
      <div className="flex items-center gap-4 relative">
        {user ? (
          <div className="flex items-center gap-2">
             <Link to="/profile" className="flex items-center gap-2 group flex-row-reverse">
              <div className="relative">
                <div className="w-8 h-8 rounded-full border border-royal-blue/30 flex items-center justify-center bg-royal-blue/10 overflow-hidden">
                  {userData?.photoURL || user.photoURL ? (
                    <img src={userData?.photoURL || user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} className="text-royal-blue" />
                  )}
                </div>
                {userData?.verificationStatus === "verified" && (
                  <div className="absolute -bottom-1 -right-1 bg-royal-blue rounded-full p-0.5 border border-[#0A0A0A]">
                    <CheckCircle2 size={8} fill="white" className="text-royal-blue" />
                  </div>
                )}
              </div>
              <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors hidden md:block italic">
                {userData?.displayName || user.displayName || "مستخدم"}
              </span>
            </Link>

            <div className="h-6 w-px bg-white/10 hidden md:block mx-1" />

            <div className="flex items-center gap-1">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 transition-colors relative ${showNotifications ? 'text-royal-blue' : 'text-gray-500 hover:text-white'}`}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border border-[#0A0A0A]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-72 glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl overflow-y-auto max-h-96"
                    >
                      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <span className="text-[10px] font-black italic tracking-widest uppercase text-white leading-none">رسائل النظام</span>
                        <span className="text-[8px] font-bold text-gray-500">{unreadCount} غير مقروءة</span>
                      </div>
                      <div className="divide-y divide-white/[0.03]">
                        {userData?.notifications?.length > 0 ? (
                          userData.notifications.slice().reverse().map((notif: any) => (
                            <div key={notif.id} className={`p-4 text-right hover:bg-white/[0.01] transition-all cursor-pointer ${!notif.read ? 'border-r-2 border-royal-blue' : ''}`}>
                              <h4 className="text-xs font-black text-white italic mb-1">{notif.title}</h4>
                              <p className="text-[10px] text-gray-500 font-bold leading-relaxed">{notif.msg}</p>
                              <span className="text-[8px] text-gray-700 mt-2 block">{notif.date}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-600 italic text-[10px] font-bold">لا توجد رسائل جديدة</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
