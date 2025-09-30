 "use client";
 import { useAction, useQuery } from "convex/react";
 import ReactMarkdown from "react-markdown";
 import remarkGfm from "remark-gfm";
 import rehypeHighlight from "rehype-highlight";
 import "highlight.js/styles/github-dark.css";
 import Link from "next/link";
 import { api } from "../../../../convex/_generated/api";
 import { type Id } from "../../../../convex/_generated/dataModel";
 import { use, useState, useEffect } from "react";
 import Header from "src/app/Header";
 
import { Skeleton } from "@/components/ui/skeleton";
 import { Card } from "@/components/ui/card";
 
 export default function PostPage({
   params,
 }: { params: Promise<{ postId: string }> }) {
   const { postId } = use(params);
   // We need to use `useAction` for actions.
   // Since useAction doesn't return data directly, we'll manage state ourselves.
   const getPostAction = useAction(api.posts.getPostWithContent);
   const [post, setPost] = useState<Doc<"posts"> & { content: string } | null | undefined>(undefined);

   useEffect(() => {
     getPostAction({ postId: postId as Id<"posts"> }).then(setPost);
   }, [getPostAction, postId]);

   const author = useQuery(
     api.users.getUserById,
     post ? { userId: post.userId } : "skip",
   );
   

   // Loading state
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
 
   // Post not found state
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
               <article className="prose lg:prose-xl max-w-none mt-8">
                 <ReactMarkdown
                   remarkPlugins={[remarkGfm]}
                   rehypePlugins={[rehypeHighlight]}
                 >
                   {post.content}
                 </ReactMarkdown>
               </article>
             </Card>
           </div>
           <div className="lg:col-span-1">
             <Card className="p-6 my-[2vh] w-full mx-auto lg:sticky lg:top-[12vh]">
               {author ? (
                 <>
                   <h2 className="text-xl font-bold">{author.displayName}</h2>
                   <Link href={`/users/${author.username}`}>
                     <p className="text-md text-gray-500 hover:underline">@{author.username}</p>
                   </Link>
                   <p className="text-gray-600 mt-4 text-sm">{author.bio}</p>
                   <hr className="my-4" />
                   <p className="text-xs text-gray-400">
                     Published on {new Date(post.createdAt).toLocaleDateString()}
                   </p>
                   <div className="flex flex-wrap gap-2 mt-3">
                     {post.tags.map((tag) => (
                       <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{tag}</span>
                     ))}
                   </div>
                 </>
               ) : <Skeleton className="h-40 w-full bg-emerald-300" />}
             </Card>
           </div>
         </div>
       </div>
     </div>
   );
 }