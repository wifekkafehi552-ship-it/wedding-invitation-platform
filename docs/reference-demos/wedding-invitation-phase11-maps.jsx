import React, { useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";

/**
 * PHASE 11 — Google Maps
 * weddings.venue_name / venue_address / google_maps_url (Phase 6 schema)
 *
 * The button below builds a universal link that opens the native Google
 * Maps app on iOS/Android when available, and falls back to Maps on the
 * web otherwise — this is the standard `https://www.google.com/maps/search/?api=1&query=...`
 * or `https://maps.app.goo.gl/...` short-link pattern; no SDK needed.
 */

const wedding = {
  venue: "قاعة لاكزوري لاند",
  address: "شارع الحبيب بورقيبة، تونس",
  lat: 36.8065,
  lng: 10.1815,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=36.8065,10.1815",
};

function useGoogleFonts() {
  useEffect(() => {
    const id = "wedding-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@700&family=Cairo:wght@300;400;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

export default function LocationSection() {
  useGoogleFonts();
  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7] flex items-center justify-center px-6" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="w-full max-w-sm">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-2 text-center">PHASE 11 — GOOGLE MAPS</p>
        <div className="bg-white rounded-2xl border border-[#E7D9BE] overflow-hidden">
          {/* static map preview */}
          <div className="h-40 bg-[#E7D9BE] relative flex items-center justify-center">
            <MapPin size={28} className="text-[#B8935A]" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 24px, #1E1A16 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, #1E1A16 25px)"
            }} />
          </div>
          <div className="p-5 text-center">
            <h3 className="text-xl text-[#1E1A16] mb-1" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{wedding.venue}</h3>
            <p className="text-[#1E1A16]/60 text-sm mb-5">{wedding.address}</p>
            <a
              href={wedding.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#B8935A] text-[#1E1A16] px-6 py-2.5 rounded-full text-sm hover:bg-[#B8935A] hover:text-white transition-colors"
            >
              <Navigation size={14} /> افتح الموقع على Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
