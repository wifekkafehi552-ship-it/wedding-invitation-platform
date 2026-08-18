"use client";

import { useState } from "react";
import type { TemplateProps } from "../registry";
import { Countdown } from "@/components/invitation/Countdown";
import { FamilySection } from "@/components/invitation/FamilySection";
import { LocationSection } from "@/components/invitation/LocationSection";
import { RsvpForm } from "@/components/invitation/RsvpForm";

/** Dark Luxury — near-black, single warm spotlight, cinematic italic type. */
export default function DarkLuxury({ bundle }: TemplateProps) {
  const { wedding, typography, guest } = bundle;
  const [opened, setOpened] = useState(false);
  const greeting = guest ? `${guest.name}،` : "CINEMATIC WEDDING";

  return (
    <div
      dir={wedding.language === "ar" ? "rtl" : "ltr"}
      className="relative w-full min-h-screen bg-[#0B0A08] text-[#EFE7D8]"
      style={{ fontFamily: `'${typography.body_font}'` }}
    >
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center text-center transition-all duration-[1600ms] ${
          opened ? "opacity-0 pointer-events-none scale-110" : "opacity-100"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 40%, rgba(184,147,90,0.18), transparent 60%)" }}
        />
        <div className="relative z-10 px-6">
          <p className="text-[#B8935A] tracking-[0.5em] text-[10px] mb-8">{greeting}</p>
          <h1
            className="text-5xl md:text-7xl italic"
            style={{ fontFamily: `'${typography.names_font}'` }}
          >
            {wedding.groom_name} & {wedding.bride_name}
          </h1>
          <button
            onClick={() => setOpened(true)}
            className="mt-12 text-[#EFE7D8]/80 text-xs tracking-[0.35em] hover:text-[#B8935A] transition-colors"
          >
            ▸ ابدأ التجربة
          </button>
        </div>
      </div>

      <div className={`transition-opacity duration-[1400ms] ${opened ? "opacity-100" : "opacity-0"}`}>
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 30%, rgba(184,147,90,0.10), transparent 55%)" }}
          />
          <div className="relative z-10 flex flex-col items-center">
            {wedding.wedding_date && (
              <p className="text-[#B8935A] tracking-[0.4em] text-[10px] mb-8">{wedding.wedding_date}</p>
            )}
            <h2
              className="text-4xl md:text-6xl italic mb-10"
              style={{ fontFamily: `'${typography.names_font}'` }}
            >
              {wedding.groom_name} <span className="not-italic text-[#B8935A]">&</span> {wedding.bride_name}
            </h2>
            {wedding.wedding_date && (
              <Countdown target={new Date(`${wedding.wedding_date}T${wedding.wedding_time ?? "19:00"}`)} />
            )}
          </div>
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
