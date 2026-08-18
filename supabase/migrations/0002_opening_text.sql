-- Run this in Supabase SQL Editor on the EXISTING project (additive change,
-- safe to run — it only adds a new nullable column).

alter table public.family_settings
  add column if not exists opening_text text;
