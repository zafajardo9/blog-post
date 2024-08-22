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

// export async function readPosts() {
//     no_store();
//     const supabase = await createClient();
//     const result = await supabase.from('posts').select('*');
//     return result;
// }


export interface Post {
  id: number;
  created_at: string;
  posts: string;
  user_id: string;
}

export async function createPost(content: string): Promise<Post> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .insert([{ posts: content }])
    .select()
    .single();

  if (error) {
    console.error('Error inserting post:', error);
    throw error;
  }

  revalidatePath('/notes');

  return data as Post;
}

export async function readPosts(): Promise<Post[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }

  return data as Post[];
}

export async function deletePost(id: number): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw error;
  }

  revalidatePath('/notes');
}