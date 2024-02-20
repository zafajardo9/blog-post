import { HeroSection } from "@/components/module/home";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between px-5 inset-0 relative">
        <div>
          
          
          <h1>Welcome!</h1>
          
        </div>



      <HeroSection/>


        <footer className="flex-0 flex w-full items-center justify-center py-3">
          <div className="text-xs">
            <span>PUPQC RIS © 2023</span>
          </div>
        </footer>
      </div>
    </>
  );
}
