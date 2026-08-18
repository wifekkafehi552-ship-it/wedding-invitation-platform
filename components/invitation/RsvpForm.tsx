"use client";

import { useState } from "react";
import type { Guest, Wedding } from "@/types/wedding";
import { submitRsvp } from "@/app/invite/[slug]/actions";

export function RsvpForm({ wedding, guest }: { wedding: Wedding; guest?: Guest }) {
  const [attendance, setAttendance] = useState<"attending" | "declined" | null>(null);
  const [count, setCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const maxGuests = guest?.max_guests ?? 5;

  const submit = async () => {
    if (!attendance) return;
    if (attendance === "attending" && count > maxGuests) {
      setError(`هذا الرابط يسمح بتأكيد حضور ${maxGuests} أشخاص فقط.`);
      return;
    }
    setPending(true);
    try {
      await submitRsvp({
        weddingId: wedding.id,
        guestId: guest?.id,
        guestName: guest?.name,
        attendance,
        numberOfGuests: attendance === "attending" ? count : 0,
        notes,
      });
      setSubmitted(true);
    } finally {
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-[40vh] flex items-center justify-center px-6 py-16 text-center">
        <p>
          {attendance === "declined"
            ? "سنفتقد حضورك ❤️\nشكراً لك على محبتك وتمنياتك الجميلة."
            : "شكراً لك ❤️\nنتشرف بحضورك ومشاركتنا هذه اللحظة المميزة."}
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-[40vh] flex flex-col items-center justify-center px-6 py-16 text-center gap-4">
      <p>هل ستشاركوننا فرحتنا؟ ❤️</p>
      <div className="flex gap-3">
        <button
          onClick={() => setAttendance("attending")}
          className={`px-5 py-2 rounded-full text-sm border ${attendance === "attending" ? "bg-[#1E1A16] text-white" : "border-[#1E1A16]/30"}`}
        >
          نعم، سأحضر
        </button>
        <button
          onClick={() => setAttendance("declined")}
          className={`px-5 py-2 rounded-full text-sm border ${attendance === "declined" ? "bg-[#1E1A16] text-white" : "border-[#1E1A16]/30"}`}
        >
          للأسف لن أتمكن من الحضور
        </button>
      </div>

      {attendance === "attending" && (
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm">
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <textarea
            placeholder="ملاحظات (اختياري)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="border border-[#E7D9BE] rounded-lg px-3 py-2 text-sm resize-none"
          />
        </div>
      )}

      {error && <p className="text-[#5B1F23] text-xs">{error}</p>}

      <button
        disabled={!attendance || pending}
        onClick={submit}
        className="bg-[#1E1A16] text-white px-8 py-2.5 rounded-full text-sm disabled:opacity-40"
      >
        {pending ? "جارٍ الإرسال..." : "تأكيد الحضور"}
      </button>
    </section>
  );
}
