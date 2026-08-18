import React, { useState, useEffect, useMemo } from "react";
import { Check, Type } from "lucide-react";

/**
 * PHASE 4 — Typography + Fonts System
 *
 * Model matches spec's `typography_settings` table:
 *   { heading_font, body_font, names_font, family_font, button_font }
 * plus per-role size/weight/letterSpacing/lineHeight/align — all live,
 * reflected instantly in the invitation preview on the right/below.
 */

const wedding = {
  groom: "محمد",
  bride: "سارة",
  groomFather: "السيد فتحي الهمامي",
  brideFather: "السيد سالم القادري",
  dateLabel: "12 سبتمبر 2026",
};

const ARABIC_FONTS = [
  "Cairo", "Tajawal", "Amiri", "Noto Kufi Arabic", "Noto Naskh Arabic",
  "Aref Ruqaa", "Reem Kufi", "El Messiri", "Lateef", "Scheherazade New",
  "IBM Plex Sans Arabic",
];
const LATIN_FONTS = [
  "Playfair Display", "Cormorant Garamond", "Cinzel", "Great Vibes",
  "Allura", "Parisienne", "Montserrat", "Poppins", "Lora",
];
const ALL_FONTS = [...ARABIC_FONTS, ...LATIN_FONTS];

const ROLES = [
  { key: "heading", label: "العناوين", sample: "تفاصيل الحفل" },
  { key: "body", label: "النص الأساسي", sample: "يسعدنا دعوتكم لمشاركتنا فرحة زفافنا" },
  { key: "names", label: "أسماء العروسين", sample: `${wedding.groom} & ${wedding.bride}` },
  { key: "family", label: "أسماء العائلة", sample: wedding.groomFather },
  { key: "button", label: "الأزرار", sample: "تأكيد الحضور" },
];

const DEFAULTS = {
  heading: { font: "Aref Ruqaa", size: 28, weight: 700, spacing: 0, align: "center", color: "#F6F1E7" },
  body: { font: "Cairo", size: 15, weight: 400, spacing: 0, align: "center", color: "#E7D9BE" },
  names: { font: "Aref Ruqaa", size: 40, weight: 700, spacing: 0, align: "center", color: "#F6F1E7" },
  family: { font: "Amiri", size: 20, weight: 400, spacing: 0, align: "center", color: "#F6F1E7" },
  button: { font: "Cairo", size: 13, weight: 600, spacing: 2, align: "center", color: "#B8935A" },
};

const COLOR_PRESETS = [
  "#F6F1E7", // ivory
  "#E7D9BE", // champagne
  "#B8935A", // soft gold
  "#1E1A16", // ink
  "#5B1F23", // burgundy
  "#FFFFFF", // white
];

function useGoogleFonts(fontList) {
  useEffect(() => {
    const id = "wedding-fonts-dynamic";
    const families = fontList
      .map((f) => `family=${f.replace(/ /g, "+")}:wght@300;400;500;600;700`)
      .join("&");
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  }, [fontList]);
}

function FontSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm text-[#1E1A16]"
      style={{ fontFamily: `'${value}'` }}
    >
      <optgroup label="خطوط عربية">
        {ARABIC_FONTS.map((f) => (
          <option key={f} value={f} style={{ fontFamily: `'${f}'` }}>{f}</option>
        ))}
      </optgroup>
      <optgroup label="Latin">
        {LATIN_FONTS.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </optgroup>
    </select>
  );
}

function Slider({ label, value, min, max, step = 1, unit = "", onChange }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-[#1E1A16]/60 mb-1">
        <span>{label}</span>
        <span>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#B8935A]"
      />
    </div>
  );
}

export default function TypographySystemDemo() {
  useGoogleFonts(ALL_FONTS);
  const [settings, setSettings] = useState(DEFAULTS);
  const [activeRole, setActiveRole] = useState("heading");
  const active = settings[activeRole];

  const update = (patch) =>
    setSettings((prev) => ({ ...prev, [activeRole]: { ...prev[activeRole], ...patch } }));

  const applyToAll = () => {
    setSettings((prev) => {
      const next = {};
      for (const r of ROLES) {
        next[r.key] = { ...prev[r.key], font: active.font };
      }
      return next;
    });
  };

  const reset = () => setSettings(DEFAULTS);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7]" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="max-w-md mx-auto px-6 py-10">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-2">PHASE 4 — TYPOGRAPHY SYSTEM</p>
        <h1 className="text-2xl text-[#1E1A16] mb-6" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
          الخطوط والطباعة
        </h1>

        {/* role tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => setActiveRole(r.key)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                activeRole === r.key
                  ? "bg-[#1E1A16] text-white"
                  : "bg-white text-[#1E1A16]/70 border border-[#E7D9BE]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* controls */}
        <div className="bg-white rounded-2xl border border-[#E7D9BE] p-5 flex flex-col gap-4 mb-5">
          <div>
            <p className="text-[11px] text-[#1E1A16]/60 mb-1">الخط</p>
            <FontSelect value={active.font} onChange={(f) => update({ font: f })} />
          </div>
          <Slider label="حجم الخط" value={active.size} min={10} max={64} unit="px" onChange={(v) => update({ size: v })} />
          <Slider label="سُمك الخط" value={active.weight} min={300} max={700} step={100} onChange={(v) => update({ weight: v })} />
          <Slider label="تباعد الأحرف" value={active.spacing} min={0} max={8} unit="px" onChange={(v) => update({ spacing: v })} />

          <div>
            <p className="text-[11px] text-[#1E1A16]/60 mb-2">لون الخط</p>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => update({ color: c })}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                    active.color === c ? "border-[#1E1A16]" : "border-black/10"
                  }`}
                  style={{ background: c }}
                  aria-label={c}
                >
                  {active.color === c && (
                    <Check size={12} color={c === "#FFFFFF" || c === "#F6F1E7" || c === "#E7D9BE" ? "#1E1A16" : "#fff"} />
                  )}
                </button>
              ))}
              <label className="relative w-7 h-7 rounded-full border-2 border-dashed border-[#1E1A16]/30 overflow-hidden cursor-pointer flex items-center justify-center text-[10px] text-[#1E1A16]/50">
                +
                <input
                  type="color"
                  value={active.color}
                  onChange={(e) => update({ color: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
              <span
                className="ml-1 text-[11px] text-[#1E1A16]/50 tabular-nums"
                style={{ fontFamily: "monospace" }}
              >
                {active.color}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[11px] text-[#1E1A16]/60 mb-2">المحاذاة</p>
            <div className="flex gap-2">
              {[["right", "يمين"], ["center", "وسط"], ["left", "يسار"]].map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => update({ align: val })}
                  className={`flex-1 py-1.5 rounded-lg text-xs border ${
                    active.align === val
                      ? "bg-[#B8935A] text-white border-[#B8935A]"
                      : "border-[#E7D9BE] text-[#1E1A16]/70"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={applyToAll}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#1E1A16] text-white py-2 rounded-full text-xs"
            >
              <Type size={13} /> تطبيق هذا الخط على الكل
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-full text-xs border border-[#E7D9BE] text-[#1E1A16]/60"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* live preview of ALL roles at once */}
        <div className="bg-[#1E1A16] rounded-2xl p-6 flex flex-col gap-5">
          <p className="text-[#E7D9BE]/50 text-[10px] tracking-[0.3em]">معاينة حية</p>
          {ROLES.map((r) => {
            const s = settings[r.key];
            return (
              <div key={r.key} style={{ textAlign: s.align }}>
                <p className="text-[#B8935A] text-[10px] mb-1">{r.label}</p>
                <p
                  style={{
                    fontFamily: `'${s.font}'`,
                    fontSize: `${s.size}px`,
                    fontWeight: s.weight,
                    letterSpacing: `${s.spacing}px`,
                    color: s.color,
                    lineHeight: 1.4,
                  }}
                >
                  {r.sample}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
