import type { ComponentType } from "react";
import type { WeddingBundle } from "@/types/wedding";
import RoyalGold from "./RoyalGold";
import MinimalWhite from "./MinimalWhite";
import DarkLuxury from "./DarkLuxury";

export interface TemplateProps {
  bundle: WeddingBundle;
}

/**
 * Every template receives the SAME `bundle` shape and nothing else.
 * No wedding-specific text (names, dates, father names) is ever
 * hardcoded inside a template component — see rule #55 in the spec.
 *
 * To add a new template later:
 *   1. Create components/templates/<Name>/index.tsx following the same
 *      TemplateProps contract as the ones below.
 *   2. Add one line to TEMPLATE_LIST (id must match a row in the
 *      `templates` table seeded by supabase/migrations/0001_init.sql).
 * Nothing else in the app needs to change — the dashboard picker and
 * the public route both read from TEMPLATE_LIST automatically.
 */
export const TEMPLATE_LIST: { id: string; name: string; description: string; Component: ComponentType<TemplateProps> }[] = [
  { id: "royal-gold", name: "Royal Gold", description: "فخم، زخارف ذهبية، خط عربي احتفالي", Component: RoyalGold },
  { id: "minimal-white", name: "Minimal White", description: "هادئ، مساحات بيضاء واسعة، بدون زخرفة", Component: MinimalWhite },
  { id: "dark-luxury", name: "Dark Luxury", description: "أسود سينمائي، إضاءة ذهبية خافتة", Component: DarkLuxury },
];

export function getTemplate(templateId: string | null): ComponentType<TemplateProps> {
  const found = TEMPLATE_LIST.find((t) => t.id === templateId);
  return (found ?? TEMPLATE_LIST[0]).Component;
}
