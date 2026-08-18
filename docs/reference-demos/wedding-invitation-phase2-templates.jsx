import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, ChevronDown, Check } from "lucide-react";

/**
 * PHASE 2 — Template System
 *
 * Rule #55 respected: no names/text specific to "Mohamed & Sara" live inside
 * any Template component — every template receives the same `wedding` object
 * and renders it. Switching templates never touches data.
 *
 * 3 fully distinct templates are implemented now to prove the architecture
 * (layout + type + color + animation + decoration each differ, not just a
 * palette swap). The other 7 from the spec (Ivory Elegance, Romantic Rose,
 * Arabic Heritage, Modern Luxury, Botanical, Classic Wedding, Cinematic)
 * plug into the exact same `TemplateProps` shape in later passes.
 *
 *  templates/
 *    RoyalGold/      -> ornate, ceremonial, gold-on-ivory, serif calligraphy
 *    MinimalWhite/    -> quiet, generous whitespace, thin sans, no ornament
 *    DarkLuxury/      -> near-black, single warm spotlight, cinematic type
 */

const wedding = {
  groom: "محمد",
  bride: "سارة",
  groomFather: "السيد فتحي الهمامي",
  brideFather: "السيد سالم القادري",
  date: "2026-09-12T19:00:00",
  dateLabel: "12 سبتمبر 2026",
  venue: "قاعة لاكزوري لاند",
  coverImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
};

function useGoogleFonts() {
  useEffect(() => {
    const id = "wedding-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500&family=Tajawal:wght@300;400;500&family=EB+Garamond:ital@0;1&family=Reem+Kufi&display=swap";
    document.head.appendChild(link);
  }, []);
}

function useCountdown(target) {
  const [left, setLeft] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, target.getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, [target]);
  const s = Math.floor(left / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/* ---------------------------------------------------------------- */
/* TEMPLATE 1 — Royal Gold: ornate, gold ornament dividers, serif    */
/* ---------------------------------------------------------------- */
function OrnamentDivider({ light = false }) {
  const stroke = light ? "#E7D9BE" : "#B8935A";
  return (
    <svg viewBox="0 0 220 24" className="mx-auto w-40 h-5 my-4" fill="none" aria-hidden="true">
      <path
        d="M2 12 C 40 2, 60 22, 90 12 C 100 8, 105 8, 110 12 C 115 16, 120 16, 130 12 C 160 2, 180 22, 218 12"
        stroke={stroke}
        strokeWidth="1.2"
      />
      <circle cx="110" cy="12" r="3" fill={stroke} />
    </svg>
  );
}

function RoyalGold({ wedding, opened, onOpen, muted, onToggleMute }) {
  const cd = useCountdown(useRef(new Date(wedding.date)).current);
  return (
    <div dir="rtl" className="relative w-full bg-[#F6F1E7] text-[#1E1A16]" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className={`fixed inset-0 z-40 flex flex-col items-center justify-center text-center transition-all duration-[1400ms] ease-out ${opened ? "opacity-0 pointer-events-none scale-105" : "opacity-100"}`}>
        <img src={wedding.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 px-6">
          <p className="text-[#E7D9BE] tracking-[0.35em] text-xs md:text-sm mb-6">دعوة زفاف</p>
          <h1 className="text-white text-5xl md:text-7xl leading-tight" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
            {wedding.groom} <span className="text-[#B8935A]">&</span> {wedding.bride}
          </h1>
          <OrnamentDivider light />
          <button onClick={onOpen} className="mt-10 border border-[#B8935A] text-[#F6F1E7] px-8 py-3 rounded-full text-sm hover:bg-[#B8935A] hover:text-[#1E1A16] transition-colors duration-500">
            افتح دعوتك ✨
          </button>
        </div>
      </div>
      <div className={`transition-opacity duration-[1200ms] ${opened ? "opacity-100" : "opacity-0"}`}>
        <button onClick={onToggleMute} className="fixed top-4 left-4 z-30 w-10 h-10 rounded-full bg-[#1E1A16]/70 backdrop-blur flex items-center justify-center text-[#E7D9BE]">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
          <p className="tracking-[0.35em] text-xs text-[#B8935A] mb-6">نتشرف بدعوتكم</p>
          <div className="flex items-center gap-4 md:gap-8">
            <h2 className="text-4xl md:text-6xl" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{wedding.groom}</h2>
            <span className="text-2xl md:text-3xl text-[#B8935A]">&</span>
            <h2 className="text-4xl md:text-6xl" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{wedding.bride}</h2>
          </div>
          <OrnamentDivider />
          <div className="flex gap-8 mt-2 text-sm text-[#1E1A16]/70">
            <span>{wedding.dateLabel}</span><span className="text-[#B8935A]">•</span><span>الساعة 7:00 مساءً</span>
          </div>
          <div className="mt-12 bg-[#1E1A16] rounded-2xl px-6 py-6 md:px-10 md:py-8 flex gap-6 md:gap-10 shadow-xl">
            {[["يوم", cd.days], ["ساعة", cd.hours], ["دقيقة", cd.minutes], ["ثانية", cd.seconds]].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center min-w-[56px]">
                <div className="text-2xl md:text-3xl tabular-nums text-[#F6F1E7]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{String(val).padStart(2, "0")}</div>
                <div className="text-[10px] tracking-[0.25em] text-[#E7D9BE]/70 mt-1">{label}</div>
              </div>
            ))}
          </div>
          <ChevronDown className="mt-16 text-[#B8935A] animate-bounce" size={22} />
        </section>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* TEMPLATE 2 — Minimal White: quiet, huge whitespace, thin sans     */
/* ---------------------------------------------------------------- */
function MinimalWhite({ wedding, opened, onOpen, muted, onToggleMute }) {
  const cd = useCountdown(useRef(new Date(wedding.date)).current);
  return (
    <div dir="rtl" className="relative w-full bg-white text-[#111]" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <div className={`fixed inset-0 z-40 flex flex-col items-center justify-center text-center bg-white transition-all duration-1000 ${opened ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <p className="text-[11px] tracking-[0.5em] text-[#999] mb-10">WEDDING INVITATION</p>
        <h1 className="text-4xl md:text-6xl font-light tracking-wide">
          {wedding.groom} <span className="mx-3 text-[#ccc] font-thin">/</span> {wedding.bride}
        </h1>
        <div className="w-10 h-px bg-[#111] my-8" />
        <button onClick={onOpen} className="text-xs tracking-[0.3em] border-b border-[#111] pb-1 hover:opacity-60 transition-opacity">
          افتح الدعوة
        </button>
      </div>
      <div className={`transition-opacity duration-1000 ${opened ? "opacity-100" : "opacity-0"}`}>
        <button onClick={onToggleMute} className="fixed top-6 left-6 z-30 text-[#111]">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
          <p className="text-[11px] tracking-[0.4em] text-[#999] mb-12">{wedding.dateLabel}</p>
          <h2 className="text-3xl md:text-5xl font-light mb-2">{wedding.groom}</h2>
          <div className="w-6 h-px bg-[#ccc] my-3" />
          <h2 className="text-3xl md:text-5xl font-light">{wedding.bride}</h2>
          <div className="mt-16 flex gap-10 md:gap-16">
            {[["يوم", cd.days], ["ساعة", cd.hours], ["دقيقة", cd.minutes], ["ثانية", cd.seconds]].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center">
                <div className="text-xl md:text-2xl font-light tabular-nums">{String(val).padStart(2, "0")}</div>
                <div className="text-[9px] tracking-[0.3em] text-[#999] mt-2">{label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* TEMPLATE 3 — Dark Luxury: near-black, single warm spotlight       */
/* ---------------------------------------------------------------- */
function DarkLuxury({ wedding, opened, onOpen, muted, onToggleMute }) {
  const cd = useCountdown(useRef(new Date(wedding.date)).current);
  return (
    <div dir="rtl" className="relative w-full bg-[#0B0A08] text-[#EFE7D8]" style={{ fontFamily: "'EB Garamond', serif" }}>
      <div className={`fixed inset-0 z-40 flex flex-col items-center justify-center text-center transition-all duration-[1600ms] ${opened ? "opacity-0 pointer-events-none scale-110" : "opacity-100"}`}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 40%, rgba(184,147,90,0.18), transparent 60%)" }} />
        <div className="relative z-10 px-6">
          <p className="text-[#B8935A] tracking-[0.5em] text-[10px] mb-8">CINEMATIC WEDDING</p>
          <h1 className="text-5xl md:text-7xl italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {wedding.groom} & {wedding.bride}
          </h1>
          <button onClick={onOpen} className="mt-12 text-[#EFE7D8]/80 text-xs tracking-[0.35em] hover:text-[#B8935A] transition-colors">
            ▸ ابدأ التجربة
          </button>
        </div>
      </div>
      <div className={`transition-opacity duration-[1400ms] ${opened ? "opacity-100" : "opacity-0"}`}>
        <button onClick={onToggleMute} className="fixed top-4 left-4 z-30 w-10 h-10 rounded-full border border-[#B8935A]/40 flex items-center justify-center text-[#B8935A]">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 30%, rgba(184,147,90,0.10), transparent 55%)" }} />
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-[#B8935A] tracking-[0.4em] text-[10px] mb-8">{wedding.dateLabel}</p>
            <h2 className="text-4xl md:text-6xl italic mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {wedding.groom} <span className="not-italic text-[#B8935A]">&</span> {wedding.bride}
            </h2>
            <div className="flex gap-8 md:gap-12">
              {[["يوم", cd.days], ["ساعة", cd.hours], ["دقيقة", cd.minutes], ["ثانية", cd.seconds]].map(([label, val]) => (
                <div key={label} className="flex flex-col items-center min-w-[52px]">
                  <div className="text-2xl md:text-3xl tabular-nums text-[#EFE7D8]">{String(val).padStart(2, "0")}</div>
                  <div className="text-[9px] tracking-[0.3em] text-[#B8935A] mt-2">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const TEMPLATES = [
  { id: "royal-gold", name: "Royal Gold", desc: "فخم، زخارف ذهبية، خط عربي احتفالي", Component: RoyalGold, swatch: ["#F6F1E7", "#B8935A", "#1E1A16"] },
  { id: "minimal-white", name: "Minimal White", desc: "هادئ، مساحات بيضاء واسعة، بدون زخرفة", Component: MinimalWhite, swatch: ["#FFFFFF", "#CCCCCC", "#111111"] },
  { id: "dark-luxury", name: "Dark Luxury", desc: "أسود سينمائي، إضاءة ذهبية خافتة", Component: DarkLuxury, swatch: ["#0B0A08", "#B8935A", "#EFE7D8"] },
];

export default function TemplateSystemDemo() {
  useGoogleFonts();
  const [templateId, setTemplateId] = useState("royal-gold");
  const [previewMode, setPreviewMode] = useState(false); // false = picker, true = live invitation
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(true);

  const active = TEMPLATES.find((t) => t.id === templateId);
  const ActiveTemplate = active.Component;

  if (previewMode) {
    return (
      <div className="relative">
        <button
          onClick={() => { setPreviewMode(false); setOpened(false); }}
          className="fixed top-4 right-4 z-50 bg-[#1E1A16] text-white text-xs px-4 py-2 rounded-full shadow-lg"
        >
          ← رجوع لاختيار القالب
        </button>
        <ActiveTemplate
          wedding={wedding}
          opened={opened}
          onOpen={() => { setOpened(true); setMuted(false); }}
          muted={muted}
          onToggleMute={() => setMuted((m) => !m)}
        />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7] px-6 py-12" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-3">PHASE 2 — TEMPLATE SYSTEM</p>
        <h1 className="text-3xl md:text-4xl text-[#1E1A16]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
          اختر القالب
        </h1>
        <p className="text-[#1E1A16]/60 text-sm mt-2">
          نفس بيانات الدعوة (محمد &amp; سارة) — التصميم فقط هو اللي يتغير
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid gap-5 md:grid-cols-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplateId(t.id)}
            className={`text-right rounded-2xl border-2 p-5 transition-all bg-white/60 hover:shadow-lg ${
              templateId === t.id ? "border-[#B8935A] shadow-md" : "border-transparent"
            }`}
          >
            <div className="flex gap-1.5 mb-4">
              {t.swatch.map((c) => (
                <span key={c} className="w-5 h-5 rounded-full border border-black/10" style={{ background: c }} />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-[#1E1A16]">{t.name}</h3>
              {templateId === t.id && <Check size={16} className="text-[#B8935A]" />}
            </div>
            <p className="text-xs text-[#1E1A16]/60 mt-2 leading-relaxed">{t.desc}</p>
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto flex justify-center mt-10">
        <button
          onClick={() => setPreviewMode(true)}
          className="bg-[#1E1A16] text-white px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
        >
          معاينة الدعوة كاملة ✨
        </button>
      </div>
    </div>
  );
}
