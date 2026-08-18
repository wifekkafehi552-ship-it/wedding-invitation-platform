import React, { useState, useEffect } from "react";
import { FileStack, Palette, Eye, EyeOff, Menu, X } from "lucide-react";

/**
 * PHASE 12 — Live Editor
 * Desktop: Pages (left) | Live Preview (center) | Settings (right)
 * Mobile:  Pages -> Preview -> Settings (stacked, switch with tabs)
 *
 * This wires together Phase 3 (pages enable/order), Phase 4 (typography/
 * color), and the invitation renderer into one Website-Builder screen —
 * every change on the left/right panels re-renders the center instantly.
 */

function useGoogleFonts() {
  useEffect(() => {
    const id = "wedding-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const wedding = { groom: "محمد", bride: "سارة", dateLabel: "12 سبتمبر 2026" };

const PAGE_LABELS = { cover: "الغلاف", couple: "العروسين", details: "تفاصيل الحفل", rsvp: "تأكيد الحضور" };

const initialPages = [
  { id: "cover", enabled: true },
  { id: "couple", enabled: true },
  { id: "details", enabled: true },
  { id: "rsvp", enabled: true },
];

export default function LiveEditorDemo() {
  useGoogleFonts();
  const [pages, setPages] = useState(initialPages);
  const [primary, setPrimary] = useState("#B8935A");
  const [bg, setBg] = useState("#F6F1E7");
  const [namesFont, setNamesFont] = useState("Aref Ruqaa");
  const [mobileTab, setMobileTab] = useState("preview"); // pages | preview | settings

  const toggle = (id) => setPages((p) => p.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)));

  const Preview = (
    <div className="h-full overflow-y-auto rounded-xl" style={{ background: bg }}>
      {pages.find((p) => p.id === "cover")?.enabled && (
        <section className="min-h-[220px] flex flex-col items-center justify-center text-center px-4 py-8" style={{ background: "#1E1A16" }}>
          <p className="text-[10px] tracking-[0.3em]" style={{ color: primary }}>دعوة زفاف</p>
          <h1 className="text-2xl mt-2 text-white" style={{ fontFamily: `'${namesFont}'` }}>
            {wedding.groom} &amp; {wedding.bride}
          </h1>
        </section>
      )}
      {pages.find((p) => p.id === "couple")?.enabled && (
        <section className="min-h-[180px] flex flex-col items-center justify-center text-center px-4 py-8">
          <h2 className="text-xl" style={{ fontFamily: `'${namesFont}'`, color: "#1E1A16" }}>
            {wedding.groom} <span style={{ color: primary }}>&</span> {wedding.bride}
          </h2>
          <p className="text-[11px] text-[#1E1A16]/60 mt-2">يسعدنا دعوتكم لمشاركتنا فرحة زفافنا</p>
        </section>
      )}
      {pages.find((p) => p.id === "details")?.enabled && (
        <section className="min-h-[120px] flex flex-col items-center justify-center text-center px-4 py-6" style={{ background: `${primary}15` }}>
          <p className="text-xs" style={{ color: "#1E1A16" }}>{wedding.dateLabel} — الساعة 7:00 مساءً</p>
        </section>
      )}
      {pages.find((p) => p.id === "rsvp")?.enabled && (
        <section className="min-h-[140px] flex flex-col items-center justify-center text-center px-4 py-8">
          <p className="text-xs text-[#1E1A16] mb-3">هل ستشاركوننا فرحتنا؟ ❤️</p>
          <button className="text-white text-xs px-4 py-2 rounded-full" style={{ background: primary }}>نعم، سأحضر</button>
        </section>
      )}
      {pages.every((p) => !p.enabled) && (
        <div className="h-full flex items-center justify-center text-[#1E1A16]/40 text-xs py-20">فعّل صفحة واحدة على الأقل لرؤية المعاينة</div>
      )}
    </div>
  );

  const PagesPanel = (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] text-[#1E1A16]/50 mb-1">اسحب لإعادة الترتيب (Phase 3) وفعّل/عطّل هنا</p>
      {pages.map((p) => (
        <button
          key={p.id}
          onClick={() => toggle(p.id)}
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm border ${p.enabled ? "bg-white border-[#E7D9BE] text-[#1E1A16]" : "bg-[#1E1A16]/5 border-transparent text-[#1E1A16]/40"}`}
        >
          {PAGE_LABELS[p.id]}
          {p.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      ))}
    </div>
  );

  const SettingsPanel = (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] text-[#1E1A16]/50 mb-1">اللون الأساسي</p>
        <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="w-full h-9 rounded-lg border border-[#E7D9BE] cursor-pointer" />
      </div>
      <div>
        <p className="text-[11px] text-[#1E1A16]/50 mb-1">لون الخلفية</p>
        <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-9 rounded-lg border border-[#E7D9BE] cursor-pointer" />
      </div>
      <div>
        <p className="text-[11px] text-[#1E1A16]/50 mb-1">خط الأسماء</p>
        <select value={namesFont} onChange={(e) => setNamesFont(e.target.value)} className="w-full border border-[#E7D9BE] rounded-lg px-2 py-2 text-sm">
          {["Aref Ruqaa", "Amiri", "Cairo"].map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7]" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="px-4 py-3 border-b border-[#E7D9BE] flex items-center justify-between">
        <p className="text-[#B8935A] tracking-[0.25em] text-[10px]">PHASE 12 — LIVE EDITOR</p>
        <button className="text-xs bg-[#1E1A16] text-white px-4 py-1.5 rounded-full">حفظ كمسودة</button>
      </div>

      {/* Desktop: 3-pane */}
      <div className="hidden md:grid grid-cols-[220px_1fr_260px] gap-4 p-4 h-[calc(100vh-56px)]">
        <div className="bg-white rounded-xl border border-[#E7D9BE] p-4 overflow-y-auto">
          <p className="flex items-center gap-2 text-xs text-[#1E1A16]/50 mb-3"><FileStack size={13} /> الصفحات</p>
          {PagesPanel}
        </div>
        <div className="bg-[#1E1A16]/5 rounded-xl p-3">{Preview}</div>
        <div className="bg-white rounded-xl border border-[#E7D9BE] p-4 overflow-y-auto">
          <p className="flex items-center gap-2 text-xs text-[#1E1A16]/50 mb-3"><Palette size={13} /> الإعدادات</p>
          {SettingsPanel}
        </div>
      </div>

      {/* Mobile: stacked with tab switch */}
      <div className="md:hidden">
        <div className="flex border-b border-[#E7D9BE]">
          {[["pages", "الصفحات"], ["preview", "المعاينة"], ["settings", "الإعدادات"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              className={`flex-1 py-2.5 text-xs ${mobileTab === id ? "text-[#B8935A] border-b-2 border-[#B8935A]" : "text-[#1E1A16]/50"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {mobileTab === "pages" && PagesPanel}
          {mobileTab === "preview" && <div className="h-[60vh]">{Preview}</div>}
          {mobileTab === "settings" && SettingsPanel}
        </div>
      </div>
    </div>
  );
}
