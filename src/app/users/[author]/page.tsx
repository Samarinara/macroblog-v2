"use client";
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { type Doc } from "../../../../convex/_generated/dataModel";
 import { useRouter } from "next/navigation";

import Header from "src/app/Header"

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function PostCard({ post }: { post: Doc<"posts"> }) {
    const router = useRouter();

    const handleCardClick = () => {
        if (post._id) {
        router.push(`/posts/${post._id}`);
        }
    };
    return (
        <Card onClick={handleCardClick} className="p-10 m-[2vh] w-[90vw] sm:w-[45vw] lg:hover:scale-102 transition-transform">
            <h1 className="text-2xl font-semibold">{post.title}</h1>
            <p className="text-gray-600 mt-2 truncate">{post.excerpt ?? "Click to read more..."}</p>
            <p className="text-sm text-gray-400 mt-4">{new Date(post.createdAt).toLocaleDateString()}</p>
        </Card>
    );
}
 
export default function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
    const { author } = use(params);
    const authorsData = useQuery(api.users.getUserByUsername, { username: author });
    const authorData = authorsData?.[0];

    const authorsPosts = useQuery(
        api.posts.getUsersPosts,
        authorData ? { userId: authorData._id } : "skip"
    );
    
    if (authorsData === undefined) {
        return (
            <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
                <Card className="p-10 m-[2vh] w-[90vw] sm:w-[45vw]">
                    <Skeleton className="h-8 w-1/2 mb-4 bg-emerald-300" />
                    <Skeleton className="h-4 w-full mb-2 bg-emerald-300" />
                    <Skeleton className="h-4 w-3/4 bg-emerald-300" />
                </Card>
            </div>
        );
    }
    
    if (!authorData) {
        return (
            <div className="w-screen h-screen bg-gray-100">
                <Header />
                <div className="pt-[10vh] flex flex-col items-center justify-center">
                    <Card className="p-10 my-[2vh] w-[90vw] sm:w-[60%]">
                        <h1 className="text-2xl font-bold">Author not found</h1>
                    </Card>
                </div>
            </div>
        );
    }
    

        return( 
        <div className="w-screen h-screen">
            <div> 
                <Header></Header>
            </div>
            <div className="pt-[10vh] bg-gray-100 flex flex-col items-center justify-center">
                <div className="sm:w-[60%] w-[90vw] p-4">
                    <Card className="sticky top-[11vh] p-10 my-[2vh] w-full mx-auto z-10 lg:hover:scale-102 transition-transform">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{authorData.displayName}</h1>
                        <p className="text-lg text-gray-500 mb-4">@{authorData.username}</p>
                        <p className="text-gray-700">{authorData.bio}</p>
                        <p className="text-sm text-gray-400 mt-4">{authorData.email}</p>
                    </Card>
                    <ul className="flex flex-col items-center">
                        {authorsPosts?.map((post) => ( 
                            <PostCard key={post._id} post={post} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
        );

}
