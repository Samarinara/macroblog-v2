"use client";

import { useAction, useQuery } from "convex/react";
import "highlight.js/styles/github-dark.css";

import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { type Id, type Doc } from "../../../../convex/_generated/dataModel";
import { use, useState, useEffect } from "react";
import Header from "src/app/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { MarkdownRenderer } from "src/app/MarkdownRenderer";

type Post = Doc<"posts"> & { content: string };

export default function PostPage({
  params,
}: { params: Promise<{ postId: string }> }) {
  const { postId } = use(params);
  const getPostAction = useAction(api.posts.getPostWithContent);
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    getPostAction({ postId: postId as Id<"posts"> })
      .then(setPost)
      .catch(console.error);
  }, [getPostAction, postId]);

  const author = useQuery(
    api.users.getUserById,
    post ? { userId: post.userId } : "skip",
  );

  if (post === undefined || author === undefined) {
    return (
      <div className="w-screen min-h-screen bg-gray-50 dark:bg-zinc-900">
        <Header />
        <div className="pt-[10vh] container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-10">
              <Skeleton className="h-12 w-3/4 mb-4 bg-emerald-200 dark:bg-emerald-800" />
              <Skeleton className="h-6 w-1/4 mb-8 bg-emerald-200 dark:bg-emerald-800" />
              <Skeleton className="h-4 w-full mb-2 bg-emerald-200 dark:bg-emerald-800" />
              <Skeleton className="h-4 w-full mb-2 bg-emerald-200 dark:bg-emerald-800" />
              <Skeleton className="h-4 w-5/6 bg-emerald-200 dark:bg-emerald-800" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="w-screen min-h-screen bg-gray-50 dark:bg-zinc-900">
        <Header />
        <div className="pt-[10vh] flex flex-col items-center justify-center h-[90vh]">
          <Card className="p-10 my-[2vh] w-[90vw] sm:w-[60%]">
            <h1 className="text-2xl font-bold">Post not found</h1>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-50 dark:bg-zinc-900">
      <Header />
      <div className="pt-[10vh] flex justify-center">
        <div className="w-[95vw] lg:w-[80vw] xl:w-[70vw] p-4 grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <main className="lg:col-span-2">
            <Card className="p-6 sm:p-10 my-[2vh] w-full mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                {post.title}
              </h1>
              {/* All markdown features now supported */}
              <MarkdownRenderer content={post.content} />
            </Card>
          </main>

          <aside className="lg:col-span-1">
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
                <Skeleton className="h-8 w-32 bg-emerald-200 dark:bg-emerald-800" />
              )}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
