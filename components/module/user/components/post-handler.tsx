"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { Post, readPosts } from "@/utils/actions/posts";
import { PostForm, PostSkeleton } from "@/components/module/user";
import { User } from "@supabase/supabase-js";
interface PostHandlerProps {
  initialPosts: Post[];
}

interface PostWithUser extends Post {
  user_email: string | null;
}

export function PostHandler({ initialPosts }: PostHandlerProps) {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchUserEmails = useCallback(
    async (fetchedPosts: Post[]): Promise<PostWithUser[]> => {
      const postsWithUsers = await Promise.all(
        fetchedPosts.map(async (post) => {
          const { data, error } = await supabase.rpc("get_user_email", {
            user_id: post.user_id,
          });
          if (error) {
            console.error("Error fetching user email:", error);
            return { ...post, user_email: null };
          }
          return { ...post, user_email: data };
        })
      );
      return postsWithUsers;
    },
    [supabase]
  );

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);

      const fetchedPosts = await readPosts();
      const postsWithUsers = await fetchUserEmails(fetchedPosts);

      setPosts(postsWithUsers);
      setIsLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel("posts_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newPost = payload.new as Post;
            const [postWithUser] = await fetchUserEmails([newPost]);
            setPosts((current) => [postWithUser, ...current]);
          } else if (payload.eventType === "DELETE") {
            const deletedPostId = payload.old.id;
            setPosts((current) =>
              current.filter((post) => post.id !== deletedPostId)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchUserEmails]);

  const handlePostCreated = async (newPost: Post) => {
    const [postWithUser] = await fetchUserEmails([newPost]);
    setPosts((current) => [postWithUser, ...current]);
  };

  const handleDeletePost = async (postId: number) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) {
      setPosts((current) => current.filter((post) => post.id !== postId));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PostForm onPostCreated={handlePostCreated} />

      <div className="my-8 space-y-6">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg shadow-lg overflow-hidden border border-gray-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 text-sm">
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                  <div className="flex gap-4">
                    {currentUser && currentUser.id === post.user_id && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-gray-400 hover:text-red-500 transition duration-200"
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-pink-500 transition duration-200">
                      <CiHeart size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-100 mb-4">{post.posts}</p>
                <div className="text-blue-400 text-sm">
                  {post.user_email || "Anonymous User"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
