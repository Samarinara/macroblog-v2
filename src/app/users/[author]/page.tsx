"use client";
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

 
export default function AuthorPage({ params }: { params: { author: string } }) {
    const { author } = use(params);
    const authorsData = useQuery(api.users.getUserByUsername, { username: author });

    // 1. Handle the loading state
    if (authorsData === undefined) {
        return (
            <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
                <Card className="p-10 m-[2vh] w-[90vw] sm:w-[45vw]">
                    <Skeleton className="h-8 w-1/2 mb-4 bg-emerald-900" />
                    <Skeleton className="h-4 w-full mb-2 bg-emerald-900" />
                    <Skeleton className="h-4 w-3/4 bg-emerald-900" />
                </Card>
            </div>
        );
    }

    // 2. Handle the "not found" state
    if (authorsData.length === 0) {
        return <div className="flex justify-center items-center w-screen h-screen">Author "{author}" not found.</div>;
    }

    const authorData = authorsData[0];

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
            <Card className="p-10 m-[2vh] w-[90vw] sm:w-[45vw] lg:hover:scale-102 transition-transform">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{authorData.displayName}</h1>
                <p className="text-lg text-gray-500 mb-4">@{authorData.username}</p>
                <p className="text-gray-700">{authorData.bio}</p>
                <p className="text-sm text-gray-400 mt-4">{authorData.email}</p>
            </Card>
        </div>
  );
}