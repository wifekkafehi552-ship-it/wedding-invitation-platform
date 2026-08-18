import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";

/**
 * PHASE 1 — Design System + Public Invitation UI (Cover + Hero + Countdown)
 * Demo Wedding: Mohamed & Sara — 12 September 2026
 *
 * Design tokens
 * - ivory:    #F6F1E7  (base background)
 * - ink:      #1E1A16  (near-black text, warm not cold)
 * - gold:     #B8935A  (soft, desaturated gold — not neon/cliché)
 * - champagne:#E7D9BE  (secondary surfaces)
 * - burgundy: #5B1F23  (single deep accent, used sparingly)
 *
 * Type
 * - Arabic display: 'Aref Ruqaa' (calligraphic, ceremonial)
 * - Arabic body:    'Cairo'
 * - Latin display:  'Cormorant Garamond'
 * - Latin body:      'Poppins'
 *
 * Signature element: a hand-drawn-style gold "ornament divider" (SVG) that
 * separates every section instead of generic numbered markers — echoes the
 * henna/mandala motifs used in Arabic wedding invitations.
 */

const wedding = {
  groom: "محمد",
  groomLatin: "Mohamed",
  bride: "سارة",
  brideLatin: "Sara",
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
      "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

function OrnamentDivider({ light = false }) {
  const stroke = light ? "#E7D9BE" : "#B8935A";
  return (
    <svg
      viewBox="0 0 220 24"
      className="mx-auto w-40 h-5 my-4"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 12 C 40 2, 60 22, 90 12 C 100 8, 105 8, 110 12 C 115 16, 120 16, 130 12 C 160 2, 180 22, 218 12"
        stroke={stroke}
        strokeWidth="1.2"
      />
      <circle cx="110" cy="12" r="3" fill={stroke} />
    </svg>
  );
}

function useCountdown(target) {
  const [left, setLeft] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => {
      setLeft(Math.max(0, target.getTime() - Date.now()));
    }, 1000);
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

function CountdownBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-[64px]">
      <div
        className="text-2xl md:text-3xl tabular-nums text-[#F6F1E7]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        className="text-[10px] md:text-xs tracking-[0.25em] text-[#E7D9BE]/70 mt-1"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        {label}
      </div>
    </div>
  );
}

export default function WeddingInvitation() {
  useGoogleFonts();
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef(null);
  const target = useRef(new Date(wedding.date)).current;
  const cd = useCountdown(target);

  const openInvitation = () => {
    setOpened(true);
    setMuted(false);
    // audioRef.current?.play().catch(() => {});
  };

  return (
    <div
      dir="rtl"
      className="relative w-full min-h-screen bg-[#F6F1E7] text-[#1E1A16] overflow-x-hidden"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      {/* audio element placeholder — wired up once music upload exists (Phase 10) */}
      <audio ref={audioRef} loop muted={muted} src="" />

      {/* ---------------- COVER / INTRO SCREEN ---------------- */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center text-center transition-all duration-[1400ms] ease-out ${
          opened ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
        }`}
      >
        <img
          src={wedding.coverImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 px-6">
          <p
            className="text-[#E7D9BE] tracking-[0.35em] text-xs md:text-sm mb-6 animate-[fadeIn_1.5s_ease-out]"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            دعوة زفاف
          </p>
          <h1
            className="text-white text-5xl md:text-7xl leading-tight"
            style={{ fontFamily: "'Aref Ruqaa', serif" }}
          >
            {wedding.groom} <span className="text-[#B8935A]">&</span> {wedding.bride}
          </h1>
          <OrnamentDivider light />
          <p className="text-[#E7D9BE]/90 text-sm md:text-base max-w-xs mx-auto mt-2">
            يسعدنا أن نشارككم أجمل لحظات حياتنا
          </p>

          <button
            onClick={openInvitation}
            className="mt-10 inline-flex items-center gap-2 border border-[#B8935A] text-[#F6F1E7] px-8 py-3 rounded-full text-sm tracking-wide hover:bg-[#B8935A] hover:text-[#1E1A16] transition-colors duration-500"
          >
            افتح دعوتك ✨
          </button>
        </div>
      </div>

      {/* ---------------- MAIN INVITATION ---------------- */}
      <div
        className={`transition-opacity duration-[1200ms] ${
          opened ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* mute toggle */}
        <button
          onClick={() => setMuted((m) => !m)}
          className="fixed top-4 left-4 z-30 w-10 h-10 rounded-full bg-[#1E1A16]/70 backdrop-blur flex items-center justify-center text-[#E7D9BE]"
          aria-label="تشغيل/كتم الموسيقى"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* ---- HERO ---- */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-[#F6F1E7]">
          <p
            className="tracking-[0.35em] text-xs text-[#B8935A] mb-6"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            نتشرف بدعوتكم
          </p>

          <div className="flex items-center gap-4 md:gap-8">
            <h2
              className="text-4xl md:text-6xl"
              style={{ fontFamily: "'Aref Ruqaa', serif" }}
            >
              {wedding.groom}
            </h2>
            <span className="text-2xl md:text-3xl text-[#B8935A]">&</span>
            <h2
              className="text-4xl md:text-6xl"
              style={{ fontFamily: "'Aref Ruqaa', serif" }}
            >
              {wedding.bride}
            </h2>
          </div>

          <OrnamentDivider />

          <p className="text-center max-w-sm text-[#1E1A16]/80 leading-relaxed">
            يسعدنا دعوتكم لمشاركتنا فرحة زفافنا
          </p>

          <div className="flex gap-8 mt-2 text-sm text-[#1E1A16]/70">
            <span>{wedding.dateLabel}</span>
            <span className="text-[#B8935A]">•</span>
            <span>الساعة 7:00 مساءً</span>
          </div>

          {/* Countdown */}
          <div className="mt-12 bg-[#1E1A16] rounded-2xl px-6 py-6 md:px-10 md:py-8 flex gap-6 md:gap-10 shadow-xl shadow-[#1E1A16]/10">
            <CountdownBlock value={cd.days} label="يوم" />
            <CountdownBlock value={cd.hours} label="ساعة" />
            <CountdownBlock value={cd.minutes} label="دقيقة" />
            <CountdownBlock value={cd.seconds} label="ثانية" />
          </div>

          <ChevronDown
            className="mt-16 text-[#B8935A] animate-bounce"
            size={22}
          />
        </section>

        {/* ---- FAMILY INVITATION (preview of Phase 5 shape, static for now) ---- */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 bg-[#E7D9BE]/40 text-center">
          <p
            className="text-lg md:text-xl text-[#1E1A16]/80"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            تتشرف عائلتا
          </p>
          <h3
            className="text-2xl md:text-4xl mt-4"
            style={{ fontFamily: "'Aref Ruqaa', serif" }}
          >
            {wedding.groomFather}
          </h3>
          <p className="text-[#B8935A] my-2">و</p>
          <h3
            className="text-2xl md:text-4xl"
            style={{ fontFamily: "'Aref Ruqaa', serif" }}
          >
            {wedding.brideFather}
          </h3>
          <OrnamentDivider />
          <p className="text-[#1E1A16]/70 max-w-sm">
            بدعوتكم لمشاركتهم فرحة زفاف {wedding.groom} &amp; {wedding.bride}
          </p>
        </section>

        {/* ---- FINAL MESSAGE ---- */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 bg-[#1E1A16] text-center">
          <p
            className="text-[#F6F1E7] text-xl md:text-3xl max-w-md leading-relaxed"
            style={{ fontFamily: "'Aref Ruqaa', serif" }}
          >
            ننتظركم لنحتفل معاً بأجمل يوم في حياتنا ❤️
          </p>
          <OrnamentDivider light />
          <p className="text-[#E7D9BE] tracking-widest text-sm">
            {wedding.groom} &amp; {wedding.bride} — {wedding.dateLabel}
          </p>
        </section>
      </div>
    </div>
  );
}
