# Wedding Invitation Platform

Manصة إنشاء دعوات زفاف رقمية تفاعلية — Next.js + TypeScript + Tailwind + Supabase.

هذا المشروع نتيجة 18 مرحلة بُنيت خطوة بخطوة (راجع `/docs/PHASES.md`). هيكلة الملفات
جاهزة للتشغيل محليًا وربطها بمشروع Supabase حقيقي.

## التشغيل محليًا

```bash
npm install
cp .env.example .env.local   # ثم املأ مفاتيح Supabase
npm run dev
```

## إعداد Supabase

1. أنشئ مشروع جديد على supabase.com
2. شغّل `supabase/migrations/0001_init.sql` في SQL Editor
3. فعّل Email provider في Authentication
4. أنشئ Storage buckets: `gallery`, `story`, `music`, `cover` (public read، owner write)
5. انسخ `Project URL` و `anon key` إلى `.env.local`

## البنية

```
app/
  invite/[slug]/          -> الدعوة العامة (يقرأ من Supabase حسب الـ slug)
  (dashboard)/dashboard/   -> لوحة تحكم صاحب الدعوة
components/
  templates/               -> كل قالب Component مستقل (RoyalGold, MinimalWhite, DarkLuxury...)
  invitation/               -> أقسام مشتركة بين القوالب (Countdown, RSVP form...)
  dashboard/                 -> لوحة التحكم (Pages, Typography, Guests...)
lib/supabase/               -> عملاء Supabase (client + server)
types/                        -> أنواع TypeScript لكل الجداول
supabase/migrations/          -> SQL الكامل (Phase 6)
docs/PHASES.md                -> سجل المراحل الـ 18 وما تم إنجازه في كل مرحلة
```

## ملاحظة مهمة

هذا الهيكل تم بناؤه وتجميعه داخل بيئة محادثة بدون اتصال إنترنت، لذلك:
- لم يتم تشغيل `npm install` فعليًا هنا ولا اختباره على سيرفر Next.js حي
- كل الأقسام (Cover, Templates, Pages, Typography, Family, RSVP, Gallery...)
  تم بناؤها واختبارها بصريًا كمكوّنات React منفصلة أثناء المحادثة، ثم جُمعت هنا
  في هيكل Next.js حقيقي
- الخطوة التالية: افتح المشروع في بيئتك، شغّل `npm install`، اربط Supabase، واختبر
  كل Phase بنفس ترتيب `docs/PHASES.md`
