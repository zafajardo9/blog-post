"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/posts");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();
  const domain = process.env.NEXT_PUBLIC_DOMAIN || headers().get("origin");




  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${domain}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/login?message=Check email to continue sign in process");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}