import { UserLayout } from "@/components/module/user";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function StudentRootLayout({
  children,
}: React.PropsWithChildren) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <UserLayout>{children}</UserLayout>;
}
