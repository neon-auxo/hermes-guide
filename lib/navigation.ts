// lib/navigation.ts
import { cache } from "react";
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

export const buildNavigation = cache(async (): Promise<NavGroup[]> => {
  const pages = await getAllGuidePages();
  const groups: Record<string, NavItem[]> = {};
  const groupOrder: Record<string, number> = {};

  for (const { frontmatter, slug } of pages) {
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

  return Object.entries(groups)
    .sort(([a], [b]) => (groupOrder[a] ?? 0) - (groupOrder[b] ?? 0))
    .map(([group, items]) => ({ group, items }));
});
