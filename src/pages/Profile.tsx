import React from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { 
  User, Wallet, Shield, Award, MapPin, 
  ExternalLink, CheckCircle2, AlertCircle, Clock, Activity,
  ChevronLeft, Info
} from "lucide-react";
import { Navigate, Link } from "react-router-dom";

interface ActivityRowProps {
  event: string;
  category: string;
  timestamp: any;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ event, category, timestamp }) => {
  const dateStr = timestamp?.toDate ? timestamp.toDate().toLocaleDateString('ar-EG') : '---';
  const timeStr = timestamp?.toDate ? timestamp.toDate().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '---';
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all group bg-white/[0.01]">
      <div className="flex flex-col items-end flex-1 px-4 order-4">
        <span className="text-white font-black italic text-xs">{event}</span>
      </div>
      <div className="w-24 text-right order-3">
        <span className="text-royal-blue text-[10px] font-bold uppercase tracking-widest">{category}</span>
      </div>
      <div className="w-24 text-right order-2">
        <span className="text-gray-500 text-[10px] font-bold">{dateStr}</span>
      </div>
      <div className="w-16 text-right order-1">
        <span className="text-gray-600 text-[10px] font-mono">{timeStr}</span>
      </div>
    </div>
  );
};

export default function Profile() {
  const { user, userData, loading, profileCompletion } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-royal-blue">جاري التحميل...</div>;
  if (!user) return <Navigate to="/login" />;

  const isVerified = userData?.verificationStatus === "verified";
  const isPendingVerification = userData?.verificationStatus === "pending";
  const isActive = userData?.accountStatus === "active";

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (profileCompletion / 100) * circumference;

  const activities = userData?.activities || [];
  const latestActivities = [...activities].sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative z-10" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[3rem] border border-white/5 text-center flex flex-col items-center shadow-2xl relative overflow-hidden"
          >
            {/* Completion Circle Background */}
            <div className="absolute top-4 left-4 group cursor-help">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                  <motion.circle 
                    cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" 
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-royal-blue" 
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-white italic">{profileCompletion}%</span>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 bg-royal-blue text-white text-[8px] font-black italic p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">نظام اكتمال الملف الشخصي</div>
            </div>

            <div className="relative group mb-6 mt-4">
              <div className="w-32 h-32 rounded-full border-2 border-royal-blue/30 p-1 flex items-center justify-center bg-royal-blue/5 overflow-hidden">
                {userData?.photoURL || user.photoURL ? (
                  <img src={userData?.photoURL || user.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User size={64} className="text-royal-blue/20" />
                )}
              </div>
              
              {/* Verified Badge with Tooltip */}
              {isVerified && (
                <div 
                  className="absolute bottom-1 right-1 bg-royal-blue text-white p-1.5 rounded-full border-2 border-[#0A0A0A] shadow-lg cursor-help group/v transition-transform hover:scale-110"
                >
                  <CheckCircle2 size={16} fill="white" className="text-royal-blue" />
                  <div className="absolute bottom-full right-0 mb-3 w-48 bg-[#0A0A0A] border border-white/10 text-white p-4 rounded-2xl opacity-0 group-hover/v:opacity-100 transition-all pointer-events-none shadow-2xl z-50 scale-95 group-hover/v:scale-100">
                     <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                        <Shield size={14} className="text-royal-blue" />
                        <span className="text-[10px] font-black italic uppercase tracking-widest text-royal-blue">Verified Unit</span>
                     </div>
                     <p className="text-[9px] font-bold text-gray-400 leading-relaxed text-right italic">
                        هذا الحساب تم توثيقه بربط الهوية الوطنية، مما يضمن مصداقية التعاملات والأصول الرقمية في المنظومة.
                     </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1 mb-8">
              <h2 className="text-2xl font-black text-white italic">{userData?.displayName || user.displayName || "مستخدم جديد"}</h2>
              <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{user.email}</p>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-white/[0.03] p-4 rounded-3xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mb-1">الرصيد الحالي</p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xl font-black text-royal-blue italic">{userData?.bx_balance || 0}</span>
                  <img src="/BX-Icon.png" style={{ width: '20px', height: '20px' }} className="object-contain" alt="BX" />
                </div>
              </div>
              <div className="bg-white/[0.03] p-4 rounded-3xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mb-1">الفئة</p>
                <span className="text-sm font-black text-white italic uppercase tracking-widest">{userData?.tier || "Free"}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass p-8 rounded-[3rem] border border-white/5 space-y-6 shadow-xl"
          >
            <div className="flex flex-col gap-4 text-right">
              <div className="flex items-center justify-between flex-row-reverse">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-royal-blue" />
                  <span className="text-white font-black italic">توثيق الهوية</span>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isVerified ? 'bg-royal-blue/20 text-royal-blue' : isPendingVerification ? 'bg-orange-500/20 text-orange-500' : 'bg-red-500/20 text-red-500'}`}>
                  {isVerified ? "موثق" : isPendingVerification ? "قيد المراجعة" : "غير موثق"}
                </span>
              </div>
              
              <div className="flex items-center justify-between flex-row-reverse border-t border-white/5 pt-4">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-royal-blue" />
                  <span className="text-white font-black italic">حالة الحساب</span>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isActive ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                  {isActive ? "نشط" : "معلق"}
                </span>
              </div>

              {!isActive && (
                <div className="bg-royal-blue/5 p-4 rounded-2xl border border-royal-blue/10 flex items-start gap-3 flex-row-reverse mt-2">
                  <AlertCircle size={14} className="text-royal-blue shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-400 font-bold leading-relaxed text-right italic">
                     يجب شحن المحفظة مرة واحدة على الأقل لتفعيل الحساب واستخدام الخدمات.
                  </p>
                </div>
              )}
              {isActive && (
                <div className="bg-green-500/5 p-4 rounded-2xl border border-green-500/10 flex items-start gap-3 flex-row-reverse mt-2">
                  <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-green-500/70 font-bold leading-relaxed text-right italic font-black">
                     هذا الحساب نشط ويمكنه استخدام كافة الخدمات.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Key Stats & Activity */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-3">
                <Clock className="text-royal-blue" size={24} />
                <h3 className="text-xl font-black text-white italic">التحليلات والنشاط</h3>
              </div>
              <Link to="/activities" className="text-[10px] font-black text-gray-500 hover:text-royal-blue transition-colors flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                 عرض السجل التفصيلي
                 <ChevronLeft size={14} />
              </Link>
            </div>
            
            <div className="bg-[#0A0A0A]">
              {/* Table Header */}
              <div className="flex items-center justify-between p-4 bg-white/[0.02] border-b border-white/5 text-right font-black italic text-[9px] uppercase tracking-widest text-gray-500">
                 <div className="flex-1 px-4 order-4">الحدث</div>
                 <div className="w-24 order-3">الفئة</div>
                 <div className="w-24 order-2">التاريخ</div>
                 <div className="w-16 order-1">الوقت</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/[0.02]">
                {latestActivities.length > 0 ? (
                  latestActivities.map((act: any, idx: number) => (
                    <ActivityRow 
                      key={idx}
                      event={act.action}
                      category={act.category}
                      timestamp={act.timestamp}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-600 italic font-bold">لا يوجد نشاط مسجل بعد</div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
             <div className="glass p-8 rounded-[3rem] border border-white/5 flex items-center gap-6 group hover:border-royal-blue/30 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-royal-blue/10 rounded-2xl flex items-center justify-center text-royal-blue group-hover:bg-royal-blue group-hover:text-white transition-all shadow-lg shadow-royal-blue/10">
                <Award size={28} />
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">كود الإحالة الخاص بي</p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-lg font-black text-white italic">{userData?.myReferralCode || "------"}</span>
                  <ExternalLink size={14} className="text-gray-600" />
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[3rem] border border-white/5 flex items-center gap-6 group hover:border-royal-blue/30 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-royal-blue/10 rounded-2xl flex items-center justify-center text-royal-blue group-hover:bg-royal-blue group-hover:text-white transition-all shadow-lg shadow-royal-blue/10">
                <MapPin size={28} />
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">المنطقة والبلد</p>
                <span className="text-lg font-black text-white italic">{userData?.region || "غير محدد"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
