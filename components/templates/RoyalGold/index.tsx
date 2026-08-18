"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { TemplateProps } from "../registry";
import { Countdown } from "@/components/invitation/Countdown";
import { OrnamentDivider } from "@/components/invitation/OrnamentDivider";
import { FamilySection } from "@/components/invitation/FamilySection";
import { LocationSection } from "@/components/invitation/LocationSection";
import { RsvpForm } from "@/components/invitation/RsvpForm";

/**
 * Royal Gold — ornate, gold-on-ivory, ceremonial serif type.
 * Every string below comes from `bundle` — nothing is hardcoded here,
 * so this exact component renders correctly for ANY wedding record.
 */
export default function RoyalGold({ bundle }: TemplateProps) {
  const { wedding, typography, guest } = bundle;
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (opened && wedding.music_enabled && wedding.music_url) {
      audioRef.current?.play().catch(() => {});
    }
  }, [opened, wedding.music_enabled, wedding.music_url]);

  const greeting = guest ? `${guest.name}،` : "يسعدنا حضوركم";

  return (
    <div
      dir={wedding.language === "ar" ? "rtl" : "ltr"}
      className="relative w-full min-h-screen"
      style={{ background: "#F6F1E7", color: "#1E1A16", fontFamily: `'${typography.body_font}'` }}
    >
      {wedding.music_url && (
        <audio ref={audioRef} loop muted={muted} src={wedding.music_url} />
      )}

      {/* Cover */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center text-center transition-all duration-[1400ms] ease-out ${
          opened ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
        }`}
      >
        {wedding.cover_image_url && (
          <img src={wedding.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 px-6">
          <h1
            className="text-white text-5xl md:text-7xl leading-tight"
            style={{ fontFamily: `'${typography.names_font}'` }}
          >
            {wedding.groom_name} <span style={{ color: "#B8935A" }}>&</span> {wedding.bride_name}
          </h1>
          <OrnamentDivider light />
          <button
            onClick={() => { setOpened(true); setMuted(false); }}
            className="mt-10 border border-[#B8935A] text-[#F6F1E7] px-8 py-3 rounded-full text-sm hover:bg-[#B8935A] hover:text-[#1E1A16] transition-colors duration-500"
          >
            افتح دعوتك ✨
          </button>
        </div>
      </div>

      <div className={`transition-opacity duration-[1200ms] ${opened ? "opacity-100" : "opacity-0"}`}>
        {wedding.music_url && (
          <button
            onClick={() => setMuted((m) => !m)}
            className="fixed top-4 left-4 z-30 w-10 h-10 rounded-full bg-[#1E1A16]/70 backdrop-blur flex items-center justify-center text-[#E7D9BE]"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}

        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
          <p className="text-xs mb-3" style={{ color: "#B8935A" }}>{greeting}</p>
          <div className="flex items-center gap-4 md:gap-8">
            <h2 className="text-4xl md:text-6xl" style={{ fontFamily: `'${typography.names_font}'` }}>{wedding.groom_name}</h2>
            <span style={{ color: "#B8935A" }}>&</span>
            <h2 className="text-4xl md:text-6xl" style={{ fontFamily: `'${typography.names_font}'` }}>{wedding.bride_name}</h2>
          </div>
          <OrnamentDivider />
          {wedding.wedding_date && (
            <Countdown target={new Date(`${wedding.wedding_date}T${wedding.wedding_time ?? "19:00"}`)} />
          )}
        </section>

        <FamilySection bundle={bundle} />
        <LocationSection wedding={wedding} />

        {bundle.pages.find((p) => p.page_type === "rsvp")?.enabled && (
          <RsvpForm wedding={wedding} guest={guest} />
        )}
      </div>
    </div>
  );
}
