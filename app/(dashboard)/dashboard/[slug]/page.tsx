import { notFound } from "next/navigation";
import { getWeddingBundle } from "@/lib/supabase/getWeddingBundle";
import { TEMPLATE_LIST } from "@/components/templates/registry";
import DashboardClient from "@/components/dashboard/DashboardClient";

interface Props {
  params: { slug: string };
}

export default async function DashboardPage({ params }: Props) {
  const bundle = await getWeddingBundle(params.slug);
  if (!bundle) notFound();

  return (
    <DashboardClient
      slug={params.slug}
      bundle={bundle!}
      templates={TEMPLATE_LIST}
    />
  );
}
