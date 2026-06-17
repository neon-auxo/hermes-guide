// lib/navigation.ts
import { cache } from "react";
import { getAllGuidePages } from "./content";

export interface NavItem {
  title: string;
  slug: string[];
  href: string;
  children?: NavItem[];
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const buildNavigation = cache(async (): Promise<NavGroup[]> => {
  const pages = await getAllGuidePages();
  const groups: Record<string, NavItem[]> = {};
  const groupOrder: Record<string, number> = {};

  // 1st pass: top-level items only
  for (const { frontmatter, slug } of pages) {
    if (frontmatter.parentSlug) continue;
    const g = frontmatter.group;
    if (!groups[g]) {
      groups[g] = [];
      groupOrder[g] = frontmatter.order;
    }
    groups[g].push({
      title: frontmatter.title,
      slug,
      href: `/guide/${slug.join("/")}`,
    });
  }

  // 2nd pass: attach children under their parent item
  for (const { frontmatter, slug } of pages) {
    if (!frontmatter.parentSlug) continue;
    const g = frontmatter.group;
    const parent = groups[g]?.find(
      (item) => item.slug[item.slug.length - 1] === frontmatter.parentSlug
    );
    if (parent) {
      if (!parent.children) parent.children = [];
      parent.children.push({
        title: frontmatter.title,
        slug,
        href: `/guide/${slug.join("/")}`,
      });
    }
  }

  return Object.entries(groups)
    .sort(([a], [b]) => (groupOrder[a] ?? 0) - (groupOrder[b] ?? 0))
    .map(([group, items]) => ({ group, items }));
});
