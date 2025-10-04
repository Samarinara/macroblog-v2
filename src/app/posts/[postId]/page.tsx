"use client";

import { useAction, useQuery } from "convex/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import "highlight.js/styles/github-dark.css";

import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { type Id, type Doc } from "../../../../convex/_generated/dataModel";
import { use, useState, useEffect } from "react";
import Header from "src/app/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

type Post = Doc<"posts"> & { content: string };

const rehypeHighlightAuto = rehypeHighlight as unknown as (
  ...args: any[]
) => any;

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: object;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose lg:prose-xl max-w-none mt-8 dark:prose-invert prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings as any, { behavior: "append", properties: { className: "anchor" } }],
          [rehypeHighlightAuto as any, { detect: true, ignoreMissing: true }],
        ]}
        components={{
          h1: ({ node, ...props }) => <h1 className="mt-8 mb-4 text-4xl font-bold tracking-tight" {...props} />,
          h2: ({ node, ...props }) => <h2 className="mt-8 mb-3 text-3xl font-semibold" {...props} />,
          h3: ({ node, ...props }) => <h3 className="mt-6 mb-2 text-2xl font-semibold" {...props} />,
          h4: ({ node, ...props }) => <h4 className="mt-6 mb-2 text-xl font-semibold" {...props} />,
          h5: ({ node, ...props }) => <h5 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
          h6: ({ node, ...props }) => <h6 className="mt-4 mb-2 text-base font-semibold uppercase tracking-wide" {...props} />,

          p: ({ node, ...props }) => <p className="leading-7" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          del: ({ node, ...props }) => <del className="line-through" {...props} />,
          hr: () => <hr className="my-8 border-t border-gray-200 dark:border-zinc-800" />,

          a: ({ node, href, ...props }) => {
            const isInternal = href?.startsWith("/") || href?.startsWith("#");
            if (isInternal) {
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

          img: ({ node, ...props }) => (
            <img className="rounded-md border border-gray-200 dark:border-zinc-800 max-w-full" {...props} />
          ),

          blockquote: ({ node, ...props }) => (
            <blockquote
              className="mt-6 mb-6 border-l-4 border-gray-300 dark:border-zinc-700 pl-4 italic text-gray-700 dark:text-zinc-300"
              {...props}
            />
          ),

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

          pre: ({ node, ...props }) => (
            <pre className="my-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-800" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: CodeProps) => {
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
              <code className={className ? className : "hljs"} {...props}>
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

export default function PostPage({
  params,
}: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params);
  const getPostAction = useAction(api.posts.getPostWithContent);
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    getPostAction({ postId: postId as Id<"posts"> }).then(setPost);
  }, [getPostAction, postId]);

  const author = useQuery(
    api.users.getUserById,
    post ? { userId: post.userId } : "skip",
  );

  if (post === undefined || author === undefined) {
    return (
      <div className="w-screen h-screen bg-gray-100">
        <Header />
        <div className="pt-[10vh] flex flex-col items-center justify-center">
          <Card className="p-10 my-[2vh] w-[90vw] sm:w-[60%]">
            <Skeleton className="h-10 w-3/4 mb-6 bg-emerald-300" />
            <Skeleton className="h-4 w-full mb-2 bg-emerald-300" />
            <Skeleton className="h-4 w-full mb-2 bg-emerald-300" />
            <Skeleton className="h-4 w-5/6 bg-emerald-300" />
          </Card>
        </div>
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="w-screen h-screen bg-gray-100">
        <Header />
        <div className="pt-[10vh] flex flex-col items-center justify-center">
          <Card className="p-10 my-[2vh] w-[90vw] sm:w-[60%]">
            <h1 className="text-2xl font-bold">Post not found</h1>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100">
      <Header />
      <div className="pt-[10vh] flex justify-center">
        <div className="w-[95vw] lg:w-[80vw] xl:w-[70vw] p-4 grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-10 my-[2vh] w-full mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {post.title}
              </h1>
              {/* All markdown features now supported */}
              <MarkdownRenderer content={post.content} />
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 my-[2vh] w-full mx-auto lg:sticky lg:top-[12vh]">
              {author ? (
                <>
                  <h2 className="text-xl font-bold">{author.displayName}</h2>
                  <Link href={`/users/${author.username}`}>
                    <p className="text-md text-gray-500 hover:underline">
                      @{author.username}
                    </p>
                  </Link>
                </>
              ) : (
                <Skeleton className="h-8 w-32 bg-emerald-300" />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
