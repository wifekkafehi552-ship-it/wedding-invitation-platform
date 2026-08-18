# حالة المشروع — ما تم ربطه فعليًا مقابل المرجعي

## مربوط في هيكل Next.js الحقيقي (app/, components/, lib/, types/)
- `/invite/[slug]` و `/invite/[slug]/[guest]` — صفحات ديناميكية حقيقية
- `generateMetadata` (SEO + Open Graph) — Phase 14
- `getWeddingBundle()` — يجلب كل بيانات الدعوة من Supabase بالتوازي
- قالب **Royal Gold** كامل بصيغة `.tsx`، بياخد كل نصوصه من `bundle` (rule #55)
- `Countdown`, `OrnamentDivider`, `FamilySection`, `RsvpForm` — مكوّنات مشتركة
- `submitRsvp` كـ Server Action حقيقي مع Zod validation + حماية من التكرار +
  فرض حد الضيوف من السيرفر (مش بس من الواجهة) — Phase 9 + 15
- `wedding_pages`, `wedding_settings`, `typography_settings`, إلخ — Types كاملة
- `supabase/migrations/0001_init.sql` — نفس الـ Schema من Phase 6 بالكامل

## مرجعي فقط (docs/reference-demos/*.jsx)
كل مرحلة تم بناؤها واختبارها بصريًا كـ React component مستقل أثناء المحادثة
(Phase 1–2–3–4–5–7–8–9–10–11–12). دول **مش مربوطين** بمشروع Next.js الحقيقي —
لسه لازم حد يحوّلهم لـ:
- قوالب إضافية (`MinimalWhite`, `DarkLuxury`, والباقي من الـ 10) في
  `components/templates/`
- شاشات Auth الحقيقية (`app/(auth)/login`, `signup`, `forgot-password`)
  متوصّلة فعليًا بـ `supabase.auth.*`
- Dashboard الحقيقي (`app/(dashboard)/dashboard/*`) بكل تبويباته
- Gallery upload / Story editor / Music upload متوصّلين بـ Supabase Storage

## ليه معمولتش الشاشات دي بالكامل هنا؟
بيئة المحادثة دي معندهاش اتصال إنترنت، فمش قادر أشغّل `npm install` ولا أختبر
اتصال حقيقي بـ Supabase. اللي فوق (الـ scaffold) مكتوب بصيغة صحيحة وقابل
للتشغيل في بيئتك مباشرة بعد `npm install` وربط مفاتيح Supabase — لكن محتاج
اختبار حقيقي على جهازك زي ما نصّت قاعدة #64 في الطلب الأصلي (تشغيل، اختبار،
إصلاح أخطاء، بعدين الانتقال للمرحلة التالية).
