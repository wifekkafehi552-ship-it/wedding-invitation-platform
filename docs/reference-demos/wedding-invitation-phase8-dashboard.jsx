import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Palette, FileStack, Type, Users, ClipboardCheck,
  Image, BookOpen, Settings, Menu, X, ExternalLink, TrendingUp,
} from "lucide-react";

/**
 * PHASE 8 — Dashboard shell
 *
 * This is the outer frame every later phase's panel plugs into
 * (Pages -> Phase 3, Typography -> Phase 4, Family -> Phase 5,
 * Guests/RSVP -> Phase 9, Gallery/Story -> Phase 10, Live editor ->
 * Phase 12). Today each section shows a lightweight summary card;
 * the full interactive tools built in earlier phases attach here.
 */

const wedding = {
  groom: "محمد",
  bride: "سارة",
  slug: "mohamed-sara",
  dateLabel: "12 سبتمبر 2026",
  status: "draft",
};

const NAV = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "builder", label: "منشئ الدعوة", icon: Palette },
  { id: "pages", label: "الصفحات", icon: FileStack },
  { id: "templates", label: "القوالب", icon: Palette },
  { id: "typography", label: "الخطوط", icon: Type },
  { id: "guests", label: "المدعوون", icon: Users },
  { id: "rsvp", label: "تأكيد الحضور", icon: ClipboardCheck },
  { id: "gallery", label: "معرض الصور", icon: Image },
  { id: "story", label: "قصتنا", icon: BookOpen },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

function useGoogleFonts() {
  useEffect(() => {
    const id = "wedding-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-[#E7D9BE] p-4">
      <p className="text-[#1E1A16]/50 text-xs mb-1">{label}</p>
      <p className="text-2xl text-[#1E1A16]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value}</p>
      {sub && <p className="text-[10px] text-[#B8935A] mt-1">{sub}</p>}
    </div>
  );
}

function SectionCard({ title, desc, cta }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E7D9BE] p-6">
      <h3 className="text-lg text-[#1E1A16] mb-1" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{title}</h3>
      <p className="text-[#1E1A16]/60 text-sm mb-4">{desc}</p>
      <button className="text-xs text-[#B8935A] border border-[#B8935A]/40 rounded-full px-4 py-1.5 hover:bg-[#B8935A]/10 transition-colors">
        {cta}
      </button>
    </div>
  );
}

const PANELS = {
  overview: () => (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="إجمالي الدعوات" value="143" />
        <StatCard label="تأكيد الحضور" value="98" sub="+21 اعتذار" />
        <StatCard label="بانتظار الرد" value="24" />
        <StatCard label="إجمالي الضيوف" value="176" />
      </div>
      <div className="bg-white rounded-2xl border border-[#E7D9BE] p-6">
        <div className="flex items-center gap-2 mb-4 text-[#1E1A16]">
          <TrendingUp size={16} className="text-[#B8935A]" />
          <h3 style={{ fontFamily: "'Aref Ruqaa', serif" }}>حالة الدعوة</h3>
        </div>
        <p className="text-sm text-[#1E1A16]/70 mb-1">
          الرابط: <span className="text-[#B8935A]">/invite/{wedding.slug}</span>
        </p>
        <p className="text-sm text-[#1E1A16]/70 mb-4">
          الحالة: <span className="text-[#5B1F23]">مسودة (غير منشورة)</span>
        </p>
        <button className="bg-[#1E1A16] text-white text-xs px-5 py-2 rounded-full">نشر الدعوة</button>
      </div>
    </div>
  ),
  builder: () => <SectionCard title="منشئ الدعوة" desc="محرر مباشر مع معاينة حية — يجمع كل الأقسام (يُبنى في Phase 12)." cta="فتح المحرر" />,
  pages: () => <SectionCard title="إدارة الصفحات" desc="تفعيل/تعطيل وإعادة ترتيب الصفحات بالسحب والإفلات." cta="إدارة الصفحات" />,
  templates: () => <SectionCard title="اختيار القالب" desc="10 قوالب مختلفة — البيانات تبقى ثابتة عند التبديل." cta="تصفح القوالب" />,
  typography: () => <SectionCard title="الخطوط والطباعة" desc="اختر خطوط عربية ولاتينية لكل عنصر، وألوان النصوص." cta="تخصيص الخطوط" />,
  guests: () => <SectionCard title="قائمة المدعوين" desc="أضف مدعوين، أنشئ روابط شخصية، وحدد الحد الأقصى لعدد المرافقين." cta="إدارة المدعوين" />,
  rsvp: () => <SectionCard title="تأكيدات الحضور" desc="تابع الردود، صفّي حسب الحالة، وصدّر البيانات كـ CSV." cta="عرض الردود" />,
  gallery: () => <SectionCard title="معرض الصور" desc="ارفع صور العروسين وصور الذكريات، ورتبها كما تريد." cta="رفع صور" />,
  story: () => <SectionCard title="قصة الحب" desc="أضف أحداث الخط الزمني: أول لقاء، الخطوبة، وغيرها." cta="تعديل القصة" />,
  settings: () => <SectionCard title="إعدادات الدعوة" desc="التاريخ، المكان، اللغة، الموسيقى، وإعدادات النطاق." cta="فتح الإعدادات" />,
};

export default function DashboardShell() {
  useGoogleFonts();
  const [active, setActive] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const ActivePanel = PANELS[active];
  const activeLabel = NAV.find((n) => n.id === active)?.label;

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7] flex" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-l border-[#E7D9BE] py-6 px-3 shrink-0">
        <div className="px-3 mb-6">
          <p className="text-[#B8935A] tracking-[0.25em] text-[10px] mb-1">PHASE 8 — DASHBOARD</p>
          <p className="text-[#1E1A16]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
            {wedding.groom} &amp; {wedding.bride}
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active === n.id ? "bg-[#B8935A]/15 text-[#B8935A]" : "text-[#1E1A16]/70 hover:bg-[#F6F1E7]"
              }`}
            >
              <n.icon size={16} />
              {n.label}
            </button>
          ))}
        </nav>
        <a
          href="#"
          className="mt-auto flex items-center gap-2 text-xs text-[#1E1A16]/50 px-3 pt-6 border-t border-[#E7D9BE] mt-6"
        >
          <ExternalLink size={13} /> عرض الدعوة العامة
        </a>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-[#E7D9BE] flex items-center justify-between px-4 py-3">
        <button onClick={() => setMobileNavOpen(true)} className="text-[#1E1A16]">
          <Menu size={20} />
        </button>
        <p className="text-sm text-[#1E1A16]">{activeLabel}</p>
        <span className="w-5" />
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileNavOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-64 bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-[#1E1A16]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                {wedding.groom} &amp; {wedding.bride}
              </p>
              <button onClick={() => setMobileNavOpen(false)}><X size={18} /></button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setActive(n.id); setMobileNavOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    active === n.id ? "bg-[#B8935A]/15 text-[#B8935A]" : "text-[#1E1A16]/70"
                  }`}
                >
                  <n.icon size={16} />
                  {n.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 px-5 py-6 md:px-8 md:py-8 mt-14 md:mt-0">
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl text-[#1E1A16]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{activeLabel}</h1>
        </div>
        <ActivePanel />
      </main>
    </div>
  );
}
