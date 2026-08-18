export function OrnamentDivider({ light = false }: { light?: boolean }) {
  const stroke = light ? "#E7D9BE" : "#B8935A";
  return (
    <svg viewBox="0 0 220 24" className="mx-auto w-40 h-5 my-4" fill="none" aria-hidden="true">
      <path
        d="M2 12 C 40 2, 60 22, 90 12 C 100 8, 105 8, 110 12 C 115 16, 120 16, 130 12 C 160 2, 180 22, 218 12"
        stroke={stroke}
        strokeWidth="1.2"
      />
      <circle cx="110" cy="12" r="3" fill={stroke} />
    </svg>
  );
}
