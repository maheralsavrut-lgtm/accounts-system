import { motion } from "motion/react";
import { Gavel, ShieldCheck, Coins, Zap, AlertTriangle, History, MailCheck, Code2 } from "lucide-react";
import React, { useState } from "react";

const TermsSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-b border-white/5 overflow-hidden transition-all bg-white/[0.01] mb-4 rounded-2xl border border-white/5 backdrop-blur-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors text-right"
      >
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-gray-500 text-xs">▼</motion.span>
        <div className="flex items-center gap-4 text-white flex-row-reverse grow">
          <Icon className="text-royal-blue" size={24} />
          <span className="font-black text-xl italic uppercase tracking-tighter">{title}</span>
        </div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-8 text-gray-400 text-sm leading-relaxed font-bold italic space-y-6 text-right dir-rtl border-t border-white/5">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default function Standards() {
  return (
    <div className="min-h-screen pt-16 pb-24 px-6 bg-transparent text-white">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-5 bg-royal-blue/10 rounded-full mb-8 border border-royal-blue/20"
          >
            <Gavel size={50} className="text-royal-blue" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-white italic mb-6 uppercase tracking-tighter">بنود الخدمة</h1>
          <p className="text-gray-500 font-black italic max-w-2xl mx-auto uppercase text-[12px] tracking-[0.4em] leading-loose">
             اتفاقية الاستخدام القانونية الملزمة لمنظومة BLACK BOX TECHNOLOGY
          </p>
        </div>

        <div className="space-y-6">
          <TermsSection title="1. قبول الشروط والأهلية" icon={ShieldCheck}>
            <p>• باستخدامك لخدمات Black Box، فإنك تقر بأنك بلغت السن القانوني وتمتلك الأهلية الكاملة لإبرام هذا العقد.</p>
            <p>• إن إنشاء حساب يعني موافقتك المطلقة على هذه البنود وعلى سياسة الخصوصية المرتبطة بها.</p>
          </TermsSection>

          <TermsSection title="2. القواعد المالية وعملة Bx" icon={Coins}>
            <p>عملة Bx هي عملة افتراضية مخصصة للاستخدام داخل منظومة بلاك بوكس فقط:</p>
            <ul className="list-disc list-inside space-y-3 pr-4 text-right">
              <li>بمجرد شراء باقة Bx، لا يمكن استرداد المبلغ نقدياً تحت أي ظرف.</li>
              <li>يُحظر تماماً محاولة بيع أو تداول عملة Bx خارج المنصة الرسمية.</li>
            </ul>
          </TermsSection>

          <TermsSection title="3. شروط استخدام AI Studio" icon={Zap}>
            <p>أنت تمنحنا حق معالجة بياناتك لإنتاج المحتوى، وتلتزم بالآتي:</p>
            <ul className="list-disc list-inside space-y-3 pr-4 text-red-500 text-right">
              <li>يُحظر استخدام الذكاء الاصطناعي لتوليد محتوى يروج للكراهية أو العنف.</li>
              <li>يُحظر انتحال الشخصيات دون إذن قانوني موثق.</li>
            </ul>
          </TermsSection>

          <div className="mt-10 p-10 bg-royal-blue/10 border-2 border-royal-blue/20 rounded-[3rem] relative overflow-hidden group backdrop-blur-md">
            <MailCheck className="absolute -left-10 -top-10 text-royal-blue/20 w-40 h-40 group-hover:rotate-12 transition-transform" />
            <h3 className="text-2xl font-black text-white italic mb-4 flex items-center gap-3 justify-end">
              التعديلات والإخطار القانوني <History className="text-royal-blue" />
            </h3>
            <div className="space-y-6 text-white font-bold italic leading-relaxed text-right">
              <p>
                تمتلك إدارة Black Box Technology الحق الحصري في تعديل "بنود الخدمة" هذه في أي وقت.
              </p>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
                <p className="text-lg">
                  "بمجرد اعتماد أي تعديل، سيتم إرسال النسخة الجديدة فوراً إلى بريدك الإلكتروني المسجل. يعتبر استمرارك في استخدام المنظومة بعد تاريخ الإرسال بمثابة إقرار وموافقة قانونية ملزمة منك على البنود الجديدة."
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 py-10 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] font-black italic uppercase tracking-[0.5em]">
            LEGAL COMPLIANCE DIVISION - BLACK BOX TECHNOLOGY © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
