"use client";
 
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api"; 
import { Unauthenticated } from "convex/react";
import { SignUpButton } from "@clerk/nextjs";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react"; 
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

export default function Homepage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
 
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
 
  const featuredUsersByEmail = useQuery(api.users.getByEmails, { 
    emails: ["samkatevatis@gmail.com", "yaugustlam@gmail.com", "benjamin@kerrfamily.ca", "sunnyhe848@gmail.com"] 
  });

  const featuredUsers = featuredUsersByEmail?.filter((user): user is NonNullable<typeof user> => user !== null) ?? [];
 
  return (
    <>
      <Header />
      <div className="flex bg-green-900 justify-center items-center lg:text-[7vw] text-[15vw] text-white flex-col lg:h-[100vh] md:h-[40vh] h-[35vh] p-3">
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
          {featuredUsers.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </>
  );
}