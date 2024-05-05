"use server"


import { revalidatePath, unstable_noStore as no_store } from 'next/cache';
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@/utils/supabase/server";
// export async function createPost() {
// const supabase = await createServerClient();
// }

// export async function readPost() {

// }

// export async function deletePostById(id: string) {

// }   
// export async function updatePostById(id: string) {

// }   


//ITO DAPAT YUN
// const signOut = async () => {
//     "use server";

//     const supabase = createClient();
//     await supabase.auth.signOut();
//     return redirect("/login");
//   };

export async function readPosts() {
    no_store();
    const supabase = await createClient();
    const result = await supabase.from('posts').select('*');
    return result;
  }