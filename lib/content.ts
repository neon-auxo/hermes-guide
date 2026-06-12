// lib/content.ts
import fs from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx/mdx-components";

const GUIDE_DIR = path.join(process.cwd(), "content", "guide");

export interface GuideFrontmatter {
  title: string;
  description: string;
  order: number;
  group: string;
}

async function readMdxFile(filePath: string) {
  return fs.readFile(filePath, "utf-8");
}

async function compilePage(source: string) {
  return compileMDX<GuideFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: "one-dark-pro" }],
        ],
      },
    },
    components: mdxComponents,
  });
}

/** slug 배열 → 파일 경로 변환 */
function slugToPath(slug: string[]): string {
  return path.join(GUIDE_DIR, ...slug) + ".mdx";
}

export async function getGuidePage(slug: string[]) {
  const filePath = slugToPath(slug);
  const source = await readMdxFile(filePath);
  const { content, frontmatter } = await compilePage(source);
  return { content, frontmatter, slug };
}

/** content/guide 하위 모든 .mdx 파일의 slug 목록 반환 */
export async function getAllGuideSlugs(): Promise<string[][]> {
  const slugs: string[][] = [];

  async function walk(dir: string, prefix: string[]) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        await walk(path.join(dir, entry.name), [...prefix, entry.name]);
      } else if (entry.name.endsWith(".mdx")) {
        slugs.push([...prefix, entry.name.replace(/\.mdx$/, "")]);
      }
    }
  }

  await walk(GUIDE_DIR, []);
  return slugs;
}

/** 사이드바용: 모든 페이지의 frontmatter + slug 반환 (order 순 정렬) */
export async function getAllGuidePages() {
  const slugs = await getAllGuideSlugs();
  const pages = await Promise.all(
    slugs.map(async (slug) => {
      const source = await readMdxFile(slugToPath(slug));
      const { frontmatter } = await compilePage(source);
      return { frontmatter, slug };
    })
  );
  return pages.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}
