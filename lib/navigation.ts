// lib/navigation.ts
import { getAllGuidePages } from "./content";

export interface NavItem {
  title: string;
  slug: string[];
  href: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export async function buildNavigation(): Promise<NavGroup[]> {
  const pages = await getAllGuidePages();
  const groups: Record<string, NavItem[]> = {};

  for (const { frontmatter, slug } of pages) {
    const g = frontmatter.group;
    if (!groups[g]) groups[g] = [];
    groups[g].push({
      title: frontmatter.title,
      slug,
      href: `/guide/${slug.join("/")}`,
    });
  }

  // group 내 첫 번째 항목의 order 순으로 그룹 정렬
  return Object.entries(groups).map(([group, items]) => ({ group, items }));
}
