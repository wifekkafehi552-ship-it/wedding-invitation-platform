"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { z } from "zod";

const RsvpInput = z.object({
  weddingId: z.string().uuid(),
  guestId: z.string().uuid().optional(),
  guestName: z.string().optional(),
  attendance: z.enum(["attending", "declined"]),
  numberOfGuests: z.number().int().min(0).max(20),
  notes: z.string().max(500).optional(),
});

export async function submitRsvp(input: z.infer<typeof RsvpInput>) {
  const data = RsvpInput.parse(input); // throws on invalid input
  const supabase = createClient();
  // Reading `guests`/`rsvps` to check duplicates and limits needs the
  // service-role client: there's no public SELECT policy on those tables
  // (by design — guest lists aren't publicly listable), so the regular
  // anon client would silently see zero rows here. The final insert below
  // still goes through the anon client, governed by the public RSVP-insert
  // policy — only these two read checks bypass RLS.
  const adminSupabase = createServiceRoleClient();

  // Guard against a duplicate submission for the same guest (rule #57).
  if (data.guestId) {
    const { data: existing } = await adminSupabase
      .from("rsvps")
      .select("id")
      .eq("guest_id", data.guestId)
      .maybeSingle();
    if (existing) {
      throw new Error("لقد تم تسجيل تأكيد حضورك مسبقاً.");
    }

    // Enforce the guest's max_guests limit server-side too (rule #58) —
    // never trust the client-side check alone.
    const { data: guest } = await adminSupabase
      .from("guests")
      .select("max_guests")
      .eq("id", data.guestId)
      .single();
    if (guest && data.numberOfGuests > guest.max_guests) {
      throw new Error(`هذا الرابط يسمح بتأكيد حضور ${guest.max_guests} أشخاص فقط.`);
    }
  }

  const { error } = await supabase.from("rsvps").insert({
    wedding_id: data.weddingId,
    guest_id: data.guestId ?? null,
    guest_name: data.guestName ?? null,
    attendance: data.attendance,
    number_of_guests: data.numberOfGuests,
    notes: data.notes ?? null,
  });
  if (error) throw error;
}
