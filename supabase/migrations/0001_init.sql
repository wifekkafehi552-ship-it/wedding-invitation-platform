-- =============================================================
-- PHASE 6 — SUPABASE DATABASE SCHEMA
-- Wedding Invitation Platform
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- =============================================================

-- -------------------------------------------------------------
-- EXTENSIONS
-- -------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- ENUM TYPES
-- -------------------------------------------------------------
create type wedding_status as enum ('draft', 'published');
create type page_type as enum (
  'cover', 'family', 'couple', 'details', 'countdown',
  'story', 'gallery', 'rsvp', 'location', 'final'
);
create type rsvp_attendance as enum ('attending', 'declined', 'pending');

-- -------------------------------------------------------------
-- users  (mirrors auth.users — 1:1 profile row)
-- -------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------
-- templates  (seeded catalog — Royal Gold, Minimal White, ...)
-- -------------------------------------------------------------
create table public.templates (
  id text primary key,               -- e.g. 'royal-gold'
  name text not null,
  description text,
  preview_image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------
-- weddings  (core record — one per couple)
-- -------------------------------------------------------------
create table public.weddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  slug text not null unique,
  bride_name text not null,
  groom_name text not null,
  wedding_date date,
  wedding_time time,
  venue_name text,
  venue_address text,
  google_maps_url text,
  dress_code text,
  additional_info text,
  cover_image_url text,
  status wedding_status not null default 'draft',
  template_id text references public.templates(id),
  language text not null default 'ar',       -- 'ar' | 'fr' | 'en'
  music_url text,
  music_enabled boolean not null default false,
  music_volume numeric(3,2) not null default 0.5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index weddings_user_id_idx on public.weddings(user_id);
create index weddings_slug_idx on public.weddings(slug);

-- -------------------------------------------------------------
-- wedding_pages  (page enable/disable + order, per wedding)
-- -------------------------------------------------------------
create table public.wedding_pages (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  page_type page_type not null,
  enabled boolean not null default true,
  sort_order int not null default 0,
  settings jsonb not null default '{}'::jsonb,   -- page-specific overrides
  unique (wedding_id, page_type)
);
create index wedding_pages_wedding_id_idx on public.wedding_pages(wedding_id);

-- -------------------------------------------------------------
-- wedding_settings  (design tokens: colors, radius, animation)
-- -------------------------------------------------------------
create table public.wedding_settings (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null unique references public.weddings(id) on delete cascade,
  primary_color text default '#B8935A',
  secondary_color text default '#E7D9BE',
  background_color text default '#F6F1E7',
  text_color text default '#1E1A16',
  accent_color text default '#5B1F23',
  button_style text default 'rounded',        -- 'rounded' | 'square' | 'pill'
  border_radius int default 12,
  animation_style text default 'fade'         -- 'fade' | 'slide' | 'scale' | 'parallax'
);

-- -------------------------------------------------------------
-- typography_settings
-- -------------------------------------------------------------
create table public.typography_settings (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null unique references public.weddings(id) on delete cascade,
  heading_font text default 'Aref Ruqaa',
  body_font text default 'Cairo',
  names_font text default 'Aref Ruqaa',
  family_font text default 'Amiri',
  button_font text default 'Cairo',
  heading_color text default '#1E1A16',
  body_color text default '#1E1A16',
  names_color text default '#1E1A16',
  family_color text default '#1E1A16',
  button_color text default '#B8935A'
);

-- -------------------------------------------------------------
-- family_settings
-- -------------------------------------------------------------
create table public.family_settings (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null unique references public.weddings(id) on delete cascade,
  groom_father_name text,
  bride_father_name text,
  enabled boolean not null default true,
  custom_text text,
  style text not null default 'style1'   -- 'style1' | 'style2' | 'style3' | 'custom'
);

-- -------------------------------------------------------------
-- guests  (per-guest personalized invitation links)
-- -------------------------------------------------------------
create table public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  personal_slug text not null,
  max_guests int not null default 1,
  created_at timestamptz not null default now(),
  unique (wedding_id, personal_slug)
);
create index guests_wedding_id_idx on public.guests(wedding_id);

-- -------------------------------------------------------------
-- rsvps  (one response per guest; also supports anonymous/general RSVP)
-- -------------------------------------------------------------
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  guest_name text,                       -- used when there's no personal link
  attendance rsvp_attendance not null default 'pending',
  number_of_guests int not null default 1,
  notes text,
  submitted_at timestamptz not null default now()
);
create index rsvps_wedding_id_idx on public.rsvps(wedding_id);
create index rsvps_guest_id_idx on public.rsvps(guest_id);

-- -------------------------------------------------------------
-- gallery
-- -------------------------------------------------------------
create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);
create index gallery_wedding_id_idx on public.gallery(wedding_id);

-- -------------------------------------------------------------
-- story_items  (our-story timeline)
-- -------------------------------------------------------------
create table public.story_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  item_date text,          -- kept as free text: "2021", "صيف 2023", etc.
  title text not null,
  description text,
  image_url text,
  sort_order int not null default 0
);
create index story_items_wedding_id_idx on public.story_items(wedding_id);

-- -------------------------------------------------------------
-- updated_at trigger for weddings
-- -------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger weddings_set_updated_at
before update on public.weddings
for each row execute function public.set_updated_at();

-- =============================================================
-- ROW LEVEL SECURITY
-- Rule: owners manage their own wedding fully; the public can only
-- read a PUBLISHED wedding (and its child data) and insert RSVPs.
-- =============================================================

alter table public.users enable row level security;
alter table public.weddings enable row level security;
alter table public.wedding_pages enable row level security;
alter table public.wedding_settings enable row level security;
alter table public.typography_settings enable row level security;
alter table public.family_settings enable row level security;
alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.gallery enable row level security;
alter table public.story_items enable row level security;
alter table public.templates enable row level security;

-- users: a user can read/update only their own row
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- templates: public read-only catalog
create policy "templates_public_read" on public.templates
  for select using (is_active = true);

-- weddings: owner has full access
create policy "weddings_owner_all" on public.weddings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- weddings: public can read only if published
create policy "weddings_public_read_published" on public.weddings
  for select using (status = 'published');

-- generic helper pattern reused for every child table below:
-- owner (via wedding_id -> weddings.user_id) gets full access;
-- public gets read-only access when the parent wedding is published.

create policy "wedding_pages_owner_all" on public.wedding_pages
  for all using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
create policy "wedding_pages_public_read" on public.wedding_pages
  for select using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.status = 'published')
  );

create policy "wedding_settings_owner_all" on public.wedding_settings
  for all using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
create policy "wedding_settings_public_read" on public.wedding_settings
  for select using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.status = 'published')
  );

create policy "typography_owner_all" on public.typography_settings
  for all using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
create policy "typography_public_read" on public.typography_settings
  for select using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.status = 'published')
  );

create policy "family_owner_all" on public.family_settings
  for all using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
create policy "family_public_read" on public.family_settings
  for select using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.status = 'published')
  );

create policy "guests_owner_all" on public.guests
  for all using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
-- guests are NOT publicly listable (privacy) — only resolvable one-by-one
-- via a server-side function using personal_slug, never a bulk public select.

create policy "rsvps_owner_read" on public.rsvps
  for select using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
create policy "rsvps_owner_manage" on public.rsvps
  for update using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
create policy "rsvps_owner_delete" on public.rsvps
  for delete using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
-- public (including anonymous guests) can INSERT an rsvp for a published wedding
create policy "rsvps_public_insert" on public.rsvps
  for insert with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.status = 'published')
  );

create policy "gallery_owner_all" on public.gallery
  for all using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
create policy "gallery_public_read" on public.gallery
  for select using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.status = 'published')
  );

create policy "story_owner_all" on public.story_items
  for all using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.user_id = auth.uid())
  );
create policy "story_public_read" on public.story_items
  for select using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.status = 'published')
  );

-- =============================================================
-- SEED: templates catalog + demo wedding (Mohamed & Sara)
-- =============================================================
insert into public.templates (id, name, description) values
  ('royal-gold', 'Royal Gold', 'فخم، زخارف ذهبية، خط عربي احتفالي'),
  ('ivory-elegance', 'Ivory Elegance', null),
  ('minimal-white', 'Minimal White', 'هادئ، مساحات بيضاء واسعة'),
  ('romantic-rose', 'Romantic Rose', null),
  ('dark-luxury', 'Dark Luxury', 'أسود سينمائي، إضاءة ذهبية خافتة'),
  ('arabic-heritage', 'Arabic Heritage', null),
  ('modern-luxury', 'Modern Luxury', null),
  ('botanical', 'Botanical', null),
  ('classic-wedding', 'Classic Wedding', null),
  ('cinematic', 'Cinematic', null);

-- Demo wedding is inserted from the app after a user signs up (needs a
-- real auth.users.id for user_id) — see /lib/supabase/seed-demo.ts.
