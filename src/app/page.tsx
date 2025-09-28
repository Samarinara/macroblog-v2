import "./page.css"

import { agent } from "@/lib/api";

import { Search } from "@mui/icons-material"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"


export default async function Homepage() {
  const feeds = await agent.app.bsky.unspecced.getPopularFeedGenerators({
    limit: 20,
  });

  return (
    <div className="grid lg:grid-cols-2 w-screen h-screen bg-gray-100 overflow-x-hidden">
      <div className="flex bg-green-900 allign-center justify-center items-center lg:text-[7vw] text-[15vw] text-white flex-col lg:h-[100vh] md:h-[40vh] h-[25vh] p-3">
        <h1>MACROBLOG</h1>
        <div className="flex flex-row gap-4">
          <Input placeholder="Search" className="lg:w-[30vw] lg:h-[7vh] h-[5vh] w-[60vw] text-xl border"/>
          <Button className="h-[5vh] w-[20vw] lg:w-[5vw] lg:h-[7vh] "><Search /></Button>
        </div>
      </div>
      <div className="flex m-[1vw] lg:allign-center lg:justify-center flex-col sm:flex-row md:w-[50vw] w-[100vw] lg:overflow-x-hidden md:overflow-x-visible sm:overflow-x-hidden">
        <Card className="lg:fixed bg-green-900 text-white p-4 m-[1vh] text-[3vh] lg:z-1 md:h-[15vh] lg:h-auto sm:h-[12vh]">
          <h1>Featured Blogs</h1>
        </Card>
        <ul>
          {feeds.data.feeds.map((feed) => (
            <li key={feed.displayName}>
              <Card className="p-10 m-[2vh] lg:hover:scale-102 transition-transform">
                <h1 className="text-[3vw]">{feed.displayName}</h1>
                <p>{feed.description}</p>

              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
