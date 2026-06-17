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

  const childHrefs = new Set(
    groups.flatMap((g) => g.items.flatMap((item) => (item.children ?? []).map((c) => c.href)))
  );

  let prev: typeof allItems[0] | null = null;
  if (currentIdx > 0) {
    if (isChild) {
      prev = allItems[currentIdx - 1];
    } else {
      // non-child 페이지는 바로 앞의 child 항목을 건너뛰고 parent 항목으로 이동
      for (let i = currentIdx - 1; i >= 0; i--) {
        if (!childHrefs.has(allItems[i].href)) {
          prev = allItems[i];
          break;
        }
      }
    }
  }

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
