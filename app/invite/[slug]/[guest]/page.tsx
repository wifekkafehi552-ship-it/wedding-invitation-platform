import { notFound } from "next/navigation";
import { getWeddingBundle } from "@/lib/supabase/getWeddingBundle";
import { getTemplate } from "@/components/templates/registry";

interface Props {
  params: { slug: string; guest: string };
}

export default async function PersonalInvitePage({ params }: Props) {
  const bundle = await getWeddingBundle(params.slug, params.guest);
  if (!bundle) notFound();

  const Template = getTemplate(bundle!.wedding.template_id);
  // `bundle.guest` being present is what lets the template greet the
  // guest by name instead of the generic "يسعدنا حضوركم" (rule #56).
  return <Template bundle={bundle!} />;
}
