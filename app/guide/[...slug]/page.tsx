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
    return notFound();
  }

  const groups = await buildNavigation();
  // Flatten: parent → its children → next parent → …
  const allItems = groups.flatMap((g) =>
    g.items.flatMap((item) => [item, ...(item.children ?? [])])
  );
  const currentHref = `/guide/${slug.join("/")}`;
  const currentIdx = allItems.findIndex((i) => i.href === currentHref);

  // Child pages have no "next" — they are terminal within their parent section
  const isChild = groups.some((g) =>
    g.items.some((item) => item.children?.some((c) => c.href === currentHref))
  );

  const prev = currentIdx > 0 ? allItems[currentIdx - 1] : null;
  const next =
    !isChild && currentIdx < allItems.length - 1
      ? allItems[currentIdx + 1]
      : null;

  return (
    <GuideLayout>
      {page.content}
      <NavPagination prev={prev} next={next} />
    </GuideLayout>
  );
}
