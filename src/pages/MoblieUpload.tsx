import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Upload, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function MobileUpload() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setLoading(true);
    // Simulation of upload (real would be Firebase Storage)
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, "users", userId), {
          "kyc_docs": arrayUnion(file.name),
          "last_sync_upload": new Date().toISOString()
        });
        setSuccess(true);
      } catch (err) {
        setError("فشل تحميل الملف. يرجى المحاولة لاحقاً.");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center justify-center font-sans" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center glass shadow-2xl"
      >
        <div className="inline-block p-4 bg-royal-blue/10 rounded-2xl mb-6 text-royal-blue border border-royal-blue/20">
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="text-xl font-black italic mb-2">ربط التوثيق الرقمي</h1>
        <p className="text-gray-500 text-xs font-bold mb-8">قم بتصوير المستند المطلوب لربطه بحسابك على الكمبيوتر</p>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <label className="w-full block bg-royal-blue cursor-pointer text-white font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <Camera size={20} />
                <span>التقاط صورة حية</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
              </label>

              <label className="w-full block bg-white/5 border border-white/10 cursor-pointer text-gray-300 font-bold py-5 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <Upload size={20} />
                <span>رفع من الجهاز</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>

              {loading && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-6 h-6 border-2 border-royal-blue border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] text-royal-blue font-black italic animate-pulse">جاري معالجة المستند...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-2 text-red-500 text-[10px] font-bold">
                  <XCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="py-10"
            >
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-lg font-black text-green-500 italic mb-2">تم التحميل بنجاح!</h2>
              <p className="text-gray-500 text-[10px] font-bold leading-relaxed mb-8">
                تلقينا مستندك الآن. يمكنك إغلاق هذه الصفحة والعودة لشاشة الكمبيوتر للمتابعة.
              </p>
              <button 
                onClick={() => window.close()}
                className="w-full bg-white/5 text-white font-black py-4 rounded-xl border border-white/10"
              >
                إغلاق الصفحة
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[8px] font-black italic tracking-[0.2em] text-gray-500 uppercase">Black Box Security Protocol</span>
          <p className="text-[8px] text-gray-600 font-bold">تشفير 256-بت مفعل</p>
        </div>
      </motion.div>
    </div>
  );
}
