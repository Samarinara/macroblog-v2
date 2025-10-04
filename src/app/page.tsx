"use client";
 
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { Search } from "@mui/icons-material"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMutation } from "convex/react";
import StoreUser from "./StoreUser";

const FeaturedUsers: string[] = ["samkatevatis@gmail.com"]

function FeaturedUserCard({ email }: { email: string }) {
  const router = useRouter();
  const users = useQuery(api.users.getUserByEmail, { email });

  // `users` is `undefined` while loading.
  if (users === undefined) {
    // While the user data is loading, or if the user is not found,
    // we can show a loading message or a skeleton component.
    return <Card className="p-10 m-[2vh] sm:w-[45vw]">
      <Skeleton className="bg-emerald-900"></Skeleton>
    </Card>;
  }

  // The query returns an array, so we take the first element.
  const user = users[0];

  // If the query returns an empty array, the user was not found.
  if (!user) {
    return <Card className="p-10 m-[2vh] sm:w-[45vw]">
      User with email {email} not found.
    </Card>;
  }

  const handleCardClick = () => {
    if (user.username) {
      router.push(`/users/${user.username}`);
    }
  };

  return (
    <Card
      className="p-10 m-[2vh] sm:w-[45vw] lg:hover:scale-102 transition-transform cursor-pointer"
      key={user._id}
      onClick={handleCardClick}
    >
      <h1 className="text-3xl sm:text-2xl ">{user.displayName}</h1>
      <p>{user.bio}</p>
      <p>{user.email}</p>
    </Card>
  );
}

export default function Homepage() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost); 

  const handleAddPost = async () => {
    // 1. Get an upload URL
    const uploadUrl = await generateUploadUrl();
    // 2. Create dummy markdown content and upload it
    const dummyContent = "# Hello World\n\nThis is a dummy post created from the frontend using file storage. It supports **markdown**!";
    const dummyFile = new File([dummyContent], "dummy.md", { type: "text/markdown" });
    const result = await fetch(uploadUrl, { method: "POST", body: dummyFile });
    const { storageId }: { storageId: string } = await result.json();
    // 3. Create the post with the new storageId
    await createPost({
      title: "My First Post!",
      storageId: storageId as any,
      excerpt: "This is a dummy post created from the frontend.",
      tags: ["testing", "first-post"],
    });
  }
  return (
    <div className="grid lg:grid-cols-2 w-screen h-screen bg-gray-100 overflow-x-hidden">
        <div className="absolute top-0 left-0 m-[2vw]">
          <header className="flex justify-center items-center p-4 gap-4 h-16 bg-gray-100 rounded-full">
            <Unauthenticated>
              <SignInButton />
              <SignUpButton>
                <Button className="text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </Button>
              </SignUpButton>
            </Unauthenticated>
            <Authenticated>
              <StoreUser />
              <UserButton />
            </Authenticated>
          </header>        
        </div>
      <div className="flex bg-green-900 justify-center items-center lg:text-[7vw] text-[15vw] text-white flex-col lg:h-[100vh] md:h-[40vh] h-[25vh] p-3">
        <h1>MACROBLOG</h1>
        <div className="flex flex-row gap-4">
          <Input placeholder="Search is not yet available" className="lg:w-[30vw] lg:h-[7vh] h-[5vh] w-[60vw] text-xl text-black bg-[#F8F5F0] border"/>
          <Button className="h-[5vh] w-[20vw] lg:w-[5vw] lg:h-[7vh] "><Search></Search></Button>
        </div>
        <div  className="-m-[1vh]">
          <Unauthenticated>
            <SignUpButton>
              <Button className="h-[5vh] w-[20vw]">
                Start Blogging
              </Button>
            </SignUpButton>               
          </Unauthenticated>
        </div>
      </div>
      <div className="flex m-[1vw] lg:allign-center lg:justify-center flex-col sm:flex-row md:w-[50vw] w-[100vw] lg:overflow-x-hidden md:overflow-x-visible sm:overflow-x-hidden">
        <Card className="lg:fixed bg-green-900 text-white p-4 m-[1vh] text-[3vh] lg:z-1 md:h-[15vh] lg:h-auto sm:h-[12vh]">
          <h1>Featured Blogs</h1>
        </Card>
        <ul>
          {FeaturedUsers.map((email) => (
            <li key={email}><FeaturedUserCard email={email} /></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
