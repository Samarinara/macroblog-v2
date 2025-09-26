import { agent } from "@/lib/api";
import "./page.css"

export default async function Homepage() {

  return (
    <div className="grid grid-rows-{2} w-screen h-screen">
      <div className="grid grid-cols-2">
        <div className="bg-black text-white flex relative">
          <div className="absolute md:bottom-0 right-[5vw] bottom-[2vh] text-[10vw]">
            <div className="flex flex-col md:flex-row space-x-0 -py-25">
              <span className=" dynamic-column-text">M</span>
              <span className=" dynamic-column-text">A</span>
              <span className=" dynamic-column-text">C</span>
              <span className=" dynamic-column-text">R</span>
              <span className=" dynamic-column-text">O</span>

            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="grid grid-cols-2">
        <div></div>
        <div className="bg-black text-white relative">
          <div className="absolute md:top-0 left-[5vw] top-[2vh] text-[10vw]">
            <div className="flex flex-col md:flex-row">
              <span className=" dynamic-column-text">B</span>
              <span className=" dynamic-column-text">L</span>
              <span className=" dynamic-column-text">O</span>
              <span className=" dynamic-column-text">G</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

