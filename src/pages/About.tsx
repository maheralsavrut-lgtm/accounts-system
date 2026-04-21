import { motion } from "motion/react";
import { ShieldCheck, Zap, Globe, Lock, Cpu, Scale } from "lucide-react";

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: <Cpu className="text-royal-blue" size={32} />,
      title: "تقنية البصمة الرقمية",
      desc: "نستخدم خوارزميات SHA-256 لتوليد هوية فريدة لكل مستند، مما يجعل التلاعب به مستحيلاً تقنياً."
    },
    {
      icon: <Lock className="text-royal-blue" size={32} />,
      title: "تشفير بمستوى عسكري",
      desc: "بياناتك وسجلاتك محمية بطبقات تشفير متعددة تضمن الخصوصية الكاملة والوصول المصرح به فقط."
    },
    {
      icon: <Scale className="text-royal-blue" size={32} />,
      title: "المرجعية الفنية",
      desc: "نوفر أدلة رقمية فنية يعتد بها في التحقيقات، مما يعزز موقفك القانوني في إثبات الملكية."
    }
  ];

  return (
    <div className="pt-16 pb-20 px-6 italic text-right relative z-10" dir="rtl">
      <section className="max-w-4xl mx-auto text-center mb-24">
        <motion.h1 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-white"
        >
          عن نظام <span className="text-royal-blue italic">Black Box Accounts</span>
        </motion.h1>
        <motion.p 
          initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} variants={fadeIn}
          className="text-gray-400 text-lg md:text-xl font-bold leading-relaxed"
        >
          المحرك الأساسي الذي يربط هوية المستخدم بجميع خدمات المجموعة مع نظام محفظة رقمية مشفرة.
        </motion.p>
      </section>

      <section className="max-w-6xl mx-auto mb-32 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="space-y-6"
          >
            <h2 className="text-3xl font-black text-white border-r-4 border-royal-blue pr-4">رؤيتنا</h2>
            <p className="text-gray-400 font-bold leading-loose">
              في Black Box Technology، نؤمن بالهوية الموحدة. رؤيتنا هي تبسيط الوصول إلى التقنيات المتقدمة من خلال حساب واحد يمنحك السيطرة الكاملة على بياناتك، أرصدتك، وشهاداتك الرقمية عبر جميع قطاعاتنا.
            </p>
            <div className="flex gap-4 pt-4 text-[10px] font-black text-royal-blue uppercase tracking-widest">
              <span className="flex items-center gap-2"><Zap size={14}/> سرعة التنفيذ</span>
              <span className="flex items-center gap-2"><Globe size={14}/> معايير عالمية</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="relative flex justify-center lg:justify-end"
          >
             <div className="w-full max-w-sm border border-white/5 bg-white/[0.02] p-12 rounded-[2.5rem] backdrop-blur-md">
                <div className="text-center space-y-5">
                  <ShieldCheck size={60} className="mx-auto text-royal-blue" />
                  <div className="space-y-1">
                    <div className="text-white font-black text-xl tracking-tighter uppercase italic leading-none">Security Protocol</div>
                    <div className="text-[8px] text-gray-600 tracking-[0.5em] uppercase font-bold mt-2">v.2.0.2.6</div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }} variants={fadeIn}
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-royal-blue/30 transition-all duration-500"
            >
              <div className="mb-6">{f.icon}</div>
              <h3 className="text-xl font-black text-white mb-4 italic">{f.title}</h3>
              <p className="text-gray-500 text-sm font-bold leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
