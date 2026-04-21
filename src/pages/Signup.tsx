import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Mail, Lock, Shield, Eye, EyeOff, Phone, Ticket, CheckCircle2, UserPlus, User } from "lucide-react";
import { setSSOSession, handleAuthRedirect } from "../lib/auth-sso";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const isEmailMatch = email === confirmEmail;
  const isPassMatch = password === confirmPassword;
  
  const passwordStrength = useMemo(() => {
    if (!password) return { label: "", color: "bg-gray-800", width: "0%" };
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*]/.test(password);
    if (password.length >= 8 && hasLetters && hasNumbers && hasSymbols) return { label: "قوية", color: "bg-green-500", width: "100%" };
    if (password.length >= 6 && (hasLetters || hasNumbers)) return { label: "متوسطة", color: "bg-yellow-500", width: "60%" };
    return { label: "ضعيفة", color: "bg-red-500", width: "30%" };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailMatch) return setErrorMsg("البريد الإلكتروني غير متطابق");
    if (!isPassMatch) return setErrorMsg("كلمة السر غير متطابقة");
    if (password.length < 8) return setErrorMsg("كلمة السر يجب أن تكون 8 أحرف على الأقل");
    if (!agreedTerms || !agreedPrivacy) return setErrorMsg("برجاء الموافقة على الشروط والسياسات");

    setLoading(true);
    setErrorMsg("");
    try {
      let referrerDocId = null;
      let referrerBalance = 0;

      if (referralCode) {
        const q = query(collection(db, "users"), where("myReferralCode", "==", referralCode.toUpperCase()));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setLoading(false);
          return setErrorMsg("كود الدعوة غير صحيح");
        } else {
          referrerDocId = querySnapshot.docs[0].id;
          referrerBalance = querySnapshot.docs[0].data().bx_balance || 0;
        }
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Update Auth Profile
      await updateProfile(res.user, { displayName: username });

      if (referrerDocId) {
        await setDoc(doc(db, "users", referrerDocId), { 
          bx_balance: referrerBalance + 5 
        }, { merge: true });
      }

      const userId = res.user.uid;
      await setDoc(doc(db, "users", userId), {
        uid: userId,
        email,
        displayName: username,
        phone,
        usedReferralCode: referralCode ? referralCode.toUpperCase() : null,
        myReferralCode: userId.slice(0, 6).toUpperCase(),
        bx_balance: referrerDocId ? 10 : 5, 
        tier: "Free",
        createdAt: new Date()
      });

      const token = await res.user.getIdToken();
      setSSOSession(token);
      
      const redirected = handleAuthRedirect();
      if (!redirected) {
        navigate("/profile");
      }
    } catch (err: any) {
      setErrorMsg("حدث خطأ أثناء إنشاء الحساب، ربما البريد مستخدم بالفعل.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 font-sans italic text-right">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A0A0A] border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-royal-blue/10 rounded-2xl mb-4 border border-royal-blue/20 text-royal-blue">
            <UserPlus size={28} />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">انضم للمنظومة</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mt-1">إنشاء حساب جديد</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <input type="text" placeholder="الاسم بالكامل" required className="w-full bg-white/[0.02] border border-white/10 p-4 pr-11 rounded-2xl focus:border-royal-blue/40 outline-none text-sm text-white text-right" value={username} onChange={(e) => setUsername(e.target.value)} />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            </div>

            <div className="relative">
              <input type="email" placeholder="البريد الإلكتروني" required className="w-full bg-white/[0.02] border border-white/10 p-4 pr-11 rounded-2xl focus:border-royal-blue/40 outline-none text-sm text-white text-right" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            </div>

            <div className="relative">
              <input type="email" placeholder="تأكيد البريد الإلكتروني" required className={`w-full bg-white/[0.02] border ${!isEmailMatch && confirmEmail ? 'border-red-500/50' : 'border-white/10'} p-4 pr-11 rounded-2xl outline-none text-sm text-white text-right`} value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            </div>

            <div className="relative">
              <input type="tel" placeholder="رقم التليفون (اختياري)" className="w-full bg-white/[0.02] border border-white/10 p-4 pr-11 rounded-2xl focus:border-royal-blue/40 outline-none text-sm text-white text-right" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            </div>

            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="كلمة السر" required className="w-full bg-white/[0.02] border border-white/10 p-4 pr-11 pl-11 rounded-2xl focus:border-royal-blue/40 outline-none text-sm text-white font-bold text-right" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>

            <div className="px-1 text-right">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-1">
                <motion.div animate={{ width: passwordStrength.width }} className={`h-full ${passwordStrength.color} transition-all duration-500`} />
              </div>
              <span className={`text-[8px] font-black uppercase ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
            </div>

            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="تأكيد كلمة السر" required className={`w-full bg-white/[0.02] border ${!isPassMatch && confirmPassword ? 'border-red-500/50' : 'border-white/10'} p-4 pr-11 rounded-2xl outline-none text-sm text-white font-bold text-right`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            </div>

            <div className="relative">
              <input type="text" placeholder="كود الدعوة (اختياري)" className="w-full bg-white/[0.02] border border-white/10 p-4 pr-11 rounded-2xl focus:border-royal-blue/40 outline-none text-sm text-white text-right uppercase" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
              <Ticket className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            </div>
          </div>

          <div className="space-y-3 px-1 mt-6">
            <label className="flex items-center gap-3 cursor-pointer group w-fit flex-row-reverse ml-auto">
              <input type="checkbox" className="hidden" checked={agreedTerms} onChange={() => setAgreedTerms(!agreedTerms)} />
              <div className={`w-4 h-4 rounded border ${agreedTerms ? 'bg-royal-blue border-royal-blue' : 'border-white/10'} flex items-center justify-center transition-all`}>
                {agreedTerms && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <span className="text-[10px] text-gray-500 font-bold">أوافق على <Link to="/standards" className="text-royal-blue">شروط الاستخدام</Link></span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group w-fit flex-row-reverse ml-auto">
              <input type="checkbox" className="hidden" checked={agreedPrivacy} onChange={() => setAgreedPrivacy(!agreedPrivacy)} />
              <div className={`w-4 h-4 rounded border ${agreedPrivacy ? 'bg-royal-blue border-royal-blue' : 'border-white/10'} flex items-center justify-center transition-all`}>
                {agreedPrivacy && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <span className="text-[10px] text-gray-500 font-bold">أوافق على <Link to="/legal" className="text-royal-blue">سياسة الخصوصية</Link></span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-royal-blue text-white font-black py-4 rounded-2xl hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-royal-blue/20 mt-4 disabled:opacity-50">
            {loading ? "جاري المعالجة..." : "تأكيد وإنشاء الحساب"}
          </button>
        </form>

        {errorMsg && <div className="text-red-500 text-[10px] font-bold text-center mt-4 animate-pulse">{errorMsg}</div>}

        <div className="text-center pt-8 border-t border-white/5 mt-8">
          <Link to="/login" className="text-[11px] text-gray-500 hover:text-white font-black block w-full uppercase tracking-tighter underline underline-offset-8">
            لديك حساب بالفعل؟ سجل دخولك
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
