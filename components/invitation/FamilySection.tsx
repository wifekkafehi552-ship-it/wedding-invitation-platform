import type { WeddingBundle } from "@/types/wedding";
import { OrnamentDivider } from "./OrnamentDivider";

const STYLE_RENDERERS: Record<
  string,
  (g: string, b: string, groomName: string, brideName: string) => React.ReactNode
> = {
  style1: (g, b, groomName, brideName) => (
    <>
      <p className="text-sm opacity-70">تتشرف عائلتا</p>
      <h3 className="text-xl md:text-2xl mt-3">{g}</h3>
      <p className="my-1" style={{ color: "#B8935A" }}>والسيد</p>
      <h3 className="text-xl md:text-2xl">{b}</h3>
      <p className="text-sm opacity-70 mt-4">بدعوتكم لحضور حفل زفاف</p>
      <p className="text-lg mt-1">{groomName} &amp; {brideName}</p>
    </>
  ),
  style2: (g, b, groomName, brideName) => (
    <>
      <p className="text-sm opacity-70">بكل حب وسرور</p>
      <p className="text-sm opacity-70 mt-1">تدعوكم عائلتا</p>
      <h3 className="text-xl md:text-2xl mt-3">{g} &amp; {b}</h3>
      <p className="text-sm opacity-70 mt-4">لمشاركتهم فرحة زفاف أبنائهم</p>
      <p className="text-lg mt-1">{groomName} &amp; {brideName}</p>
    </>
  ),
  style3: (_g, _b, groomName, brideName) => (
    <>
      <p className="text-sm opacity-70">تتشرف عائلتا العروسين</p>
      <h3 className="text-xl md:text-2xl mt-3">{groomName} &amp; {brideName}</h3>
      <p className="text-sm opacity-70 mt-4">بدعوتكم لمشاركتهما فرحة زفافهما</p>
    </>
  ),
};

export function FamilySection({ bundle }: { bundle: WeddingBundle }) {
  const { family, wedding, typography } = bundle;
  if (!family?.enabled) return null;

  return (
    <section
      className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16"
      style={{ background: "rgba(231,217,190,0.4)", fontFamily: `'${typography.family_font}'` }}
    >
      {family.opening_text && (
        <>
          <p
            className="whitespace-pre-line leading-loose text-sm md:text-base mb-2"
            style={{ color: "#5B1F23" }}
          >
            {family.opening_text}
          </p>
          <OrnamentDivider />
        </>
      )}
      {family.style === "custom" && family.custom_text ? (
        <p className="whitespace-pre-line leading-loose">{family.custom_text}</p>
      ) : (
        STYLE_RENDERERS[family.style]?.(
          family.groom_father_name ?? "",
          family.bride_father_name ?? "",
          wedding.groom_name,
          wedding.bride_name
        )
      )}
      <OrnamentDivider />
    </section>
  );
}
