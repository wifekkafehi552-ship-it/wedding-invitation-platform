import React, { useState, useEffect, useMemo } from "react";
import { Search, Download, Check, X as XIcon, Clock } from "lucide-react";

/**
 * PHASE 9 — RSVP + Guests
 *
 * Data model matches spec's `guests` + `rsvps` tables. Two halves:
 *  1) Public RSVP form (what a guest sees at /invite/mohamed-sara/ahmed)
 *  2) Dashboard guest table (search / filter / sort / export CSV)
 * Submitting the public form updates the same array the dashboard reads,
 * so you can flip between them and see the table update live.
 */

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

const seedGuests = [
  { id: 1, name: "أحمد بن علي", personal_slug: "ahmed", max_guests: 3, status: "confirmed", number_of_guests: 2, notes: "", rsvp_date: "2026-07-02" },
  { id: 2, name: "ليلى المصري", personal_slug: "leila", max_guests: 2, status: "confirmed", number_of_guests: 1, notes: "نباتية", rsvp_date: "2026-07-04" },
  { id: 3, name: "يوسف الشريف", personal_slug: "youssef", max_guests: 4, status: "declined", number_of_guests: 0, notes: "", rsvp_date: "2026-07-05" },
  { id: 4, name: "منى الحداد", personal_slug: "mona", max_guests: 1, status: "pending", number_of_guests: 0, notes: "", rsvp_date: "" },
  { id: 5, name: "كريم زيدان", personal_slug: "karim", max_guests: 5, status: "pending", number_of_guests: 0, notes: "", rsvp_date: "" },
];

const STATUS_LABEL = { confirmed: "مؤكد", declined: "معتذر", pending: "بانتظار الرد" };
const STATUS_COLOR = { confirmed: "#1E7A4C", declined: "#5B1F23", pending: "#B8935A" };

/* --------------------------- Public RSVP form --------------------------- */
function PublicRsvpForm({ guest, onSubmit }) {
  const [attendance, setAttendance] = useState(null); // "yes" | "no"
  const [count, setCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(guest.status !== "pending");

  const submit = () => {
    if (count > guest.max_guests) {
      setError(`هذا الرابط يسمح بتأكيد حضور ${guest.max_guests} أشخاص فقط.`);
      return;
    }
    onSubmit({ status: attendance === "yes" ? "confirmed" : "declined", number_of_guests: attendance === "yes" ? count : 0, notes });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-[#E7D9BE] p-8 text-center">
        {guest.status === "declined" ? (
          <p className="text-[#1E1A16]">سنفتقد حضورك ❤️<br />شكراً لك على محبتك وتمنياتك الجميلة.</p>
        ) : (
          <p className="text-[#1E1A16]">شكراً لك ❤️<br />نتشرف بحضورك ومشاركتنا هذه اللحظة المميزة.</p>
        )}
        <p className="text-xs text-[#1E1A16]/40 mt-4">لقد تم تسجيل تأكيد حضورك مسبقاً.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E7D9BE] p-6">
      <p className="text-[#1E1A16] text-center mb-1">{guest.name}،</p>
      <p className="text-[#1E1A16]/70 text-sm text-center mb-6">هل ستشاركوننا فرحتنا؟ ❤️</p>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setAttendance("yes")}
          className={`flex-1 py-2.5 rounded-full text-sm border ${attendance === "yes" ? "bg-[#1E1A16] text-white border-[#1E1A16]" : "border-[#E7D9BE] text-[#1E1A16]/70"}`}
        >
          نعم، سأحضر
        </button>
        <button
          onClick={() => setAttendance("no")}
          className={`flex-1 py-2.5 rounded-full text-sm border ${attendance === "no" ? "bg-[#1E1A16] text-white border-[#1E1A16]" : "border-[#E7D9BE] text-[#1E1A16]/70"}`}
        >
          للأسف لن أتمكن
        </button>
      </div>

      {attendance === "yes" && (
        <div className="flex flex-col gap-3 mb-4">
          <div>
            <p className="text-[11px] text-[#1E1A16]/60 mb-1">عدد الحضور (بحد أقصى {guest.max_guests})</p>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm"
            >
              {Array.from({ length: guest.max_guests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="ملاحظات (اختياري)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm resize-none"
          />
        </div>
      )}

      {error && <p className="text-[#5B1F23] text-xs mb-3">{error}</p>}

      <button
        disabled={!attendance}
        onClick={submit}
        className="w-full bg-[#1E1A16] text-white py-2.5 rounded-full text-sm disabled:opacity-40"
      >
        تأكيد الحضور
      </button>
    </div>
  );
}

/* --------------------------- Dashboard guest table --------------------------- */
function GuestsDashboard({ guests, onDataChange }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");

  const filtered = useMemo(() => {
    let list = guests.filter((g) => g.name.includes(query));
    if (filter !== "all") list = list.filter((g) => g.status === filter);
    return [...list].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name, "ar");
      if (sortKey === "guests") return b.number_of_guests - a.number_of_guests;
      return 0;
    });
  }, [guests, query, filter, sortKey]);

  const totals = useMemo(() => {
    const confirmed = guests.filter((g) => g.status === "confirmed");
    return {
      total: guests.length,
      confirmed: confirmed.length,
      declined: guests.filter((g) => g.status === "declined").length,
      pending: guests.filter((g) => g.status === "pending").length,
      totalGuests: confirmed.reduce((s, g) => s + g.number_of_guests, 0),
    };
  }, [guests]);

  const exportCsv = () => {
    const header = "Name,Status,NumberOfGuests,Notes,RSVPDate\n";
    const rows = guests
      .map((g) => `"${g.name}","${STATUS_LABEL[g.status]}",${g.number_of_guests},"${g.notes}","${g.rsvp_date}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guests.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7] px-6 py-10" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-2">PHASE 9 — GUESTS &amp; RSVP</p>
        <h1 className="text-2xl text-[#1E1A16] mb-6" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
          إدارة المدعوين
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-[#E7D9BE] p-3 text-center">
            <p className="text-xl text-[#1E1A16]">{totals.total}</p>
            <p className="text-[10px] text-[#1E1A16]/50">دعوات</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E7D9BE] p-3 text-center">
            <p className="text-xl text-[#1E7A4C]">{totals.confirmed}</p>
            <p className="text-[10px] text-[#1E1A16]/50">مؤكدة</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E7D9BE] p-3 text-center">
            <p className="text-xl text-[#5B1F23]">{totals.declined}</p>
            <p className="text-[10px] text-[#1E1A16]/50">معتذرة</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E7D9BE] p-3 text-center">
            <p className="text-xl text-[#B8935A]">{totals.totalGuests}</p>
            <p className="text-[10px] text-[#1E1A16]/50">إجمالي الضيوف</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1A16]/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن مدعو..."
              className="w-full bg-white border border-[#E7D9BE] rounded-lg pr-9 pl-3 py-2 text-sm"
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-white border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm">
            <option value="all">الكل</option>
            <option value="confirmed">مؤكد</option>
            <option value="declined">معتذر</option>
            <option value="pending">بانتظار الرد</option>
          </select>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className="bg-white border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm">
            <option value="name">ترتيب: الاسم</option>
            <option value="guests">ترتيب: عدد الضيوف</option>
          </select>
          <button onClick={exportCsv} className="flex items-center gap-1.5 bg-[#1E1A16] text-white px-4 py-2 rounded-lg text-sm shrink-0">
            <Download size={14} /> CSV
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E7D9BE] overflow-hidden">
          {filtered.length === 0 && (
            <p className="text-center text-[#1E1A16]/40 text-sm py-10">لا يوجد مدعوون مطابقون</p>
          )}
          {filtered.map((g) => (
            <div key={g.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#E7D9BE] last:border-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${STATUS_COLOR[g.status]}1A`, color: STATUS_COLOR[g.status] }}
              >
                {g.status === "confirmed" && <Check size={14} />}
                {g.status === "declined" && <XIcon size={14} />}
                {g.status === "pending" && <Clock size={13} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1E1A16] truncate">{g.name}</p>
                <p className="text-[11px] text-[#1E1A16]/40">/invite/mohamed-sara/{g.personal_slug}</p>
              </div>
              <div className="text-left shrink-0">
                <p className="text-xs" style={{ color: STATUS_COLOR[g.status] }}>{STATUS_LABEL[g.status]}</p>
                {g.status === "confirmed" && <p className="text-[10px] text-[#1E1A16]/40">{g.number_of_guests} أشخاص</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RsvpGuestsDemo() {
  useGoogleFonts();
  const [guests, setGuests] = useState(seedGuests);
  const [mode, setMode] = useState("dashboard"); // "dashboard" | "rsvp"
  const demoGuest = guests.find((g) => g.id === 4); // منى — pending, to demo the flow

  const updateGuest = (patch) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === demoGuest.id ? { ...g, ...patch, rsvp_date: new Date().toISOString().slice(0, 10) } : g))
    );
  };

  return (
    <div>
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => setMode("dashboard")}
          className={`text-xs px-3 py-1.5 rounded-full shadow ${mode === "dashboard" ? "bg-[#1E1A16] text-white" : "bg-white text-[#1E1A16]"}`}
        >
          لوحة التحكم
        </button>
        <button
          onClick={() => setMode("rsvp")}
          className={`text-xs px-3 py-1.5 rounded-full shadow ${mode === "rsvp" ? "bg-[#1E1A16] text-white" : "bg-white text-[#1E1A16]"}`}
        >
          نموذج الضيف (منى)
        </button>
      </div>

      {mode === "dashboard" ? (
        <GuestsDashboard guests={guests} />
      ) : (
        <div dir="rtl" className="min-h-screen bg-[#F6F1E7] flex items-center justify-center px-6" style={{ fontFamily: "'Cairo', sans-serif" }}>
          <div className="w-full max-w-sm">
            <PublicRsvpForm guest={demoGuest} onSubmit={updateGuest} />
          </div>
        </div>
      )}
    </div>
  );
}
