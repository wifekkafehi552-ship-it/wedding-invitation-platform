import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Invitation Platform",
  description: "منصة إنشاء دعوات زفاف رقمية تفاعلية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* In production, swap this for next/font/google with only the
            weights/subsets actually used per language (Phase 16 perf). */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap"
        />
      </head>
      <body className="bg-ivory text-ink">{children}</body>
    </html>
  );
}
