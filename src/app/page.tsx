import { agent } from "@/lib/api";
import "./page.css"
import { Search } from "@mui/icons-material"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default async function Homepage() {

  return (
    <div className="grid lg:grid-cols-2 w-screen h-screen bg-gray-100">
      <div className="flex bg-green-900 allign-center justify-center items-center lg:text-[7vw] text-[15vw] text-white flex-col lg:h-[100vh] h-[33vh] p-3">
        <h1>MACROBLOG</h1>
        <div className="flex flex-row gap-4">
          <Input placeholder="Search" className="lg:w-[30vw] lg:h-[7vh] h-[5vh] w-[60vw] text-xl border"/>
          <Button className="h-[5vh] w-[20vw] lg:w-[5vw] lg:h-[7vh] "><Search /></Button>
        </div>
      </div>
      <div>

      </div>
    </div>
  );
}
