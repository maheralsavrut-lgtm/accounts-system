import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Mail, Lock, LogIn, Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { handleAuthRedirect, setSSOSession } from "../lib/auth-sso";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSuccess = async (user: any) => {
    const token = await user.getIdToken();
    setSSOSession(token);
    
    // Check if we need to redirect back to another subdomain
    const redirected = handleAuthRedirect();
    if (!redirected) {
      navigate("/profile");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await handleSuccess(res.user);
    } catch (err: any) {
      setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, { 
          uid: res.user.uid, 
          email: res.user.email, 
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
          myReferralCode: res.user.uid.slice(0, 6).toUpperCase(),
          bx_balance: 5, 
          tier: "Free", 
          createdAt: new Date() 
        });
      }
      
      await handleSuccess(res.user);
    } catch (err) {
      setErrorMsg("فشل الدخول عبر جوجل");
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
            <Shield size={28} />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">Black Box Accounts</h1>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mt-1">تسجيل الدخول</p>
        </div>

        <div className="space-y-5">
          <button 
            onClick={handleGoogle} 
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-royal-blue hover:text-white transition-all duration-300 group text-sm shadow-lg shadow-white/5 disabled:opacity-50"
          >
            <img src="/google.png" className="w-4 h-4 group-hover:brightness-0 group-hover:invert transition-all" alt="G" referrerPolicy="no-referrer" />
            المتابعة باستخدام Google
          </button>

          <div className="relative py-2 text-center text-[9px] uppercase">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative bg-[#0A0A0A] px-4 text-gray-600 font-black tracking-[0.2em]">أو البيانات الشخصية</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                required 
                className="w-full bg-white/[0.02] border border-white/10 p-4 pr-11 rounded-2xl focus:border-royal-blue/40 outline-none text-sm text-white transition-all text-right" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            </div>

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="كلمة السر" 
                required 
                className="w-full bg-white/[0.02] border border-white/10 p-4 pr-11 pl-11 rounded-2xl focus:border-royal-blue/40 outline-none text-sm text-white font-bold text-right" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold justify-center bg-red-500/5 py-2 rounded-xl border border-red-500/10">
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-royal-blue text-white font-black py-4 rounded-2xl hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-royal-blue/20 mt-4 disabled:opacity-50"
            >
              {loading ? "جاري المعالجة..." : "دخول"}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-white/5">
            <Link 
              to="/signup" 
              className="text-[11px] text-gray-500 hover:text-white hover:scale-105 transition-all duration-300 underline underline-offset-8 font-black block w-full uppercase tracking-tighter"
            >
              مستخدم جديد؟ انضم للمنظومة الآن
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
