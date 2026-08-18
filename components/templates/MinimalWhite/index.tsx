"use client";

import { useState } from "react";
import type { TemplateProps } from "../registry";
import { Countdown } from "@/components/invitation/Countdown";
import { FamilySection } from "@/components/invitation/FamilySection";
import { LocationSection } from "@/components/invitation/LocationSection";
import { RsvpForm } from "@/components/invitation/RsvpForm";

/** Minimal White — quiet, generous whitespace, thin sans, no ornament. */
export default function MinimalWhite({ bundle }: TemplateProps) {
  const { wedding, typography, guest } = bundle;
  const [opened, setOpened] = useState(false);
  const greeting = guest ? `${guest.name}،` : "WEDDING INVITATION";

  return (
    <div
      dir={wedding.language === "ar" ? "rtl" : "ltr"}
      className="relative w-full min-h-screen bg-white text-[#111]"
      style={{ fontFamily: `'${typography.body_font}'` }}
    >
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center text-center bg-white transition-all duration-1000 ${
          opened ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <p className="text-[11px] tracking-[0.5em] text-[#999] mb-10">{greeting}</p>
        <h1
          className="text-4xl md:text-6xl font-light tracking-wide"
          style={{ fontFamily: `'${typography.names_font}'` }}
        >
          {wedding.groom_name} <span className="mx-3 text-[#ccc] font-thin">/</span> {wedding.bride_name}
        </h1>
        <div className="w-10 h-px bg-[#111] my-8" />
        <button
          onClick={() => setOpened(true)}
          className="text-xs tracking-[0.3em] border-b border-[#111] pb-1 hover:opacity-60 transition-opacity"
        >
          افتح الدعوة
        </button>
      </div>

      <div className={`transition-opacity duration-1000 ${opened ? "opacity-100" : "opacity-0"}`}>
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
          {wedding.wedding_date && (
            <p className="text-[11px] tracking-[0.4em] text-[#999] mb-12">{wedding.wedding_date}</p>
          )}
          <h2 className="text-3xl md:text-5xl font-light mb-2" style={{ fontFamily: `'${typography.names_font}'` }}>
            {wedding.groom_name}
          </h2>
          <div className="w-6 h-px bg-[#ccc] my-3" />
          <h2 className="text-3xl md:text-5xl font-light" style={{ fontFamily: `'${typography.names_font}'` }}>
            {wedding.bride_name}
          </h2>
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
