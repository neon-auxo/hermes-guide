import type { MDXComponents } from "mdx/types";
import { Callout } from "./callout";
import { TerminalBlock } from "./terminal-block";
import { WindowsNote } from "./windows-note";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-8 scroll-m-20 text-3xl font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-10 scroll-m-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props) => <p className="mt-4 leading-7" {...props} />,
  ul: (props) => <ul className="mt-4 ml-6 list-disc [&>li]:mt-2" {...props} />,
  ol: (props) => (
    <ol className="mt-4 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  table: (props) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-border px-3 py-2 text-left font-semibold bg-muted"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-border px-3 py-2" {...props} />
  ),
  a: (props) => (
    <a
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  code: ({ children, ...props }) => {
    // rehype-pretty-code sets data-language on block code — skip styling those
    if ("data-language" in props) {
      return <code {...props}>{children}</code>;
    }
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary"
        {...props}
      >
        {children}
      </code>
    );
  },
  Callout,
  TerminalBlock,
  WindowsNote,
};
