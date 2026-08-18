import type { Wedding } from "@/types/wedding";
import { OrnamentDivider } from "./OrnamentDivider";

/** Elegant location/venue card — own original design, gold-on-ivory theme. */
export function LocationSection({ wedding }: { wedding: Wedding }) {
  if (!wedding.venue_name) return null;

  const mapsUrl =
    wedding.google_maps_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.venue_name)}`;

  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16">
      <p className="text-xs tracking-[0.3em] mb-6" style={{ color: "#B8935A" }}>
        مكان الحفل
      </p>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden border" style={{ borderColor: "#E7D9BE" }}>
        <div
          className="h-36 relative flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(184,147,90,0.25), transparent 65%), #1E1A16",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B8935A" strokeWidth="1.5">
            <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </div>
        <div className="bg-white px-6 py-6">
          <h3
            className="text-xl mb-1"
            style={{ fontFamily: "'Aref Ruqaa', serif", color: "#1E1A16" }}
          >
            {wedding.venue_name}
          </h3>
          {wedding.venue_address && (
            <p className="text-sm mb-4" style={{ color: "#1E1A16", opacity: 0.6 }}>
              {wedding.venue_address}
            </p>
          )}
          <OrnamentDivider />
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-2 border rounded-full px-6 py-2.5 text-sm transition-colors"
            style={{ borderColor: "#B8935A", color: "#1E1A16" }}
          >
            📍 افتح الموقع على Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
