import { createClient } from "./server";
import { createServiceRoleClient } from "./serviceRole";
import type { WeddingBundle } from "@/types/wedding";

/**
 * Loads everything a template needs for /invite/[slug] (and, if guestSlug
 * is given, /invite/[slug]/[guestSlug]) in parallel. RLS on the `weddings`
 * table means this silently returns null for a draft wedding requested by
 * a non-owner — the page component should render notFound() in that case.
 */
export async function getWeddingBundle(
  slug: string,
  guestSlug?: string
): Promise<WeddingBundle | null> {
  const supabase = createClient();

  const { data: wedding, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !wedding) return null;

  const [pages, settings, typography, family, gallery, story, guest] =
    await Promise.all([
      supabase
        .from("wedding_pages")
        .select("*")
        .eq("wedding_id", wedding.id)
        .order("sort_order"),
      supabase
        .from("wedding_settings")
        .select("*")
        .eq("wedding_id", wedding.id)
        .single(),
      supabase
        .from("typography_settings")
        .select("*")
        .eq("wedding_id", wedding.id)
        .single(),
      supabase
        .from("family_settings")
        .select("*")
        .eq("wedding_id", wedding.id)
        .single(),
      supabase
        .from("gallery")
        .select("*")
        .eq("wedding_id", wedding.id)
        .order("sort_order"),
      supabase
        .from("story_items")
        .select("*")
        .eq("wedding_id", wedding.id)
        .order("sort_order"),
      guestSlug
        ? createServiceRoleClient()
            .from("guests")
            .select("*")
            .eq("wedding_id", wedding.id)
            .eq("personal_slug", guestSlug)
            .single()
        : Promise.resolve({ data: undefined }),
    ]);

  return {
    wedding,
    pages: pages.data ?? [],
    settings: settings.data!,
    typography: typography.data!,
    family: family.data!,
    gallery: gallery.data ?? [],
    story: story.data ?? [],
    guest: guest.data ?? undefined,
  };
}
