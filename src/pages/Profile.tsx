import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { User, Wallet, ShieldCheck, Calendar, Hash, Award, Star, TrendingUp } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { user, userData, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-royal-blue">جاري التحميل...</div>;
  if (!user) return <Navigate to="/login" />;

  const stats = [
    { label: "رصيد Bx", value: userData?.bx_balance || 0, icon: <Wallet size={20} />, color: "text-amber-400" },
    { label: "الفئة", value: userData?.tier || "Free", icon: <Award size={20} />, color: "text-purple-400" },
    { label: "كود الدعوة", value: userData?.myReferralCode || "---", icon: <Hash size={20} />, color: "text-royal-blue" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 italic text-right">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-royal-blue/10 blur-[100px] rounded-full" />
        
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 mb-12 border-b border-white/5 pb-12">
          <div className="w-32 h-32 rounded-full border-4 border-royal-blue/20 p-1 relative">
            <div className="w-full h-full rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-royal-blue/40" />
              )}
            </div>
            {userData?.tier === "Pro" && (
              <div className="absolute -bottom-2 -right-2 bg-royal-blue text-white p-1.5 rounded-lg shadow-lg">
                <Star size={18} fill="currentColor" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              {userData?.displayName || user.email?.split('@')[0]}
            </h1>
            <p className="text-gray-500 font-bold text-sm tracking-widest">{user.email}</p>
            <div className="flex items-center gap-4 mt-4 justify-end">
              <span className="px-3 py-1 bg-royal-blue/10 border border-royal-blue/20 rounded-full text-[10px] font-black text-royal-blue uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} /> توثيق الهوية: {userData?.verified ? "مكتمل" : "قيد المراجعة"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-royal-blue/30 transition-all group"
            >
              <div className={`${stat.color} mb-3 group-hover:scale-110 transition-transform w-fit ml-auto`}>
                {stat.icon}
              </div>
              <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white italic">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-black text-white italic border-r-4 border-royal-blue pr-4">التحليلات والنشاط</h2>
          <div className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 text-center">
            <TrendingUp size={48} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-500 font-bold italic">لا يوجد نشاط مسجل مؤخراً في المنظومة.</p>
            <button className="mt-6 px-6 py-2 bg-royal-blue/10 hover:bg-royal-blue/20 text-royal-blue rounded-xl text-xs font-black transition-all">اكتشف الخدمات المتاحة</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
