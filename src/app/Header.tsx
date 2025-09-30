"use client";
import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import StoreUser from "./StoreUser";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 h-[10vh] w-screen bg-emerald-900 text-white fixed top-0 z-50 shadow-md">
      <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
        MACROBLOG
      </Link>
      <div className="flex items-center gap-4">
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
        <Authenticated>
          <StoreUser />
          <UserButton/>
        </Authenticated>
      </div>
    </header>
  );
}
