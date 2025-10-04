"use client";
 
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

function UserCard({ user }: { user: any }) {
  const router = useRouter();

  const handleCardClick = () => {
    if (user.username) {
      router.push(`/users/${user.username}`);
    }
  };

  return (
    <Card className="p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <h3 className="text-lg font-semibold">{user.displayName}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{user.bio}</p>
    </Card>
  );
}

function PostCard({ post }: { post: any }) {
  const router = useRouter();
 
  if (!post.author) {
    return null;
  }
 
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{post.author.displayName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{post.author.username}</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{post.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span key={tag} className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-emerald-900 dark:text-emerald-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
 
export default function Homepage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [query, setQuery] = useState("");
  const router = useRouter();
 
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  const createPost = useMutation(api.posts.createPost); 
 
  const posts = useQuery(api.posts.getWithUsers);
  const featuredUsersByEmail = useQuery(api.users.getByEmails, { 
    emails: ["samkatevatis@gmail.com", "yaugustlam@gmail.com"] 
  });

  const featuredUsers = featuredUsersByEmail?.filter((user): user is NonNullable<typeof user> => user !== null);
 
  return (
    <>
      <Header />
      <div className="flex bg-green-900 justify-center items-center lg:text-[7vw] text-[15vw] text-white flex-col lg:h-[100vh] md:h-[40vh] h-[25vh] p-3">
        <h1>MACROBLOG</h1>
        <form onSubmit={handleSearch} className="flex flex-row gap-4">
          <Input
            placeholder="Search for users..."
            className="lg:w-[30vw] lg:h-[7vh] h-[5vh] w-[60vw] text-xl text-black bg-[#F8F5F0] border"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" className="h-[5vh] w-[20vw] lg:w-[5vw] lg:h-[7vh] "><Search /></Button>
        </form>
        <div  className="-m-[1vh]">
          <Unauthenticated>
            <SignUpButton>
              <Button className="lg:h-[7vh] h-[5vh] w-[30vw] lg:w-[10vw]">Get Started</Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
        <Button
            variant="ghost"
            className="absolute bottom-10 animate-bounce"
            onClick={() => {
              document.getElementById("featured-users")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ChevronDown className="h-8 w-8" />
        </Button>
      </div>
      <div id="featured-users" className="container mx-auto px-4 py-12 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Bloggers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredUsers?.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </>
  );
}