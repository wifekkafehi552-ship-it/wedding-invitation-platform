import React, { useState, useEffect } from "react";
import { Check, ToggleLeft, ToggleRight } from "lucide-react";

/**
 * PHASE 5 — Family Invitation
 *
 * Model matches spec's `family_settings` table:
 *   { groom_father_name, bride_father_name, enabled, custom_text, style }
 *
 * 3 ready-made styles are provided as templates for `custom_text`; the owner
 * can also switch to fully custom text. Names stay editable regardless of
 * style — style only changes the surrounding wording/layout.
 */

const wedding = { groom: "محمد", bride: "سارة" };

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

const STYLES = [
  {
    id: "style1",
    label: "الصيغة 1",
    render: (g, b, groomName, brideName) => (
      <>
        <p className="text-[#1E1A16]/70 text-sm">تتشرف عائلتا</p>
        <h3 className="text-xl md:text-2xl mt-3">{g}</h3>
        <p className="text-[#B8935A] my-1">والسيد</p>
        <h3 className="text-xl md:text-2xl">{b}</h3>
        <p className="text-[#1E1A16]/70 text-sm mt-4">بدعوتكم لحضور حفل زفاف</p>
        <p className="text-lg mt-1">{groomName} &amp; {brideName}</p>
      </>
    ),
  },
  {
    id: "style2",
    label: "الصيغة 2",
    render: (g, b, groomName, brideName) => (
      <>
        <p className="text-[#1E1A16]/70 text-sm">بكل حب وسرور</p>
        <p className="text-[#1E1A16]/70 text-sm mt-1">تدعوكم عائلتا</p>
        <h3 className="text-xl md:text-2xl mt-3">{g} &amp; {b}</h3>
        <p className="text-[#1E1A16]/70 text-sm mt-4">لمشاركتهم فرحة زفاف أبنائهم</p>
        <p className="text-lg mt-1">{groomName} &amp; {brideName}</p>
      </>
    ),
  },
  {
    id: "style3",
    label: "الصيغة 3",
    render: (g, b, groomName, brideName) => (
      <>
        <p className="text-[#1E1A16]/70 text-sm">تتشرف عائلتا العروسين</p>
        <h3 className="text-xl md:text-2xl mt-3">{groomName} &amp; {brideName}</h3>
        <p className="text-[#1E1A16]/70 text-sm mt-4">بدعوتكم لمشاركتهما فرحة زفافهما</p>
      </>
    ),
  },
  { id: "custom", label: "نص مخصص", render: null },
];

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

export default function FamilyInvitationDemo() {
  useGoogleFonts();
  const [enabled, setEnabled] = useState(true);
  const [groomFather, setGroomFather] = useState("السيد فتحي الهمامي");
  const [brideFather, setBrideFather] = useState("السيد سالم القادري");
  const [styleId, setStyleId] = useState("style1");
  const [customText, setCustomText] = useState(
    "تتشرف عائلتا\nالسيد فتحي الهمامي\nوالسيد سالم القادري\nبدعوتكم لمشاركتهم فرحة زفافهما"
  );

  const activeStyle = STYLES.find((s) => s.id === styleId);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7]" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="max-w-md mx-auto px-6 py-10">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-2">PHASE 5 — FAMILY INVITATION</p>
        <h1 className="text-2xl text-[#1E1A16] mb-6" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
          صفحة دعوة العائلة
        </h1>

        {/* enable / disable */}
        <button
          onClick={() => setEnabled((e) => !e)}
          className="flex items-center gap-2 bg-white border border-[#E7D9BE] rounded-full px-4 py-2 mb-6 text-sm text-[#1E1A16]"
        >
          {enabled ? <ToggleRight size={20} className="text-[#B8935A]" /> : <ToggleLeft size={20} className="text-[#1E1A16]/40" />}
          {enabled ? "الصفحة مفعّلة" : "الصفحة معطّلة"}
        </button>

        {enabled && (
          <>
            {/* editable names */}
            <div className="bg-white rounded-2xl border border-[#E7D9BE] p-5 flex flex-col gap-4 mb-5">
              <div>
                <p className="text-[11px] text-[#1E1A16]/60 mb-1">اسم والد العريس</p>
                <input
                  value={groomFather}
                  onChange={(e) => setGroomFather(e.target.value)}
                  className="w-full border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <p className="text-[11px] text-[#1E1A16]/60 mb-1">اسم والد العروس</p>
                <input
                  value={brideFather}
                  onChange={(e) => setBrideFather(e.target.value)}
                  className="w-full border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* style picker */}
            <p className="text-[11px] text-[#1E1A16]/60 mb-2">صيغة النص</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyleId(s.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border ${
                    styleId === s.id
                      ? "bg-[#1E1A16] text-white border-[#1E1A16]"
                      : "bg-white text-[#1E1A16]/70 border-[#E7D9BE]"
                  }`}
                >
                  {s.label}
                  {styleId === s.id && <Check size={12} />}
                </button>
              ))}
            </div>

            {styleId === "custom" && (
              <div className="mb-5">
                <p className="text-[11px] text-[#1E1A16]/60 mb-1">النص المخصص</p>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={5}
                  className="w-full border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
            )}

            {/* live preview */}
            <p className="text-[11px] text-[#1E1A16]/60 mb-2">معاينة حية</p>
            <div className="bg-[#E7D9BE]/40 rounded-2xl px-6 py-10 text-center">
              {styleId === "custom" ? (
                <p className="whitespace-pre-line leading-loose text-[#1E1A16]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
                  {customText}
                </p>
              ) : (
                <div style={{ fontFamily: "'Aref Ruqaa', serif" }} className="text-[#1E1A16]">
                  {activeStyle.render(groomFather, brideFather, wedding.groom, wedding.bride)}
                </div>
              )}
              <OrnamentDivider />
            </div>
          </>
        )}

        {!enabled && (
          <p className="text-center text-[#1E1A16]/40 text-sm py-16">
            صفحة دعوة العائلة لن تظهر في الدعوة العامة
          </p>
        )}
      </div>
    </div>
  );
}
