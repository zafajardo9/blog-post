"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

//ICONS
import { IoLogInSharp, IoLogOutSharp } from "react-icons/io5";
import { signOut } from "@/utils/auth-actions"; // Import the server action

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <button
        onClick={handleSignOut}
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex items-center"
      >
        <IoLogOutSharp className="mr-2" />
        Logout
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover items-center"
    >
      <IoLogInSharp className="mr-2" />
      Login
    </Link>
  );
}