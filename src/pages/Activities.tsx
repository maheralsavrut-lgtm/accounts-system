import React from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Clock, Shield, Globe, Smartphone, ChevronRight, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Activities() {
  const { user, userData, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-royal-blue">جاري التحميل...</div>;
  if (!user) return <Navigate to="/login" />;

  const activities = userData?.activities || [];
  const sortedActivities = [...activities].sort((a: any, b: any) => {
    const timeA = a.timestamp?.seconds || 0;
    const timeB = b.timestamp?.seconds || 0;
    return timeB - timeA;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 italic text-right relative z-10" dir="rtl">
      <div className="flex flex-row-reverse items-center justify-between mb-10">
        <div>
           <h1 className="text-3xl font-black text-white italic flex items-center gap-4 justify-end">
             سجل النشاطات والأمان
             <Activity className="text-royal-blue" size={32} />
           </h1>
           <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.4em] mt-2">Active Protocol Logs</p>
        </div>
      </div>

      <div className="space-y-6">
        {sortedActivities.length === 0 ? (
          <div className="glass p-12 rounded-[3rem] border border-white/5 text-center space-y-4">
             <Clock className="text-gray-700 mx-auto" size={48} />
             <p className="text-gray-500 font-black italic">لا يوجد نشاط مسجل حالياً</p>
          </div>
        ) : (
          sortedActivities.map((act: any, idx: number) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx}
              className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 group hover:border-royal-blue/30 transition-all hover:bg-white/[0.02]"
            >
              <div className="text-left font-mono text-[9px] text-gray-600 font-bold group-hover:text-royal-blue transition-colors">
                {act.timestamp?.toDate ? act.timestamp.toDate().toLocaleString('en-GB') : 'Unknown Time'}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 justify-end">
                   <span className="text-white font-black italic text-sm">{act.action}</span>
                   <div className="w-2 h-2 rounded-full bg-royal-blue shadow-[0_0_8px_rgba(61,127,242,0.6)]" />
                </div>
                <div className="flex items-center gap-4 justify-end">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{act.category || 'General'}</span>
                  {act.browser && (
                    <div className="flex items-center gap-1 text-[9px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-lg">
                       <Globe size={10} />
                       {act.browser}
                    </div>
                  )}
                  {act.os && (
                    <div className="flex items-center gap-1 text-[9px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-lg">
                       <Smartphone size={10} />
                       {act.os}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-royal-blue group-hover:text-white transition-all">
                {act.category === 'الأمان' ? <Shield size={20} /> : <Activity size={20} />}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-12 glass p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row-reverse items-center justify-between gap-6 overflow-hidden relative">
         <div className="relative z-10 text-right">
            <h3 className="text-lg font-black text-white italic mb-2">سلامة الحساب رقمية</h3>
            <p className="text-[10px] text-gray-500 font-bold leading-relaxed max-w-sm">
               تتم مراقبة جميع العمليات وتوثيقها وفقاً لمعايير الأمان الموحدة. يتم تسجيل المواقع الجغرافية والأجهزة لضمان عدم وصول أطراف غير مصرح لها.
            </p>
         </div>
         <div className="relative z-10 flex gap-4">
            <div className="flex flex-col items-center gap-1">
               <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                  <CheckCircle2 size={24} />
               </div>
               <span className="text-[8px] font-black text-green-500 uppercase">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-1">
               <div className="p-3 bg-royal-blue/10 rounded-2xl text-royal-blue">
                  <Globe size={24} />
               </div>
               <span className="text-[8px] font-black text-royal-blue uppercase">Global</span>
            </div>
         </div>
         <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-royal-blue/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
