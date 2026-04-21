import { motion } from "motion/react";
import { Shield, Lock, Eye, Scale, Fingerprint, Globe, Cpu, CreditCard, Share2, Hammer, BellRing, BookOpen } from "lucide-react";
import React, { useState } from "react";

const LegalSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => {
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

export default function Legal() {
  return (
    <div className="min-h-screen pt-16 pb-24 px-6 bg-transparent text-white">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-5 bg-royal-blue/10 rounded-full mb-8 border border-royal-blue/20"
          >
            <Shield size={50} className="text-royal-blue" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-white italic mb-6 uppercase tracking-tighter">سياسة الخصوصية الشاملة</h1>
          <p className="text-gray-500 font-black italic max-w-2xl mx-auto uppercase text-[12px] tracking-[0.4em] leading-loose">
            منظومة BLACK BOX TECHNOLOGY - الإصدار القانوني الموحد لجميع القطاعات
          </p>
        </div>

        <div className="space-y-6">
          <LegalSection title="1. نطاق البيانات والمنظومة" icon={BookOpen}>
            <p>تلتزم منظومة Black Box بحماية خصوصية المستخدمين عبر كافة قطاعاتها التقنية. تشمل هذه السياسة كل فرد يقوم بإنشاء حساب أو استخدام خدماتنا في الذكاء الاصطناعي، التسويق، التواصل، أو التوثيق.</p>
            <p>نحن نجمع البيانات الضرورية فقط لتقديم تجربة فائقة الجودة، ونستخدم تقنيات تشفير عسكرية لحماية البيانات أثناء النقل (In-Transit) وأثناء التخزين (At-Rest).</p>
          </LegalSection>

          <LegalSection title="2. معالجة بيانات الذكاء الاصطناعي" icon={Cpu}>
            <div className="space-y-4">
              <h4 className="text-white font-black underline">أ. النصوص والمستندات:</h4>
              <p>عند رفع مستندات (PDF, Word) للتحليل، يتم استخراج البيانات نصياً ومعالجتها في بيئة معزولة (Sandbox). لا تطلع الكوادر البشرية على محتوى مستنداتك إلا في حالة طلب دعم فني مباشر منك.</p>
              
              <h4 className="text-white font-black underline">ب. الصور والفيديو (Grafia & Motion):</h4>
              <p>يتم استخدام معالجة الصور لتغيير الملامح، الملابس، أو الخلفيات. يتم تخزين "نقاط الوجه" كأرقام رياضية مشفرة وليس كصور حيوية. نحتفظ بالصور الأصلية لمدة 30 يوماً في "سلة المحذوفات" الخاصة بك قبل مسحها نهائياً من خوادمنا.</p>
            </div>
          </LegalSection>

          <LegalSection title="3. سياسة التفاعل والتسويق الرقمي" icon={Share2}>
            <p>تدرك Black Box حساسية التعامل مع المنصات الخارجية. عند استخدام خدمات زيادة التفاعل (لايكات، متابعين، مشاهدات):</p>
            <ul className="list-disc list-inside space-y-2 pr-4 text-right">
              <li>نحن لا نطلب كلمات سر حساباتك على المنصات الخارجية (Facebook, Instagram, إلخ).</li>
              <li>العميل يتحمل المسؤولية القانونية عن المحتوى الذي يتم الترويج له.</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. المحفظة الموحدة والعمليات المالية" icon={CreditCard}>
            <p>جميع عمليات الشراء داخل "صندوق المنتجات" أو "AI Studio" تتم عبر عملة Bx:</p>
            <ul className="list-disc list-inside space-y-2 pr-4 text-right">
              <li>يتم تسجيل كل العمليات في سجل العمليات (Audit Log) الذي لا يمكن تعديله.</li>
              <li>يتم تشفير بيانات الدفع عبر بوابات معتمدة دولياً (PCI-DSS Compliant).</li>
            </ul>
          </LegalSection>

          <div className="mt-10 p-10 bg-royal-blue/10 border-2 border-royal-blue/20 rounded-[3rem] relative overflow-hidden group backdrop-blur-md">
            <BellRing className="absolute -left-10 -top-10 text-royal-blue/20 w-40 h-40 group-hover:rotate-12 transition-transform" />
            <h3 className="text-2xl font-black text-white italic mb-4 flex items-center gap-3 justify-end">
               بند التعديلات والتحديثات الرسمية <BellRing className="text-royal-blue" />
            </h3>
            <div className="space-y-6 text-white font-bold italic leading-relaxed text-right">
              <p>
                تحتفظ إدارة <span className="text-royal-blue underline italic">Black Box Technology</span> بالحق في تعديل أي بند من بنود سياسة الخصوصية هذه في أي وقت.
              </p>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-lg">
                  "يتم إرسال النسخة المحدثة من السياسة فور اعتمادها إلى البريد الإلكتروني المسجل لدينا. إن استخدامك لخدمات المنظومة بعد تاريخ إرسال هذا البريد يُعد بمثابة موافقة قانونية نهائية وصريحة منك على كافة التعديلات الجديدة."
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 py-10 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] font-black italic uppercase tracking-[0.5em]">
            PROTECTED BY BLACK BOX CYBER-SECURITY PROTOCOLS © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
