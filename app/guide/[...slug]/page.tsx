// app/guide/[...slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGuidePage, getAllGuideSlugs } from "@/lib/content";
import { buildNavigation } from "@/lib/navigation";
import { GuideLayout } from "@/components/layout/guide-layout";
import { NavPagination } from "@/components/layout/nav-pagination";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const slugs = await getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = await getGuidePage(slug);
    return { title: `${frontmatter.title} — 헤르메스 가이드`, description: frontmatter.description };
  } catch {
    return {};
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;

  let page;
  try {
    page = await getGuidePage(slug);
  } catch {
    notFound();
  }

  const groups = await buildNavigation();
  const allItems = groups.flatMap((g) => g.items);
  const currentHref = `/guide/${slug.join("/")}`;
  const currentIdx = allItems.findIndex((i) => i.href === currentHref);

  const prev = currentIdx > 0 ? allItems[currentIdx - 1] : null;
  const next = currentIdx < allItems.length - 1 ? allItems[currentIdx + 1] : null;

  return (
    <GuideLayout>
      {page.content}
      <NavPagination prev={prev} next={next} />
    </GuideLayout>
  );
}
