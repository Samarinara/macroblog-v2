import { agent } from "@/lib/api";

export default async function Homepage() {

  return (
    <div className="grid grid-rows-{2} w-screen h-screen">
      <div className="grid grid-cols-2">
        <div className="bg-black text-white flex relative">
          <div className="absolute md:bottom-0 right-[5vw] bottom-[2vh] text-[10vw]">
            <span>M</span>
            <span>A</span>
            <span>C</span>
            <span>R</span>
            <span>O</span>
          </div>
        </div>
        <div></div>
      </div>
      <div className="grid grid-cols-2">
        <div></div>
        <div className="bg-black text-white relative">
          <div className="absolute md:top-0 left-[5vw] top-[2vh] text-[10vw]">
            <div className="flex flex-col md:flex-row">
              <span>B</span>
              <span>L</span>
              <span>O</span>
              <span>G</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

