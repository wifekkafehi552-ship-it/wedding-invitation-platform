import React, { useState, useEffect, useRef } from "react";
import { GripVertical, Eye, EyeOff, ChevronDown } from "lucide-react";

/**
 * PHASE 3 — Pages / Sections System
 *
 * Data model matches the spec's `wedding_pages` table:
 *   { id, page_type, enabled, sort_order }
 *
 * The dashboard lets the owner toggle each page on/off and drag to reorder.
 * The public invitation renderer below just reads that array — it never
 * hardcodes page order, proving pages are fully data-driven (rule #19-20).
 */

const wedding = {
  groom: "محمد",
  bride: "سارة",
  groomFather: "السيد فتحي الهمامي",
  brideFather: "السيد سالم القادري",
  dateLabel: "12 سبتمبر 2026",
};

const PAGE_LABELS = {
  cover: "الغلاف",
  family: "دعوة العائلة",
  couple: "العروسين",
  story: "قصتنا",
  gallery: "معرض الصور",
  details: "تفاصيل الحفل",
  location: "الموقع",
  rsvp: "تأكيد الحضور",
  final: "الرسالة الختامية",
};

const initialPages = [
  { id: "cover", page_type: "cover", enabled: true, sort_order: 0 },
  { id: "family", page_type: "family", enabled: true, sort_order: 1 },
  { id: "couple", page_type: "couple", enabled: true, sort_order: 2 },
  { id: "story", page_type: "story", enabled: false, sort_order: 3 },
  { id: "gallery", page_type: "gallery", enabled: true, sort_order: 4 },
  { id: "details", page_type: "details", enabled: true, sort_order: 5 },
  { id: "location", page_type: "location", enabled: true, sort_order: 6 },
  { id: "rsvp", page_type: "rsvp", enabled: true, sort_order: 7 },
  { id: "final", page_type: "final", enabled: true, sort_order: 8 },
];

function useGoogleFonts() {
  useEffect(() => {
    const id = "wedding-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ------------------------- Dashboard: pages list ------------------------- */
function PagesDashboard({ pages, setPages, onPreview }) {
  const dragIndex = useRef(null);

  const toggle = (id) =>
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );

  const handleDragStart = (index) => (dragIndex.current = index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (index) => {
    setPages((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIndex.current, 1);
      arr.splice(index, 0, moved);
      return arr.map((p, i) => ({ ...p, sort_order: i }));
    });
    dragIndex.current = null;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7] px-6 py-12" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="max-w-xl mx-auto">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-2">PHASE 3 — PAGES SYSTEM</p>
        <h1 className="text-3xl text-[#1E1A16] mb-1" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
          صفحات الدعوة
        </h1>
        <p className="text-[#1E1A16]/60 text-sm mb-8">
          فعّل أو عطّل أي صفحة، واسحب لإعادة الترتيب — التغييرات تنعكس مباشرة في المعاينة
        </p>

        <div className="flex flex-col gap-2">
          {pages.map((p, i) => (
            <div
              key={p.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(i)}
              className={`flex items-center gap-3 bg-white rounded-xl border px-4 py-3 cursor-grab active:cursor-grabbing transition-opacity ${
                p.enabled ? "border-[#E7D9BE]" : "border-[#E7D9BE]/50 opacity-50"
              }`}
            >
              <GripVertical size={16} className="text-[#B8935A]/60 shrink-0" />
              <span className="flex-1 text-[#1E1A16] text-sm">
                {PAGE_LABELS[p.page_type]}
              </span>
              <button
                onClick={() => toggle(p.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  p.enabled ? "bg-[#B8935A]/15 text-[#B8935A]" : "bg-[#1E1A16]/5 text-[#1E1A16]/40"
                }`}
                aria-label={p.enabled ? "تعطيل الصفحة" : "تفعيل الصفحة"}
              >
                {p.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onPreview}
          className="mt-8 w-full bg-[#1E1A16] text-white py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
        >
          معاينة الدعوة ✨
        </button>
      </div>
    </div>
  );
}

/* --------------------------- Section renderers --------------------------- */
function OrnamentDivider() {
  return (
    <svg viewBox="0 0 220 24" className="mx-auto w-40 h-5 my-4" fill="none" aria-hidden="true">
      <path
        d="M2 12 C 40 2, 60 22, 90 12 C 100 8, 105 8, 110 12 C 115 16, 120 16, 130 12 C 160 2, 180 22, 218 12"
        stroke="#B8935A"
        strokeWidth="1.2"
      />
      <circle cx="110" cy="12" r="3" fill="#B8935A" />
    </svg>
  );
}

const SECTION_RENDERERS = {
  cover: () => (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#1E1A16]">
      <p className="text-[#E7D9BE] tracking-[0.35em] text-xs mb-4">دعوة زفاف</p>
      <h1 className="text-white text-4xl md:text-5xl" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
        {wedding.groom} <span className="text-[#B8935A]">&</span> {wedding.bride}
      </h1>
    </section>
  ),
  family: () => (
    <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-[#E7D9BE]/40">
      <p className="text-[#1E1A16]/70 text-sm">تتشرف عائلتا</p>
      <h3 className="text-xl md:text-2xl mt-3" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{wedding.groomFather}</h3>
      <p className="text-[#B8935A] my-1">و</p>
      <h3 className="text-xl md:text-2xl" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{wedding.brideFather}</h3>
      <OrnamentDivider />
    </section>
  ),
  couple: () => (
    <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-[#F6F1E7]">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{wedding.groom}</h2>
        <span className="text-[#B8935A]">&</span>
        <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{wedding.bride}</h2>
      </div>
      <OrnamentDivider />
      <p className="text-[#1E1A16]/70 text-sm">يسعدنا دعوتكم لمشاركتنا فرحة زفافنا</p>
    </section>
  ),
  story: () => (
    <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-[#E7D9BE]/25">
      <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-4">قصتنا</p>
      <p className="text-[#1E1A16]/60 text-sm">2021 — أول لقاء ❤️ · 2025 — الخطوبة 💍</p>
    </section>
  ),
  gallery: () => (
    <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-[#F6F1E7]">
      <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-6">معرض الصور</p>
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square bg-[#E7D9BE] rounded-lg" />
        ))}
      </div>
    </section>
  ),
  details: () => (
    <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-[#1E1A16] text-[#F6F1E7]">
      <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-4">تفاصيل الحفل</p>
      <p>{wedding.dateLabel} — الساعة 7:00 مساءً</p>
    </section>
  ),
  location: () => (
    <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-[#E7D9BE]/40">
      <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-4">الموقع</p>
      <button className="border border-[#B8935A] text-[#1E1A16] px-6 py-2.5 rounded-full text-sm">
        📍 افتح الموقع على Google Maps
      </button>
    </section>
  ),
  rsvp: () => (
    <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-[#F6F1E7]">
      <p className="text-[#1E1A16] mb-6">هل ستشاركوننا فرحتنا؟ ❤️</p>
      <div className="flex gap-3">
        <button className="bg-[#1E1A16] text-white px-5 py-2 rounded-full text-sm">نعم، سأحضر</button>
        <button className="border border-[#1E1A16]/30 text-[#1E1A16] px-5 py-2 rounded-full text-sm">لن أتمكن</button>
      </div>
    </section>
  ),
  final: () => (
    <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-6 py-16 bg-[#1E1A16] text-[#F6F1E7]">
      <p className="max-w-xs" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
        ننتظركم لنحتفل معاً بأجمل يوم في حياتنا ❤️
      </p>
    </section>
  ),
};

function PublicInvitationPreview({ pages, onBack }) {
  const enabledSorted = pages
    .filter((p) => p.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <button
        onClick={onBack}
        className="fixed top-4 right-4 z-50 bg-[#1E1A16] text-white text-xs px-4 py-2 rounded-full shadow-lg"
      >
        ← رجوع للوحة التحكم
      </button>
      {enabledSorted.length === 0 && (
        <div className="min-h-screen flex items-center justify-center text-[#1E1A16]/50 text-sm">
          كل الصفحات معطّلة — فعّل صفحة واحدة على الأقل
        </div>
      )}
      {enabledSorted.map((p) => {
        const Renderer = SECTION_RENDERERS[p.page_type];
        return <React.Fragment key={p.id}>{Renderer && <Renderer />}</React.Fragment>;
      })}
    </div>
  );
}

export default function PageSystemDemo() {
  useGoogleFonts();
  const [pages, setPages] = useState(initialPages);
  const [mode, setMode] = useState("dashboard"); // "dashboard" | "preview"

  return mode === "dashboard" ? (
    <PagesDashboard pages={pages} setPages={setPages} onPreview={() => setMode("preview")} />
  ) : (
    <PublicInvitationPreview pages={pages} onBack={() => setMode("dashboard")} />
  );
}
