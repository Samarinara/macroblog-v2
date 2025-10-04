"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import StoreUser from "./StoreUser";
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <Input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for users..." className="w-40 sm:w-64" />
      <Button type="submit" size="icon" variant="ghost"><Search className="h-5 w-5" /></Button>
    </form>
  );
}

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-screen bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-[10vh] items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400 hover:opacity-80 transition-opacity">
          MACROBLOG
        </Link>
        <div className="hidden md:flex flex-1 justify-center px-4">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Authenticated>
            <Button asChild variant="ghost">
              <Link href="/upload">
                <PlusCircle className="h-5 w-5 mr-2" />
                New Post
              </Link>
            </Button>
            <StoreUser />
            <UserButton afterSignOutUrl="/" />
          </Authenticated>
          <Unauthenticated>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Sign Up</Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
      </div>
    </header>
  );
}
