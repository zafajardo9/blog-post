import AuthButton from "@/components/AuthButton";
import Footer from "@/components/FooterComponent";
import DeployButton from "@/components/NavigationLogo";
export function UserLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <div className="w-full">
        <nav className="bg-zinc-950 w-full flex justify-center border-b border-b-foreground/10 h-16 mt-0 fixed z-10 top-0">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <DeployButton />
            <AuthButton />
          </div>
        </nav>
        <div className="mt-16">
          <div className="animate-in w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
