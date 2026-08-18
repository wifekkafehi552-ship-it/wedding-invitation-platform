"use server";

import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Every action here is deliberately small and single-purpose — this is
 * what keeps the system "modular": adding a new editable field later
 * means adding one more small action + one more form control, never
 * touching the others.
 */

const PageUpdate = z.object({
  id: z.string().uuid(),
  enabled: z.boolean(),
  sort_order: z.number().int(),
});

export async function updatePages(weddingSlug: string, pages: z.infer<typeof PageUpdate>[]) {
  const supabase = createServiceRoleClient();
  const parsed = pages.map((p) => PageUpdate.parse(p));

  for (const p of parsed) {
    const { error } = await supabase
      .from("wedding_pages")
      .update({ enabled: p.enabled, sort_order: p.sort_order })
      .eq("id", p.id);
    if (error) throw error;
  }
  revalidatePath(`/dashboard/${weddingSlug}`);
  revalidatePath(`/invite/${weddingSlug}`);
}

const FamilyUpdate = z.object({
  wedding_id: z.string().uuid(),
  groom_father_name: z.string().max(200).optional(),
  bride_father_name: z.string().max(200).optional(),
  enabled: z.boolean(),
  style: z.enum(["style1", "style2", "style3", "custom"]),
  custom_text: z.string().max(2000).optional(),
  opening_text: z.string().max(500).optional(),
});

export async function updateFamily(weddingSlug: string, input: z.infer<typeof FamilyUpdate>) {
  const supabase = createServiceRoleClient();
  const data = FamilyUpdate.parse(input);
  const { error } = await supabase
    .from("family_settings")
    .update({
      groom_father_name: data.groom_father_name ?? null,
      bride_father_name: data.bride_father_name ?? null,
      enabled: data.enabled,
      style: data.style,
      custom_text: data.custom_text ?? null,
      opening_text: data.opening_text ?? null,
    })
    .eq("wedding_id", data.wedding_id);
  if (error) throw error;
  revalidatePath(`/dashboard/${weddingSlug}`);
  revalidatePath(`/invite/${weddingSlug}`);
}

const TypographyUpdate = z.object({
  wedding_id: z.string().uuid(),
  heading_font: z.string().max(80),
  body_font: z.string().max(80),
  names_font: z.string().max(80),
  family_font: z.string().max(80),
  button_font: z.string().max(80),
  heading_color: z.string().max(20),
  body_color: z.string().max(20),
  names_color: z.string().max(20),
  family_color: z.string().max(20),
  button_color: z.string().max(20),
});

export async function updateTypography(weddingSlug: string, input: z.infer<typeof TypographyUpdate>) {
  const supabase = createServiceRoleClient();
  const data = TypographyUpdate.parse(input);
  const { wedding_id, ...fields } = data;
  const { error } = await supabase
    .from("typography_settings")
    .update(fields)
    .eq("wedding_id", wedding_id);
  if (error) throw error;
  revalidatePath(`/dashboard/${weddingSlug}`);
  revalidatePath(`/invite/${weddingSlug}`);
}

const TemplateUpdate = z.object({
  wedding_id: z.string().uuid(),
  template_id: z.string().max(80),
});

export async function updateTemplate(weddingSlug: string, input: z.infer<typeof TemplateUpdate>) {
  const supabase = createServiceRoleClient();
  const data = TemplateUpdate.parse(input);
  const { error } = await supabase
    .from("weddings")
    .update({ template_id: data.template_id })
    .eq("id", data.wedding_id);
  if (error) throw error;
  revalidatePath(`/dashboard/${weddingSlug}`);
  revalidatePath(`/invite/${weddingSlug}`);
}

const WeddingCoreUpdate = z.object({
  wedding_id: z.string().uuid(),
  groom_name: z.string().min(1).max(120),
  bride_name: z.string().min(1).max(120),
  wedding_date: z.string().optional(),
  wedding_time: z.string().optional(),
  venue_name: z.string().max(200).optional(),
  status: z.enum(["draft", "published"]),
});

export async function updateWeddingCore(weddingSlug: string, input: z.infer<typeof WeddingCoreUpdate>) {
  const supabase = createServiceRoleClient();
  const data = WeddingCoreUpdate.parse(input);
  const { wedding_id, ...fields } = data;
  const cleaned = {
    ...fields,
    wedding_date: fields.wedding_date || null,
    wedding_time: fields.wedding_time || null,
    venue_name: fields.venue_name || null,
  };
  const { error } = await supabase.from("weddings").update(cleaned).eq("id", wedding_id);
  if (error) throw error;
  revalidatePath(`/dashboard/${weddingSlug}`);
  revalidatePath(`/invite/${weddingSlug}`);
}
