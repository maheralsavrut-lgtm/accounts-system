import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { 
  Settings as SettingsIcon, Bell, Lock, User, Globe, 
  Shield, CreditCard, ChevronLeft, ChevronRight,
  Camera, Save, AlertCircle, CheckCircle2, Wallet, ExternalLink
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile, updatePassword, signOut } from "firebase/auth";
import { db, auth } from "../lib/firebase";

type SettingsView = "main" | "profile" | "security" | "verification" | "region" | "notifications";

const SettingItem = ({ icon: Icon, title, desc, onClick, external }: { icon: any, title: string, desc: string, onClick?: () => void, external?: boolean }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group cursor-pointer border-b border-white/5 last:border-0 border-r-2 border-transparent hover:border-royal-blue bg-white/[0.01]"
  >
    <div className="text-gray-600 group-hover:text-royal-blue transition-colors">
      {external ? <ExternalLink size={18} /> : <ChevronLeft size={20} />}
    </div>
    <div className="flex-1 px-6 text-right">
      <h3 className="text-white font-black italic">{title}</h3>
      <p className="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{desc}</p>
    </div>
    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-royal-blue/10 group-hover:text-royal-blue transition-all">
      <Icon size={24} />
    </div>
  </div>
);

export default function Settings() {
  const { user, userData, loading } = useAuth();
  const [view, setView] = useState<SettingsView>("main");
  
  // Profile State
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  
  // Security State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Region State
  const [region, setRegion] = useState("مصر");
  
  // Status Messages
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || user?.displayName || "");
      setPhone(userData.phone || "");
      setPhotoURL(userData.photoURL || user?.photoURL || "");
      setRegion(userData.region || "مصر");
    }
  }, [userData, user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-royal-blue">جاري التحميل...</div>;
  if (!user) return <Navigate to="/login" />;

  const clearStatus = () => setTimeout(() => setStatus({ type: "", msg: "" }), 3000);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Auth Update
      await updateProfile(user, { displayName, photoURL });
      // Firestore Update
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
        phone,
        photoURL
      });
      setStatus({ type: "success", msg: "تم تحديث البيانات بنجاح" });
    } catch (err) {
      setStatus({ type: "error", msg: "حدث خطأ أثناء التحديث" });
    } finally {
      setIsUpdating(false);
      clearStatus();
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", msg: "كلمات السر غير متطابقة" });
      return;
    }
    setIsUpdating(true);
    try {
      await updatePassword(user, newPassword);
      setStatus({ type: "success", msg: "تم تغيير كلمة السر بنجاح" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        setStatus({ type: "error", msg: "يجب تسجيل الدخول مرة أخرى لتغيير كلمة السر" });
      } else {
        setStatus({ type: "error", msg: "حدث خطأ أثناء تغيير كلمة السر" });
      }
    } finally {
      setIsUpdating(false);
      clearStatus();
    }
  };

  const handleUpdateRegion = async (country: string) => {
    setRegion(country);
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { region: country });
      setStatus({ type: "success", msg: "تم تحديث المنطقة بنجاح" });
    } catch (err) {
      setStatus({ type: "error", msg: "حدث خطأ أثناء التحديث" });
    } finally {
      setIsUpdating(false);
      clearStatus();
    }
  };

  const renderContent = () => {
    switch (view) {
      case "profile":
        return (
          <motion.form 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={handleUpdateProfile}
            className="p-8 space-y-6"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-royal-blue/30 bg-white/5 flex items-center justify-center">
                  {photoURL ? (
                    <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-royal-blue/30" />
                  )}
                </div>
                <button type="button" className="absolute bottom-0 right-0 bg-royal-blue p-2 rounded-lg text-white shadow-lg">
                  <Camera size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">الاسم بالكامل</label>
                <input 
                  type="text" 
                  className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">رقم الهاتف</label>
                <input 
                  type="tel" 
                  className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">رابط الصورة (URL)</label>
                <input 
                  type="text" 
                  className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                />
              </div>
            </div>

            <button 
              disabled={isUpdating}
              className="w-full bg-royal-blue text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-royal-blue/20"
            >
              {isUpdating ? "جاري الحفظ..." : <><Save size={18} /> حفظ التعديلات</>}
            </button>
          </motion.form>
        );

      case "security":
        return (
          <motion.form 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={handleUpdatePassword}
            className="p-8 space-y-6"
          >
            <div className="bg-royal-blue/5 p-4 rounded-2xl border border-royal-blue/10 mb-6">
              <p className="text-[10px] font-bold text-royal-blue uppercase tracking-widest text-center">
                يجب أن تكون كلمة السر 8 أحرف على الأقل وتحتوي على أرقام ورموز
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">كلمة السر الجديدة</label>
                <input 
                  type="password" 
                  className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">تأكيد كلمة السر الجديدة</label>
                <input 
                  type="password" 
                  className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={isUpdating}
              className="w-full bg-royal-blue text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-royal-blue/20"
            >
               {isUpdating ? "جاري التحديث..." : <><Lock size={18} /> تحديث كلمة السر</>}
            </button>
          </motion.form>
        );

      case "verification":
        return (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="p-10 text-center space-y-8"
          >
            <div className="w-24 h-24 bg-royal-blue/10 rounded-full flex items-center justify-center mx-auto border border-royal-blue/20">
              <Shield size={48} className="text-royal-blue" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white italic">حالة التوثيق الرقمي</h2>
              <p className="text-gray-500 text-sm font-bold">
                {userData?.verified ? "حسابك موثق بالعلامة الزرقاء" : "لم يتم تقديم طلب توثيق بعد"}
              </p>
            </div>
            
            {userData?.verified ? (
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl text-green-500 flex items-center justify-center gap-2 font-bold italic">
                <CheckCircle2 size={18} /> تم التحقق من الهوية بنجاح
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-right">
                  <h4 className="text-white font-bold mb-4 italic">متطلبات التوثيق:</h4>
                  <ul className="space-y-2 text-[10px] text-gray-400 font-black uppercase tracking-wider">
                    <li className="flex items-center gap-2 flex-row-reverse">• صورة واضحة من بطاقة الهوية أو جواز السفر</li>
                    <li className="flex items-center gap-2 flex-row-reverse">• صورة شخصية حديثة (Selfie)</li>
                    <li className="flex items-center gap-2 flex-row-reverse">• رقم هاتف مؤكد</li>
                  </ul>
                </div>
                <button className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-royal-blue hover:text-white transition-all shadow-lg">
                  ابدأ عملية التوثيق الآن
                </button>
              </div>
            )}
          </motion.div>
        );

      case "region":
        return (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="p-8 space-y-6"
          >
            <div className="grid grid-cols-1 gap-4">
              {["مصر", "المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر", "منطقة أخرى"].map((country) => (
                <button 
                  key={country}
                  onClick={() => handleUpdateRegion(country)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${region === country ? 'bg-royal-blue/10 border-royal-blue text-white' : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20'}`}
                >
                  {region === country && <CheckCircle2 size={18} className="text-royal-blue" />}
                  <span className="font-black italic">{country}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return (
          <div className="grid grid-cols-1 divide-y divide-white/5">
            <SettingItem 
              icon={User} 
              title="المعلومات الشخصية" 
              desc="الاسم، الهاتف، وصورة الملف الشخصي" 
              onClick={() => setView("profile")}
            />
            <SettingItem 
              icon={Lock} 
              title="الأمان وكلمة المرور" 
              desc="تغيير كلمة السر وحماية الحساب" 
              onClick={() => setView("security")}
            />
             <SettingItem 
              icon={Shield} 
              title="توثيق الهوية" 
              desc="رفع المستندات والعلامة الزرقاء" 
              onClick={() => setView("verification")}
            />
             <SettingItem 
              icon={Globe} 
              title="المنطقة والبلد" 
              desc="تحديد المنطقة الزمنية والعملة المحلية" 
              onClick={() => setView("region")}
            />
            <SettingItem 
              icon={Wallet} 
              title="المحفظة وطرق الشحن" 
              desc="إدارة أرصدة Bx (في صفحة مستقلة)" 
              onClick={() => window.location.href = "https://wallet.bbtech.cloud"}
              external
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 italic text-right relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          {view !== "main" ? (
            <button 
              onClick={() => { setView("main"); setStatus({ type: "", msg: "" }); }}
              className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 font-black italic"
            >
              <ChevronRight size={20} /> العودة
            </button>
          ) : (
            <div />
          )}
          
          <div className="text-right">
            <h1 className="text-2xl font-black text-white italic flex items-center gap-3 justify-end leading-none">
              {view === "main" ? "إعدادات الحساب الموحد" : 
               view === "profile" ? "تعديل الملف الشخصي" :
               view === "security" ? "الأمان والحطاية" :
               view === "verification" ? "توثيق الحساب" :
               view === "region" ? "المنطقة والبلد" : "الإعدادات"} 
              <SettingsIcon className="text-royal-blue" size={28} />
            </h1>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.4em] mt-2">Unified Management Protocol</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status.msg && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className={`p-4 text-center text-xs font-black italic border-b border-white/5 ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
            >
              <div className="flex items-center justify-center gap-2">
                {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {status.msg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-h-[400px]">
          {renderContent()}
        </div>

        <div className="p-8 bg-black/40 text-center border-t border-white/5 mt-auto">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest leading-loose">
            تطبق إعدادات الأمان هذه تلقائياً على جميع الدومينات الفرعية <br />
            (Verify, Wallet, AI Studio, ProductsBox, Connect, Agency)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
