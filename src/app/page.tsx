"use client";
import "./page.css"

import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { Search } from "@mui/icons-material"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Homepage() {
  const createPost = useMutation(api.posts.createPost);
  const users = useQuery(api.users.allUsers);


  const handleAddPost = async () => {
    await createPost({
      title: "My First Post!",
      content: "This is a dummy post created from the frontend.",
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
              <UserButton />
            </Authenticated>
          </header>        
        </div>
      <div className="flex bg-green-900 allign-center justify-center items-center lg:text-[7vw] text-[15vw] text-white flex-col lg:h-[100vh] md:h-[40vh] h-[25vh] p-3">
        <h1>MACROBLOG</h1>
        <div className="flex flex-row gap-4">
          <Input placeholder="Search" className="lg:w-[30vw] lg:h-[7vh] h-[5vh] w-[60vw] text-xl border"/>
          <Button className="h-[5vh] w-[20vw] lg:w-[5vw] lg:h-[7vh] "><Search /></Button>
        </div>
        <div  className="-m-[1vh]">
          <Unauthenticated>
            <SignUpButton>
              <Button className="h-[5vh] w-[20vw]">
                Start Blogging
              </Button>
            </SignUpButton>               
          </Unauthenticated>
          <Authenticated>
            <Button className="h-[5vh] w-[20vw]" onClick={handleAddPost}>
              Add Dummy Post
            </Button>
          </Authenticated>
        </div>
      </div>
      <div className="flex m-[1vw] lg:allign-center lg:justify-center flex-col sm:flex-row md:w-[50vw] w-[100vw] lg:overflow-x-hidden md:overflow-x-visible sm:overflow-x-hidden">
        <Card className="lg:fixed bg-green-900 text-white p-4 m-[1vh] text-[3vh] lg:z-1 md:h-[15vh] lg:h-auto sm:h-[12vh]">
          <h1>Featured Blogs</h1>
        </Card>
        <ul>
{/*             <li key="hello">
              {users?.map(({ _id, displayName, bio }) => 
              <Card className="p-10 m-[2vh] sm:w-[45vw] lg:hover:scale-102 transition-transform" key={_id}>
                <h1 className="text-3xl sm:text-2xl ">{displayName}</h1>
                <p>{bio}</p>
              
              </Card>
            )}
            </li> */}
        </ul>
      </div>
    </div>
  );
}
