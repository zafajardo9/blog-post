
import AuthButton from "../components/AuthButton";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import NavigationLogo from "../components/NavigationLogo";
import Footer from "@/components/FooterComponent";

import { canInitSupabaseClient } from "@/utils/supabaseConnect";

export default async function Index() {
  const isSupabaseConnected = canInitSupabaseClient();


  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <NavigationLogo />
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="animate-in flex-1 flex justify-center items-center">
        <Header />

        {/* <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Next steps</h2>
          {isSupabaseConnected ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
        </main> */}
      </div>

      <Footer />
    </div>
  );
}
