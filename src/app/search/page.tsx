"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "../Header";

function UserCard({ user }: { user: any }) {
  const router = useRouter();

  const handleCardClick = () => {
    if (user.username) {
      router.push(`/users/${user.username}`);
    }
  };

  return (
    <Card
      className="p-6 mb-4 lg:hover:scale-102 transition-transform cursor-pointer"
      key={user._id}
      onClick={handleCardClick}
    >
      <h2 className="text-2xl font-bold">{user.displayName}</h2>
      <p className="text-sm text-gray-500">@{user.username}</p>
      <p className="mt-2">{user.bio}</p>
    </Card>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const users = useQuery(api.users.search, { query: query || "" });

  if (users === undefined) {
    return (
      <div>
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
      </div>
    );
  }

  if (users.length === 0) {
    return <p>No users found for &quot;{query}&quot;.</p>;
  }

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 pt-[15vh]">
        <h1 className="text-4xl font-bold mb-8">Search Results</h1>
        <Suspense fallback={<p>Loading search results...</p>}>
          <SearchResults />
        </Suspense>
      </main>
    </>
  );
}