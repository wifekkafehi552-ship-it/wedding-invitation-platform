import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWeddingBundle } from "@/lib/supabase/getWeddingBundle";
import { getTemplate } from "@/components/templates/registry";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bundle = await getWeddingBundle(params.slug);
  if (!bundle) return { title: "دعوة غير موجودة" };

  const { wedding } = bundle;
  const title = `${wedding.groom_name} & ${wedding.bride_name}`;
  const description = wedding.wedding_date
    ? `يسعدنا دعوتكم لحفل زفافنا يوم ${wedding.wedding_date}`
    : "يسعدنا دعوتكم لمشاركتنا فرحة زفافنا";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: wedding.cover_image_url
        ? [{ url: wedding.cover_image_url, width: 1200, height: 630 }]
        : [],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function InvitePage({ params }: Props) {
  const bundle = await getWeddingBundle(params.slug);
  if (!bundle) notFound();

  const Template = getTemplate(bundle!.wedding.template_id);
  return <Template bundle={bundle!} />;
}
