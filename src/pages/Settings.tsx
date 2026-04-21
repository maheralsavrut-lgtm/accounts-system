import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, Bell, Lock, User, Globe, Shield, CreditCard, ChevronLeft } from "lucide-react";
import { Navigate } from "react-router-dom";

const SettingItem = ({ icon: Icon, title, desc, action }: { icon: any, title: string, desc: string, action?: string }) => (
  <div className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group cursor-pointer border-b border-white/5 last:border-0 border-r-2 border-transparent hover:border-royal-blue">
    <div className="text-gray-600 group-hover:text-royal-blue transition-colors">
      <ChevronLeft size={20} />
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
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center italic text-royal-blue">جاري التحميل...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 italic text-right">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[3rem] border border-white/5 overflow-hidden"
      >
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <h1 className="text-2xl font-black text-white italic flex items-center gap-3 justify-end">
            إعدادات الحساب الموحد <SettingsIcon className="text-royal-blue" size={28} />
          </h1>
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.4em] mt-2">Personal Management Center</p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-white/5">
          <SettingItem 
            icon={User} 
            title="المعلومات الشخصية" 
            desc="الاسم، البريد الإلكتروني، وصورة الملف الشخصي" 
          />
          <SettingItem 
            icon={Lock} 
            title="الأمان وكلمة المرور" 
            desc="تغيير كلمة السر، التحقق بخطوتين، والأجهزة النشطة" 
          />
           <SettingItem 
            icon={Shield} 
            title="توثيق الهوية" 
            desc="رفع المستندات الرسمية وتوثيق الحساب بالعلامة الزرقاء" 
          />
          <SettingItem 
            icon={Bell} 
            title="التنبيهات" 
            desc="إدارة إشعارات البريد وتنبيهات المنظومة" 
          />
          <SettingItem 
            icon={CreditCard} 
            title="المحفظة وطرق الشحن" 
            desc="إدارة البطاقات المسجلة وسجل عمليات Bx" 
          />
          <SettingItem 
            icon={Globe} 
            title="اللغة والمنطقة" 
            desc="تغيير لغة الواجهة وتوقيت المنطقة الزمنية" 
          />
        </div>

        <div className="p-8 bg-black/40 text-center border-t border-white/5">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest leading-loose">
            تطبق إعدادات الأمان هذه تلقائياً على جميع الدومينات الفرعية <br />
            (Verify, Wallet, AI Studio, ProductsBox)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
