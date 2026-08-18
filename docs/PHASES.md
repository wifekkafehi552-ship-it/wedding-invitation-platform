# Phases 13–18 — Draft/Publish → Deployment

Ready-to-drop-in code + checklists for the remaining phases. These are
backend/config concerns rather than standalone UI, so they're grouped here
instead of as separate interactive demos.

---

## PHASE 13 — Draft / Publish

The `weddings.status` enum (`draft` | `published`) from the Phase 6 schema
drives this. The public route only ever reads published data (enforced by
RLS, not just app logic).

```ts
// app/dashboard/actions/publish.ts
'use server'
import { supabase } from '@/lib/supabase/server'

export async function publishWedding(weddingId: string) {
  const { error } = await supabase
    .from('weddings')
    .update({ status: 'published' })
    .eq('id', weddingId)
  if (error) throw error
}

export async function saveDraft(weddingId: string, patch: Partial<Wedding>) {
  // autosaved on every builder change (debounced ~800ms client-side)
  const { error } = await supabase.from('weddings').update(patch).eq('id', weddingId)
  if (error) throw error
}
```

Rule: the slug (`/invite/mohamed-sara`) is set once at creation and never
changes on re-publish — editing design/content never touches `slug`.

---

## PHASE 14 — Sharing + SEO + Open Graph

```tsx
// app/invite/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const wedding = await getWeddingBySlug(params.slug) // published only
  const title = `${wedding.groom_name} & ${wedding.bride_name}`
  const description = `يسعدنا دعوتكم لحفل زفافنا يوم ${wedding.wedding_date}`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: wedding.cover_image_url, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}
```

Share buttons (WhatsApp / Facebook / Telegram / SMS / Copy Link) are plain
URL-scheme links — no SDK needed:

```ts
const shareLinks = (url: string, text: string) => ({
  whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  sms: `sms:?&body=${encodeURIComponent(text + ' ' + url)}`,
})
```

Also add: dynamic `sitemap.xml` (one entry per published wedding),
`robots.txt` disallowing `/dashboard`, and a generated favicon.

---

## PHASE 15 — Security checklist

- [x] RLS on every table (done in Phase 6) — owner-only writes, published-only public reads
- [ ] Supabase Storage bucket policies: only the wedding owner can `insert`/`delete` in `/weddings/[wedding-id]/*`; public `select` only for published weddings
- [ ] File upload validation: allow-list `image/jpeg`, `image/png`, `image/webp`, `audio/mpeg`; max 5MB images / 10MB audio, checked both client- and server-side
- [ ] Zod (or similar) schema validation on every server action input
- [ ] Rate limit the public RSVP `insert` endpoint (e.g. Upstash Ratelimit — 5 req/min per IP) to block spam
- [ ] All secrets (`SUPABASE_SERVICE_ROLE_KEY`, etc.) stay server-only in `.env.local`, never in client bundles — only `NEXT_PUBLIC_*` keys reach the browser
- [ ] `guests` table never publicly listable in bulk — a guest's personal page resolves via a single-row server-side lookup by `personal_slug`, not a client-side fetch of the whole table

---

## PHASE 16 — Performance checklist

- [ ] `next/image` everywhere, with `sizes` set per breakpoint
- [ ] Fonts loaded via `next/font/google` (self-hosted, no render-blocking `<link>`), subset to the characters actually used per language
- [ ] Route-level code splitting: dashboard bundle never ships to `/invite/[slug]`, and vice versa
- [ ] Gallery images lazy-loaded below the fold; lightbox component lazy-imported (`dynamic(() => import(...))`)
- [ ] Animations use `transform`/`opacity` only (GPU-accelerated), never animate `width`/`top`/`left`
- [ ] Supabase queries select only needed columns; wedding + its child tables fetched in parallel (`Promise.all`), not waterfalled
- [ ] Target: Lighthouse Performance ≥ 90 on the public invitation page (mobile)

---

## PHASE 17 — Testing checklist

Manual pass required across everything in section 65 of the spec before
sign-off:

- [ ] Desktop / Mobile / Tablet layouts — no horizontal scroll, no tiny tap targets
- [ ] Arabic RTL, French LTR, English LTR — direction switches correctly per language setting
- [ ] RSVP: confirm, decline, over-limit guest count, duplicate submission block
- [ ] Personal guest links resolve correctly; general link still works
- [ ] Gallery: grid/masonry/slider + lightbox on touch (swipe) and desktop (arrows)
- [ ] Music: doesn't autoplay before interaction; mute toggle persists across sections
- [ ] Google Maps button opens native app on a real phone, falls back to web on desktop
- [ ] All 10 templates: switching preserves every field (names, RSVP data, gallery, story)
- [ ] Page enable/disable + drag-reorder reflected instantly in the public link
- [ ] Auth: sign up, login, logout, forgot-password email actually arrives
- [ ] RLS: user A cannot read/write user B's wedding via direct API calls
- [ ] SEO: `/invite/[slug]` has correct title/OG image when pasted into WhatsApp/Facebook link preview

---

## PHASE 18 — Deployment (Vercel)

```bash
# 1. Push to GitHub, then in Vercel:
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY   # server-only, never NEXT_PUBLIC_
vercel --prod
```

- Supabase project: run the Phase 6 SQL migration, enable email auth
  provider, set the Storage buckets (`gallery`, `music`, `story`, `cover`)
  with the policies from Phase 15.
- Add the production domain to Supabase Auth's **Redirect URLs** (for the
  forgot-password flow) and to `next.config.js`'s `images.domains` (for
  Supabase Storage image URLs via `next/image`).
- Point custom domain (future-ready item from spec §61) once payments/
  domains are implemented — out of scope for this MVP deploy.

---

This completes all 18 phases at the architecture/spec level. What's been
built as working, testable demos in this chat: Phase 1 (cover/hero),
Phase 2 (3 templates), Phase 3 (pages system), Phase 4 (typography +
colors), Phase 5 (family invitation), Phase 6 (full SQL schema), Phase 7
(auth UI), Phase 8 (dashboard shell), Phase 9 (RSVP + guests), Phase 10
(gallery/story/music), Phase 11 (Google Maps), Phase 12 (live editor).
Phases 13–18 are delivered as implementation-ready code/checklists above
since they wire into a real deployed Next.js + Supabase project rather
than something a sandboxed chat can run end-to-end.
