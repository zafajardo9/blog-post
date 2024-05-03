import AuthButton from "@/components/AuthButton";
import Footer from "@/components/FooterComponent";
import DeployButton from "@/components/NavigationLogo";
export function UserLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <DeployButton />
            <AuthButton />
          </div>
        </nav>
      </div>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        {children}
      </div>

      <Footer />
    </div>
  );
}
