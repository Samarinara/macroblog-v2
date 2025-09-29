"use client";
import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
 
export default function AuthorPage({ params }: { params: { author: string } }) {
    const { author } = use(params);
    const authorsData = useQuery(api.users.getUserByUsername, { username: author });

    // 1. Handle the loading state
    if (authorsData === undefined) {
        return <div>Loading author profile...</div>;
    }

    // 2. Handle the "not found" state
    if (authorsData.length === 0) {
        return <div>Author "{author}" not found.</div>;
    }

    const authorData = authorsData[0];

    return (
    <div>
      <h1>Author Profile</h1>
      <p>Viewing profile for: {authorData.displayName} ({authorData.username})</p>
      <p>Email: {authorData.email}</p>
      <p>Bio: {authorData.bio}</p>
    </div>
  );
}