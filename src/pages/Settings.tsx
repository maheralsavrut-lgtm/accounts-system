import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { 
  Settings as SettingsIcon, Bell, Lock, User, Globe, 
  Shield, CreditCard, ChevronLeft, ChevronRight,
  Camera, Save, AlertCircle, CheckCircle2, Wallet, ExternalLink,
  Upload, FileText, Smartphone, Info
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { doc, updateDoc, collection, query, where, getDocs, increment, arrayUnion } from "firebase/firestore";
import { updateProfile, updatePassword } from "firebase/auth";
import { db, auth as firebaseAuth } from "../lib/firebase";

type SettingsView = "main" | "profile" | "security" | "verification" | "region" | "kyc-form";

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
  const { user, userData, loading, logActivity, sendNotification } = useAuth();
  const [view, setView] = useState<SettingsView>("main");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile State
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  
  // Security State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Referral State
  const [inputReferral, setInputReferral] = useState("");
  const [referralClaimed, setReferralClaimed] = useState(false);

  // Region State
  const [region, setRegion] = useState("مصر");
  
  // KYC State
  const [kycType, setKycType] = useState<"id" | "passport" | null>(null);
  const [kycData, setKycData] = useState<any>({
    fullName: "", address: "", dob: "", nationalId: "",
    job: "", gender: "ذكر", religion: "", maritalStatus: "", expiry: "",
    passportNum: "", issueDate: "",
    agreed: false
  });

  // Status Messages
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || user?.displayName || "");
      setPhone(userData.phone || "");
      setPhotoURL(userData.photoURL || user?.photoURL || "");
      setRegion(userData.region || "مصر");
      setReferralClaimed(!!userData.usedReferralCode);
    }
  }, [userData, user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-royal-blue">جاري التحميل...</div>;
  if (!user) return <Navigate to="/login" />;

  const clearStatus = () => setTimeout(() => setStatus({ type: "", msg: "" }), 3000);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      if (user) {
        await updateProfile(user, { displayName, photoURL });
        await updateDoc(doc(db, "users", user.uid), { displayName, phone, photoURL });
        setStatus({ type: "success", msg: "تم تحديث البيانات بنجاح" });
        await logActivity("تحديث الملف الشخصي", "الحسابات");
      }
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
      setStatus({ type: "error", msg: "كلمتا السر غير متطابقتين" });
      return;
    }
    setIsUpdating(true);
    try {
      if (user) {
        await updatePassword(user, newPassword);
        setStatus({ type: "success", msg: "تم تحديث كلمة السر بنجاح" });
        await logActivity("تغيير كلمة السر", "الحسابات");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setStatus({ type: "error", msg: "يجب تسجيل الدخول مرة أخرى لتغيير كلمة السر" });
    } finally {
      setIsUpdating(false);
      clearStatus();
    }
  };

  const handleClaimReferral = async () => {
    if (!inputReferral || referralClaimed) return;
    setIsUpdating(true);
    try {
      const q = query(collection(db, "users"), where("myReferralCode", "==", inputReferral.toUpperCase()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setStatus({ type: "error", msg: "كود الإحالة غير موجود" });
      } else {
        const referrerId = snap.docs[0].id;
        if (referrerId === user.uid) {
          setStatus({ type: "error", msg: "لا يمكنك استخدام كود الإحالة الخاص بك" });
          return;
        }

        // Referee (Current User) update
        await updateDoc(doc(db, "users", user.uid), {
          bx_balance: increment(5),
          usedReferralCode: inputReferral.toUpperCase()
        });
        
        // Referrer update
        await updateDoc(doc(db, "users", referrerId), {
          bx_balance: increment(5)
        });

        setStatus({ type: "success", msg: "تم تفعيل كود الإحالة والحصول على 5 Bx" });
        await logActivity("الحصول على 5 BX هدية احالة", "المحفظة");
      }
    } catch (err) {
      setStatus({ type: "error", msg: "خطأ في المعالجة" });
    } finally {
      setIsUpdating(false);
      clearStatus();
    }
  };

  const handleSubmitKYC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycData.agreed) {
      setStatus({ type: "error", msg: "الرجاء الموافقة على الإقرار والاتفاقية" });
      return;
    }
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        verificationStatus: "pending",
        kycSubmissions: arrayUnion({
          type: kycType,
          data: kycData,
          submittedAt: new Date()
        })
      });
      await logActivity("تقديم طلب اثبات الهوية", "الحسابات");
      await sendNotification("طلب التوثيق", "تم استلام طلبك وجاري المراجعة من قبل فريقنا المختص.");
      setStatus({ type: "success", msg: "تم إرسال الطلب للمراجعة" });
      setView("main");
    } catch (err) {
      setStatus({ type: "error", msg: "خطأ في إرسال الطلب" });
    } finally {
      setIsUpdating(false);
      clearStatus();
    }
  };

  const handleImgClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload for demonstration
      setStatus({ type: "success", msg: "تم اختيار الصورة بنجاح" });
      clearStatus();
    }
  };

  const renderContent = () => {
    switch (view) {
      case "profile":
        return (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-8 space-y-10 text-right">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={handleImgClick}>
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-royal-blue/30 bg-white/5 flex items-center justify-center p-1">
                  {photoURL ? (
                    <img src={photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User size={40} className="text-royal-blue/30" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
              </div>
              <p className="mt-4 text-[10px] text-gray-500 font-black uppercase tracking-widest">تغيير الصورة الشخصية</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">الاسم بالكامل</label>
                  <input type="text" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">رقم الهاتف</label>
                  <input type="tel" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">رابط الصورة (URL)</label>
                  <input type="text" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
                </div>
              </div>
              <button disabled={isUpdating} className="w-full bg-royal-blue text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-royal-blue/20">
                {isUpdating ? "جاري الحفظ..." : <><Save size={18} /> حفظ بيانات الملف</>}
              </button>
            </form>

            <div className="pt-8 border-t border-white/5 space-y-4">
               <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 block">تفعيل كود الإحالة</label>
               <div className="flex gap-2 flex-row-reverse">
                  <input 
                    type="text" 
                    placeholder="أدخل كود الإحالة هنا" 
                    disabled={referralClaimed}
                    className="flex-1 bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right uppercase"
                    value={inputReferral}
                    onChange={(e) => setInputReferral(e.target.value)}
                  />
                  <button 
                    onClick={handleClaimReferral}
                    disabled={referralClaimed || isUpdating}
                    className="px-8 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black italic text-gray-400 hover:bg-royal-blue hover:text-white transition-all disabled:opacity-50"
                  >
                    {referralClaimed ? "تم التفعيل" : "تفعيل"}
                  </button>
               </div>
               {referralClaimed && <p className="text-[9px] text-royal-blue font-bold italic text-right">لقد استخدمت كود إحالة مسبقاً (تم إغلاق الخانة)</p>}
            </div>
          </motion.div>
        );

      case "verification":
        return (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-10 text-center space-y-8">
             <div className="w-24 h-24 bg-royal-blue/10 rounded-full flex items-center justify-center mx-auto border border-royal-blue/20 relative">
               <Shield size={48} className="text-royal-blue" />
               {userData?.verificationStatus === "verified" && (
                <div className="absolute -bottom-1 -right-1 bg-royal-blue rounded-full p-2 border-2 border-[#0A0A0A]">
                  <CheckCircle2 size={16} fill="white" className="text-royal-blue" />
                </div>
               )}
             </div>
             <div className="space-y-2">
               <h2 className="text-xl font-black text-white italic">توثيق الهوية الرقمية</h2>
               <p className="text-gray-500 text-sm font-bold uppercase tracking-widest italic">
                 {userData?.verificationStatus === "verified" ? "هذا الحساب موثق بالعلامة الزرقاء" : 
                  userData?.verificationStatus === "pending" ? "طلبك قيد المراجعة حالياً" : "حسابك غير موثق حالياً"}
               </p>
             </div>
             
             {userData?.verificationStatus === "verified" ? (
               <div className="bg-royal-blue/5 border border-royal-blue/10 p-6 rounded-3xl text-royal-blue font-black italic">
                 تم التحقق من هوية هذا المستخدم وتفعيل كافة خدمات المنظومة.
               </div>
             ) : userData?.verificationStatus === "pending" ? (
               <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-3xl text-orange-500 font-black italic">
                 لقد استلمنا بياناتك. يتم التحقق من صحة المستندات وسوف نرسل لك إشعاراً بالنتيجة قريباً.
               </div>
             ) : (
               <button 
                 onClick={() => setView("kyc-form")}
                 className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-royal-blue hover:text-white transition-all shadow-lg text-sm"
               >
                 ابدأ عملية التوثيق الآن
               </button>
             )}
          </motion.div>
        );

      case "kyc-form":
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 space-y-8 text-right">
             {!kycType ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <button 
                    onClick={() => setKycType("id")}
                    className="p-10 bg-white/[0.02] border-2 border-white/5 rounded-[2.5rem] hover:border-royal-blue/30 transition-all group flex flex-col items-center gap-4"
                  >
                    <Smartphone size={40} className="text-gray-600 group-hover:text-royal-blue transition-colors" />
                    <span className="text-white font-black italic uppercase tracking-tighter">بطاقة الهوية الوطنية</span>
                  </button>
                  <button 
                    onClick={() => setKycType("passport")}
                    className="p-10 bg-white/[0.02] border-2 border-white/5 rounded-[2.5rem] hover:border-royal-blue/30 transition-all group flex flex-col items-center gap-4"
                  >
                    <Globe size={40} className="text-gray-600 group-hover:text-royal-blue transition-colors" />
                    <span className="text-white font-black italic uppercase tracking-tighter">جواز سفر دولي</span>
                  </button>
               </div>
             ) : (
               <form onSubmit={handleSubmitKYC} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans italic">
                  <div className="bg-royal-blue/5 p-4 rounded-2xl border border-royal-blue/10 flex items-center justify-between flex-row-reverse shadow-lg">
                    <span className="text-[10px] font-black text-royal-blue uppercase tracking-[0.2em] italic">بروتوكول توثيق {kycType === 'id' ? 'الهوية' : 'الجواز'}</span>
                    <button type="button" onClick={() => setKycType(null)} className="text-gray-500 hover:text-white text-[9px] font-bold">تغيير النوع</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Common Fields */}
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">الاسم الكامل (كما هو بالمستند)</label>
                       <input required type="text" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right" value={kycData.fullName} onChange={(e) => setKycData({...kycData, fullName: e.target.value})} />
                    </div>

                    {kycType === 'id' ? (
                      <>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">العنوان بالكامل</label>
                           <input required type="text" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right" value={kycData.address} onChange={(e) => setKycData({...kycData, address: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">تاريخ الميلاد</label>
                           <input required type="date" className="w-full bg-white/[0.01] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm" value={kycData.dob} onChange={(e) => setKycData({...kycData, dob: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">الرقم القومي</label>
                           <input required type="text" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right font-mono" value={kycData.nationalId} onChange={(e) => setKycData({...kycData, nationalId: e.target.value})} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">رقم الجواز</label>
                           <input required type="text" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right font-mono uppercase" value={kycData.passportNum} onChange={(e) => setKycData({...kycData, passportNum: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">تاريخ الإصدار</label>
                           <input required type="date" className="w-full bg-white/[0.01] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm" value={kycData.issueDate} onChange={(e) => setKycData({...kycData, issueDate: e.target.value})} />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">المؤهل / الوظيفة</label>
                       <input required type="text" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right" value={kycData.job} onChange={(e) => setKycData({...kycData, job: e.target.value})} />
                    </div>
                    <div className="space-y-2 flex flex-col">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">النوع</label>
                       <select className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm appearance-none cursor-pointer" value={kycData.gender} onChange={(e) => setKycData({...kycData, gender: e.target.value})}>
                          <option value="ذکر">ذكر</option>
                          <option value="انثی">أنثى</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">الديانة</label>
                       <input required type="text" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right" value={kycData.religion} onChange={(e) => setKycData({...kycData, religion: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">الحالة الاجتماعية</label>
                       <input required type="text" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right" value={kycData.maritalStatus} onChange={(e) => setKycData({...kycData, maritalStatus: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">تاريخ انتهاء المستند</label>
                       <input required type="date" className="w-full bg-white/[0.01] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm" value={kycData.expiry} onChange={(e) => setKycData({...kycData, expiry: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold text-gray-500 mr-2 italic">رقم الهاتف للتوثيق</label>
                       <input required type="tel" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right" value={phone} disabled />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                    <div className="space-y-4">
                       <h4 className="text-white font-black italic text-xs uppercase tracking-widest px-2">وجه البطاقة / صورة الجواز</h4>
                       <div className="aspect-video bg-white/[0.02] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:border-royal-blue/30 transition-all cursor-pointer overflow-hidden p-2">
                          <Upload className="text-gray-600 mb-2 group-hover:text-royal-blue transition-colors" size={32} />
                          <span className="text-[9px] font-bold text-gray-500">اضغط لرفع الملف (PNG, JPG)</span>
                          <p className="text-[8px] text-gray-600 px-8 text-center leading-relaxed font-bold">تأكد من أن جميع البيانات واضحة وضوء الغرفة كافٍ</p>
                       </div>
                    </div>
                    {kycType === 'id' && (
                      <div className="space-y-4">
                        <h4 className="text-white font-black italic text-xs uppercase tracking-widest px-2">ظهر البطاقة الوطنية</h4>
                        <div className="aspect-video bg-white/[0.02] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:border-royal-blue/30 transition-all cursor-pointer overflow-hidden p-2">
                            <Upload className="text-gray-600 mb-2 group-hover:text-royal-blue transition-colors" size={32} />
                            <span className="text-[9px] font-bold text-gray-500">اضغط لرفع الملف (PNG, JPG)</span>
                        </div>
                      </div>
                    )}
                    <div className="md:col-span-2 space-y-4">
                       <h4 className="text-white font-black italic text-xs uppercase tracking-widest px-2 text-center">صورة سيلفي حديثة للوجه</h4>
                       <div className="w-32 h-32 mx-auto bg-white/[0.02] border-2 border-dashed border-white/10 rounded-full flex flex-col items-center justify-center gap-2 group hover:border-royal-blue/30 transition-all cursor-pointer overflow-hidden p-2 text-center">
                          <Camera className="text-gray-600 group-hover:text-royal-blue transition-colors" size={24} />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div className="bg-white/[0.01] border border-white/5 p-6 rounded-3xl overflow-y-auto max-h-40 space-y-4 scrollbar-thin">
                       <h5 className="text-white font-black italic text-xs">اتفاقية توثيق الهوية وإقرار بصحة البيانات</h5>
                       <p className="text-[10px] text-gray-500 font-bold leading-relaxed text-right">
                         أقر أنا بمحض إرادتي وبصفتي الشخصية بصحة كافة البيانات والمستندات المذكورة أعلاه، وأتحمل كامل المسؤولية المدنية والجنائية في حال ثبت عدم صحتها أو تزويرها. كما أوافق على شروط سياسة الخصوصية الخاصة بـ Black Box Technology بشأن معالجة هذه البيانات لأغراض التحقق الرقمي فقط وعدم مشاركتها مع أي أطراف ثالثة خارج المنظومة.
                       </p>
                    </div>

                    <label className="flex items-center gap-4 cursor-pointer group flex-row-reverse w-fit mr-auto py-2">
                       <input type="checkbox" className="hidden" checked={kycData.agreed} onChange={() => setKycData({...kycData, agreed: !kycData.agreed})} />
                       <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${kycData.agreed ? 'bg-royal-blue border-royal-blue shadow-lg shadow-royal-blue/20' : 'border-white/10 bg-white/5'}`}>
                          {kycData.agreed && <CheckCircle2 size={16} className="text-white" />}
                       </div>
                       <span className="text-[11px] text-white font-black italic select-none">أوافق على كافة البنود والإقرار الوارد أعلاه</span>
                    </label>
                  </div>

                  <button 
                    disabled={isUpdating || !kycData.agreed}
                    className="w-full bg-royal-blue text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-2xl shadow-royal-blue/20 mt-8 disabled:opacity-50"
                   >
                    {isUpdating ? "جاري المعالجة..." : <><Save size={20} /> إرسال طلب التوثيق للمراجعة</>}
                  </button>
               </form>
             )}
          </motion.div>
        );

      case "security":
        return (
          <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleUpdatePassword} className="p-8 space-y-6 text-right">
            <div className="bg-royal-blue/5 p-4 rounded-2xl border border-royal-blue/10 mb-6 flex flex-col items-center">
              <Info className="text-royal-blue mb-2" size={20} />
              <p className="text-[10px] font-bold text-royal-blue uppercase tracking-widest text-center italic">يجب أن تكون كلمة السر 8 أحرف على الأقل وتحتوي على أرقام ورموز خاصة</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">كلمة السر الجديدة</label>
                <input required type="password" placeholder="••••••••" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right font-black" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 mr-2">تأكيد كلمة السر الجديدة</label>
                <input required type="password" placeholder="••••••••" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-2xl focus:border-royal-blue outline-none text-white text-sm text-right font-black" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            <button disabled={isUpdating} className="w-full bg-royal-blue text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-royal-blue/20">
               {isUpdating ? "جاري التحديث..." : <><Lock size={18} /> تحديث كلمة السر</>}
            </button>
          </motion.form>
        );

      case "region":
        return (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-8 space-y-6 text-right">
            <div className="grid grid-cols-1 gap-4">
              {["مصر", "المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر", "منطقة أخرى"].map((country) => (
                <button 
                  key={country}
                  onClick={() => handleUpdateRegion(country)}
                  className={`flex flex-row-reverse items-center justify-between p-5 rounded-2xl border transition-all ${region === country ? 'bg-royal-blue/10 border-royal-blue text-white' : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20'}`}
                >
                  <span className="font-black italic">{country}</span>
                  {region === country && <CheckCircle2 size={18} className="text-royal-blue" />}
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return (
          <div className="grid grid-cols-1 divide-y divide-white/5">
            <SettingItem icon={User} title="تعديل الملف الشخصي" desc="تعديل البيانات الأساسية واستخدام كود الإحالة" onClick={() => setView("profile")} />
            <SettingItem icon={Lock} title="الأمان والحماية" desc="تغيير كلمة السر وبروتوكولات حماية الحساب" onClick={() => setView("security")} />
            <SettingItem icon={Shield} title="توثيق الشخصية الرقمية" desc="رفع المستندات الرسمية للحصول على العلامة الزرقاء" onClick={() => setView("verification")} />
            <SettingItem icon={Globe} title="المنطقة والرموز المحلية" desc="تحديد العملة ونطاق التوقيت الخاص بالمستخدم" onClick={() => setView("region")} />
            <SettingItem icon={Wallet} title="المحفظة والعملات الرقمية" desc="إدارة الأرصدة البنكية وعمليات شحن Bx" onClick={() => window.location.href = "https://wallet.bbtech.cloud"} external />
          </div>
        );
    }
  };

  const handleUpdateRegion = async (country: string) => {
    setRegion(country);
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { region: country });
      setStatus({ type: "success", msg: "تم تحديث المنطقة بنجاح" });
      await logActivity(`تحديث المنطقة: ${country}`, "الحسابات");
    } catch (err) {
      setStatus({ type: "error", msg: "حدث خطأ أثناء التحديث" });
    } finally {
      setIsUpdating(false);
      clearStatus();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 italic text-right relative z-10" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative">
        
        {/* Progress bar for isUpdating */}
        {isUpdating && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            className="absolute top-0 right-0 h-1 bg-royal-blue z-50 shadow-[0_0_10px_rgba(61,127,242,0.8)]"
          />
        )}

        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex flex-row-reverse items-center justify-between">
          <div className="text-right">
            <h1 className="text-2xl font-black text-white italic flex items-center gap-3 justify-end leading-none">
              {view === "main" ? "إعدادات الحساب الموحد" : 
               view === "profile" ? "الملف الشخصي" :
               view === "security" ? "الأمان والحماية" :
               view === "verification" ? "توثيق الحساب" :
               view === "kyc-form" ? "بروتوكول التوثيق" : "المنطقة والرموز"} 
              <SettingsIcon className="text-royal-blue" size={28} />
            </h1>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.4em] mt-2 leading-none">Unified Management Protocol</p>
          </div>

          {view !== "main" && (
            <button onClick={() => { setView("main"); setStatus({ type: "", msg: "" }); setKycType(null); }} className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 font-black italic bg-white/5 px-5 py-2 rounded-2xl hover:bg-royal-blue/10">
              العودة <ChevronLeft size={20} />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {status.msg && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`p-4 text-center text-[10px] font-black italic border-b border-white/5 ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
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

        <div className="p-8 bg-[#0A0A0A]/80 text-center border-t border-white/5 mt-auto">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest leading-loose">
            تطبق إعدادات الأمان هذه تلقائياً على جميع الدومينات الفرعية <br />
            (Verify, Wallet, AI Studio, ProductsBox)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
