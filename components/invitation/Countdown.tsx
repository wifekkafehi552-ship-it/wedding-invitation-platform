"use client";

import { useEffect, useState } from "react";

function useCountdown(target: Date) {
  const [left, setLeft] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, target.getTime() - Date.now())), 1000);
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

export function Countdown({ target }: { target: Date }) {
  const cd = useCountdown(target);
  const blocks: [string, number][] = [
    ["يوم", cd.days],
    ["ساعة", cd.hours],
    ["دقيقة", cd.minutes],
    ["ثانية", cd.seconds],
  ];
  return (
    <div className="mt-8 bg-[#1E1A16] rounded-2xl px-6 py-6 md:px-10 md:py-8 flex gap-6 md:gap-10 shadow-xl">
      {blocks.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center min-w-[56px]">
          <div className="text-2xl md:text-3xl tabular-nums text-[#F6F1E7]">
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-[10px] tracking-[0.25em] text-[#E7D9BE]/70 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
