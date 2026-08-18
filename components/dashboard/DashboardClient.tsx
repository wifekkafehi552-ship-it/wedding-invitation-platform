"use client";

import { useState, useTransition } from "react";
import type { WeddingBundle } from "@/types/wedding";
import type { TemplateProps } from "@/components/templates/registry";
import {
  updatePages,
  updateFamily,
  updateTypography,
  updateTemplate,
  updateWeddingCore,
} from "@/app/(dashboard)/dashboard/[slug]/actions";
import { Eye, EyeOff, Check, ExternalLink } from "lucide-react";
import type { ComponentType } from "react";

const OPENING_TEXT_PRESETS = [
  { label: "بسم الله الرحمن الرحيم", text: "بسم الله الرحمن الرحيم" },
  {
    label: "بسم الله + آية",
    text: "بسم الله الرحمن الرحيم\nوَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
  },
  {
    label: "وجعلنا بينكم مودة",
    text: "وَجَعَلْنَا بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
  },
];

const PAGE_LABELS: Record<string, string> = {
  cover: "الغلاف",
  family: "دعوة العائلة",
  couple: "العروسين",
  details: "تفاصيل الحفل",
  countdown: "العد التنازلي",
  story: "قصتنا",
  gallery: "معرض الصور",
  rsvp: "تأكيد الحضور",
  location: "الموقع",
  final: "الرسالة الختامية",
};

interface Props {
  slug: string;
  bundle: WeddingBundle;
  templates: { id: string; name: string; description: string; Component: ComponentType<TemplateProps> }[];
}

export default function DashboardClient({ slug, bundle, templates }: Props) {
  const [tab, setTab] = useState<"overview" | "pages" | "family" | "typography" | "templates">("overview");
  const [pending, startTransition] = useTransition();

  // local editable copies — saved explicitly via server actions
  const [pages, setPages] = useState(bundle.pages);
  const [core, setCore] = useState({
    groom_name: bundle.wedding.groom_name,
    bride_name: bundle.wedding.bride_name,
    wedding_date: bundle.wedding.wedding_date ?? "",
    wedding_time: bundle.wedding.wedding_time ?? "",
    venue_name: bundle.wedding.venue_name ?? "",
    status: bundle.wedding.status,
  });
  const [family, setFamily] = useState(bundle.family);
  const [typo, setTypo] = useState(bundle.typography);
  const [templateId, setTemplateId] = useState(bundle.wedding.template_id ?? "royal-gold");

  const togglePage = (id: string) =>
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));

  const movePage = (index: number, dir: -1 | 1) => {
    setPages((prev) => {
      const arr = [...prev];
      const j = index + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[index], arr[j]] = [arr[j], arr[index]];
      return arr.map((p, i) => ({ ...p, sort_order: i }));
    });
  };

  const savePages = () =>
    startTransition(() =>
      updatePages(slug, pages.map((p) => ({ id: p.id, enabled: p.enabled, sort_order: p.sort_order })))
    );

  const saveCore = () => startTransition(() => updateWeddingCore(slug, { wedding_id: bundle.wedding.id, ...core }));

  const saveFamily = () =>
    startTransition(() =>
      updateFamily(slug, {
        wedding_id: bundle.wedding.id,
        groom_father_name: family.groom_father_name ?? undefined,
        bride_father_name: family.bride_father_name ?? undefined,
        enabled: family.enabled,
        style: family.style,
        custom_text: family.custom_text ?? undefined,
        opening_text: family.opening_text ?? undefined,
      })
    );

  const saveTypo = () => {
    const payload = { ...typo, wedding_id: bundle.wedding.id };
    startTransition(() => updateTypography(slug, payload));
  };

  const saveTemplate = (id: string) => {
    setTemplateId(id);
    startTransition(() => updateTemplate(slug, { wedding_id: bundle.wedding.id, template_id: id }));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7]" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <header className="bg-white border-b border-[#E7D9BE] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-[#B8935A] text-[10px] tracking-[0.2em]">لوحة التحكم</p>
          <p className="text-[#1E1A16]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
            {bundle.wedding.groom_name} &amp; {bundle.wedding.bride_name}
          </p>
        </div>
        <a
          href={`/invite/${slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-[#1E1A16]/60 border border-[#E7D9BE] rounded-full px-3 py-1.5"
        >
          <ExternalLink size={13} /> عرض الدعوة
        </a>
      </header>

      <nav className="flex gap-2 px-5 py-3 overflow-x-auto bg-white border-b border-[#E7D9BE]">
        {[
          ["overview", "عام"],
          ["pages", "الصفحات"],
          ["templates", "القوالب"],
          ["family", "العائلة"],
          ["typography", "الخطوط"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id as typeof tab)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs ${
              tab === id ? "bg-[#1E1A16] text-white" : "bg-[#F6F1E7] text-[#1E1A16]/70"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="p-5 max-w-xl mx-auto">
        {tab === "overview" && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-[#E7D9BE] p-5 flex flex-col gap-3">
              <Field label="اسم العريس" value={core.groom_name} onChange={(v) => setCore((c) => ({ ...c, groom_name: v }))} />
              <Field label="اسم العروس" value={core.bride_name} onChange={(v) => setCore((c) => ({ ...c, bride_name: v }))} />
              <Field label="تاريخ الزفاف" type="date" value={core.wedding_date} onChange={(v) => setCore((c) => ({ ...c, wedding_date: v }))} />
              <Field label="وقت الزفاف" type="time" value={core.wedding_time} onChange={(v) => setCore((c) => ({ ...c, wedding_time: v }))} />
              <Field label="مكان الحفل" value={core.venue_name} onChange={(v) => setCore((c) => ({ ...c, venue_name: v }))} />
              <div>
                <p className="text-[11px] text-[#1E1A16]/60 mb-1">الحالة</p>
                <div className="flex gap-2">
                  {(["draft", "published"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setCore((c) => ({ ...c, status: s }))}
                      className={`flex-1 py-2 rounded-lg text-xs border ${
                        core.status === s ? "bg-[#B8935A] text-white border-[#B8935A]" : "border-[#E7D9BE] text-[#1E1A16]/70"
                      }`}
                    >
                      {s === "draft" ? "مسودة" : "منشورة"}
                    </button>
                  ))}
                </div>
              </div>
              <SaveButton onClick={saveCore} pending={pending} />
            </div>
          </div>
        )}

        {tab === "pages" && (
          <div className="flex flex-col gap-4">
            <p className="text-[11px] text-[#1E1A16]/50">فعّل/عطّل واستخدم الأسهم لإعادة الترتيب</p>
            <div className="flex flex-col gap-2">
              {pages
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 bg-white rounded-xl border px-4 py-3 ${
                      p.enabled ? "border-[#E7D9BE]" : "border-[#E7D9BE]/50 opacity-50"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => movePage(i, -1)} className="text-[#B8935A] text-xs">▲</button>
                      <button onClick={() => movePage(i, 1)} className="text-[#B8935A] text-xs">▼</button>
                    </div>
                    <span className="flex-1 text-sm text-[#1E1A16]">{PAGE_LABELS[p.page_type]}</span>
                    <button onClick={() => togglePage(p.id)} className={p.enabled ? "text-[#B8935A]" : "text-[#1E1A16]/40"}>
                      {p.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                ))}
            </div>
            <SaveButton onClick={savePages} pending={pending} />
          </div>
        )}

        {tab === "templates" && (
          <div className="grid gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => saveTemplate(t.id)}
                className={`text-right rounded-xl border-2 p-4 bg-white ${
                  templateId === t.id ? "border-[#B8935A]" : "border-transparent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#1E1A16]">{t.name}</span>
                  {templateId === t.id && <Check size={15} className="text-[#B8935A]" />}
                </div>
                <p className="text-xs text-[#1E1A16]/60 mt-1">{t.description}</p>
              </button>
            ))}
          </div>
        )}

        {tab === "family" && (
          <div className="bg-white rounded-2xl border border-[#E7D9BE] p-5 flex flex-col gap-3">
            <ToggleRow label="تفعيل صفحة العائلة" value={family.enabled} onChange={(v) => setFamily((f) => ({ ...f, enabled: v }))} />
            <div>
              <p className="text-[11px] text-[#1E1A16]/60 mb-2">نص افتتاحي (يظهر قبل أسماء العائلة مباشرة)</p>
              <div className="grid gap-2 mb-2">
                {OPENING_TEXT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setFamily((f) => ({ ...f, opening_text: preset.text }))}
                    className={`text-right rounded-lg border px-3 py-2 text-xs ${
                      family.opening_text === preset.text ? "border-[#B8935A] bg-[#B8935A]/10" : "border-[#E7D9BE]"
                    }`}
                  >
                    <p className="text-[10px] text-[#B8935A] mb-1">{preset.label}</p>
                    <p className="whitespace-pre-line leading-relaxed text-[#1E1A16]">{preset.text}</p>
                  </button>
                ))}
              </div>
              <textarea
                value={family.opening_text ?? ""}
                onChange={(e) => setFamily((f) => ({ ...f, opening_text: e.target.value }))}
                rows={3}
                placeholder="أو اكتب نصك الخاص..."
                className="w-full border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>
            <Field label="اسم والد العريس" value={family.groom_father_name ?? ""} onChange={(v) => setFamily((f) => ({ ...f, groom_father_name: v }))} />
            <Field label="اسم والد العروس" value={family.bride_father_name ?? ""} onChange={(v) => setFamily((f) => ({ ...f, bride_father_name: v }))} />
            <div>
              <p className="text-[11px] text-[#1E1A16]/60 mb-2">الصيغة</p>
              <div className="grid grid-cols-2 gap-2">
                {(["style1", "style2", "style3", "custom"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFamily((f) => ({ ...f, style: s }))}
                    className={`py-2 rounded-lg text-xs border ${
                      family.style === s ? "bg-[#1E1A16] text-white border-[#1E1A16]" : "border-[#E7D9BE] text-[#1E1A16]/70"
                    }`}
                  >
                    {s === "custom" ? "نص مخصص" : s}
                  </button>
                ))}
              </div>
            </div>
            {family.style === "custom" && (
              <textarea
                value={family.custom_text ?? ""}
                onChange={(e) => setFamily((f) => ({ ...f, custom_text: e.target.value }))}
                rows={4}
                className="border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm resize-none"
              />
            )}
            <SaveButton onClick={saveFamily} pending={pending} />
          </div>
        )}

        {tab === "typography" && (
          <div className="bg-white rounded-2xl border border-[#E7D9BE] p-5 flex flex-col gap-3">
            {(["heading", "body", "names", "family", "button"] as const).map((role) => (
              <div key={role} className="flex gap-2 items-center">
                <span className="text-xs text-[#1E1A16]/60 w-16 shrink-0">{role}</span>
                <input
                  value={(typo as any)[`${role}_font`]}
                  onChange={(e) => setTypo((t: any) => ({ ...t, [`${role}_font`]: e.target.value }))}
                  className="flex-1 border border-[#E7D9BE] rounded-lg px-2 py-1.5 text-sm"
                  placeholder="اسم الخط"
                />
                <input
                  type="color"
                  value={(typo as any)[`${role}_color`]}
                  onChange={(e) => setTypo((t: any) => ({ ...t, [`${role}_color`]: e.target.value }))}
                  className="w-9 h-9 rounded border border-[#E7D9BE]"
                />
              </div>
            ))}
            <SaveButton onClick={saveTypo} pending={pending} />
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <p className="text-[11px] text-[#1E1A16]/60 mb-1">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center justify-between text-sm text-[#1E1A16]">
      {label}
      <span className={`w-9 h-5 rounded-full relative transition-colors ${value ? "bg-[#B8935A]" : "bg-[#1E1A16]/15"}`}>
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
          style={{ right: value ? "2px" : "18px" }}
        />
      </span>
    </button>
  );
}

function SaveButton({ onClick, pending }: { onClick: () => void; pending: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="mt-2 bg-[#1E1A16] text-white py-2.5 rounded-full text-sm disabled:opacity-50"
    >
      {pending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
    </button>
  );
}
