"use server"


import { revalidatePath, unstable_noStore as no_store } from 'next/cache';
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@/utils/supabase/server";
import { Comment, Post, UserEmailResult } from "@/types";


export async function createPost(content: string, images: { url: string; fileId: string }[]): Promise<Post> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .insert([{ posts: content, images: images }])
    .select()
    .single();

  if (error) {
    console.error('Error inserting post:', error);
    throw error;
  }

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

  revalidatePath('/posts');
}


// COMMENTS
export async function createComment(postId: number, content: string): Promise<Comment> {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, content, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}


export async function fetchComments(postId: number): Promise<Comment[]> {
  const supabase = createClient();
  
  // Fetch the comments
  const { data: commentsData, error: commentsError } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (commentsError) throw commentsError;

  if (!commentsData || commentsData.length === 0) {
    return [];
  }

  // Fetch the user emails using the RPC function
  const userIds = Array.from(new Set(commentsData.map(comment => comment.user_id)));
  const { data: userData, error: userError } = await supabase
    .rpc('get_user_emails', { user_ids: userIds }) as { data: UserEmailResult[] | null, error: any };

  if (userError) {
    console.error('Error fetching user emails:', userError);
    // If we can't fetch emails, return comments without them
    return commentsData;
  }

  const userMap = new Map(
    (userData ?? []).map((user: UserEmailResult) => [user.id, user.email])
  );

  // Combine comment data with user emails
  return commentsData.map(comment => ({
    ...comment,
    user_email: userMap.get(comment.user_id) ?? 'Unknown User'
  }));
}


export async function deleteComment(commentId: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}