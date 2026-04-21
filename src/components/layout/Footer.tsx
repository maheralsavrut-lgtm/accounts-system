import { Link } from "react-router-dom";

const generalSocial = [
  { name: 'facebook', file: 'Facebook.png' },
  { name: 'whatsapp', file: 'whatsapp.png' },
  { name: 'instagram', file: 'Instagram.png' },
  { name: 'tiktok', file: 'tiktok.png' },
  { name: 'youtube', file: 'YouTube.png' },
  { name: 'x', file: 'x.png' },
];

const techSocial = [
  { name: 'linkedin', file: 'LinkedIn.png' },
  { name: 'github', file: 'GitHub copy.png' },
  { name: 'discord', file: 'Discord.png' }
];

export default function Footer() {
  return (
    <footer className="relative z-10 py-16 border-t border-white/5 bg-[#050505]/90 backdrop-blur-xl mt-16 text-center italic" dir="rtl">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="flex flex-col items-center">
            <h4 className="text-white font-black mb-6 border-b-2 border-royal-blue inline-block pb-1">قانوني</h4>
            <ul className="text-gray-500 text-sm font-bold space-y-2.5 text-center">
              {[
                { name: "الأمان والشفافية", path: "/standards" },
                { name: "السياسات العامة", path: "/legal" },
                { name: "سياسة الخصوصية", path: "/legal" },
                { name: "اتفاقية الاستخدام", path: "/legal" },
                { name: "عنا", path: "/about" },
                { name: "وظائف", path: "#" },
              ].map((item, idx) => (
                <li key={idx} className="relative group pb-1 transition-colors duration-300 hover:text-royal-blue cursor-pointer">
                  {item.path.startsWith('/') ? <Link to={item.path}>{item.name}</Link> : item.name}
                  <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-white font-black mb-6 border-b-2 border-royal-blue inline-block pb-1">القطاعات</h4>
            <ul className="text-gray-500 text-sm font-bold space-y-2.5 text-center">
              {["الذكاء الاصطناعي", "وكالة التسويق", "منصة التواصل", "صندوق المنتجات", "المحفظة الموحدة", "التوثيق الرقمي"].map((sector, idx) => (
                <li key={idx} className="relative group pb-1 transition-colors duration-300 hover:text-royal-blue tracking-tight cursor-pointer">
                  {sector}
                  <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="text-white font-black mb-6 border-b-2 border-royal-blue inline-block pb-1">تواصل مباشر</h4>
            <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden shadow-2xl mb-6 w-full">
              <table className="w-full text-[10px] md:text-[12px] font-bold">
                <tbody>
                  {[
                    { label: "الإدارة", email: "admin@bbtech.cloud" },
                    { label: "الدعم", email: "support@bbtech.cloud" },
                    { label: "عام", email: "info@bbtech.cloud" },
                  ].map((e, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="p-3 text-right bg-white/[0.01] border-l border-white/5 px-4 text-gray-400 whitespace-nowrap">{e.label}</td>
                      <td className="p-3 text-royal-blue text-left px-4 font-black tracking-tighter uppercase" dir="ltr">{e.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-4 w-full items-center">
              <div className="flex items-center gap-4">
                {generalSocial.map((social) => (
                  <a key={social.name} href="#" className="group transition-all duration-300">
                    <img src={`/${social.file}`} alt={social.name} className="w-8 h-8 object-contain opacity-50 group-hover:opacity-100 group-hover:scale-110" referrerPolicy="no-referrer" />
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-4">
                {techSocial.map((social) => (
                  <a key={social.name} href="#" className="group transition-all duration-300">
                    <img src={`/${social.file}`} alt={social.name} className="w-8 h-8 object-contain opacity-50 group-hover:opacity-100 group-hover:scale-110" referrerPolicy="no-referrer" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-3 font-black">
          <div className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 flex-row-reverse">
              <img src="/favicon.png" alt="Black Box" className="w-8 h-8 object-contain" />
              <div className="h-4 w-px bg-white/20" />
              <div className="flex flex-col items-center">
                <span className="text-xs tracking-[0.3em]">BLACK BOX TECHNOLOGY</span>
                <span className="text-[9px] tracking-[0.1em] text-gray-500 mt-1 uppercase font-bold">LLC Co, ETC 2026</span>
              </div>
          </div>
          <p className="text-gray-700 text-[10px] tracking-[0.5em] uppercase text-center leading-tight">
            Copyright © 2026 Black Box Technology System <br className="md:hidden" /> 
            <span className="text-royal-blue/30">|</span> All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
