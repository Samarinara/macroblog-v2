import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
// Ensure a single highlight.js theme is imported globally (e.g., app/globals.css)
import "highlight.js/styles/github-dark.css";

type MarkdownRendererProps = {
  content: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rehypeHighlightAuto = rehypeHighlight as unknown as (...args: unknown[]) => unknown;

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose lg:prose-xl max-w-none mt-8 dark:prose-invert prose-pre:bg-transparent">
      <ReactMarkdown
        // GFM: tables, task lists, autolinks, strikethrough, footnotes
        remarkPlugins={[remarkGfm]}
        // Headings get ids + self-links; code fences get hljs classes
        rehypePlugins={[
          rehypeSlug,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [rehypeAutolinkHeadings as any, { behavior: "append", properties: { className: "anchor" } }],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [rehypeHighlightAuto as any, { detect: true, ignoreMissing: true }],
        ]}
        // Map HTML tags to styled components so things look correct even without the Tailwind typography plugin
        components={{
          // Headings
          h1: ({ node, ...props }) => <h1 className="mt-8 mb-4 text-4xl font-bold tracking-tight" {...props} />,
          h2: ({ node, ...props }) => <h2 className="mt-8 mb-3 text-3xl font-semibold" {...props} />,
          h3: ({ node, ...props }) => <h3 className="mt-6 mb-2 text-2xl font-semibold" {...props} />,
          h4: ({ node, ...props }) => <h4 className="mt-6 mb-2 text-xl font-semibold" {...props} />,
          h5: ({ node, ...props }) => <h5 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
          h6: ({ node, ...props }) => <h6 className="mt-4 mb-2 text-base font-semibold uppercase tracking-wide" {...props} />,

          // Paragraphs and emphasis
          p: ({ node, ...props }) => <p className="leading-7" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          del: ({ node, ...props }) => <del className="line-through" {...props} />,
          hr: () => <hr className="my-8 border-t border-gray-200 dark:border-zinc-800" />,

          // Links
          a: ({ node, href, ...props }) => {
            const isInternal = href?.startsWith("/") || href?.startsWith("#");
            if (isInternal) {
              // Avoid importing next/link here; the page can wrap content or leave normal <a> for anchors
              return <a href={href} className="text-emerald-600 hover:underline dark:text-emerald-400" {...props} />;
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline dark:text-emerald-400"
                {...props}
              />
            );
          },

          // Images
          img: ({ node, ...props }) => (
            <img className="rounded-md border border-gray-200 dark:border-zinc-800 max-w-full" {...props} />
          ),

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="mt-6 mb-6 border-l-4 border-gray-300 dark:border-zinc-700 pl-4 italic text-gray-700 dark:text-zinc-300"
              {...props}
            />
          ),

          // Lists
          ul: ({ node, className, ...props }) => (
            <ul className="list-disc pl-6 my-4 space-y-2 marker:text-gray-500" {...props} />
          ),
          ol: ({ node, className, ...props }) => (
            <ol className="list-decimal pl-6 my-4 space-y-2 marker:text-gray-500" {...props} />
          ),
          li: ({ node, className, children, ...props }) => {
            const isTask = typeof className === "string" && className.includes("task-list-item");
            return (
              <li
                className={
                  (isTask ? "list-none pl-0 " : "") +
                  "leading-7 [&>input[type=checkbox]]:mr-2 flex items-start gap-2"
                }
                {...props}
              >
                {children}
              </li>
            );
          },
          input: ({ node, ...props }) => (
            <input
              {...props}
              disabled
              className="mt-[0.35rem] accent-emerald-600 dark:accent-emerald-500"
              type="checkbox"
            />
          ),

          // Tables
          table: ({ node, ...props }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full text-left border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-50 dark:bg-zinc-900/40" {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => (
            <tr className="border-b border-gray-200 dark:border-zinc-800" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 font-semibold text-gray-700 dark:text-zinc-200" {...props} />
          ),
          td: ({ node, ...props }) => <td className="px-3 py-2 align-top" {...props} />,

          // Code
          pre: ({ node, ...props }) => (
            <pre className="my-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-800" {...props} />
          ),
          code: ({
            inline,
            className,
            children,
            ...props
          }: { inline?: boolean; className?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>) => {
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 font-mono text-[0.9em]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className ?? "hljs"} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
