import { buildNavigation } from "@/lib/navigation";
import { Sidebar } from "./sidebar";

export async function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groups = await buildNavigation();

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
      <aside className="hidden md:block">
        <div className="sticky top-20">
          <Sidebar groups={groups} />
        </div>
      </aside>
      <article className="min-w-0 flex-1 max-w-3xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </article>
    </div>
  );
}
