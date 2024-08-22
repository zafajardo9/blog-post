"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { Post } from "@/utils/actions/posts";
import { PostForm } from "@/components/module/user";
import { User } from "@supabase/supabase-js";

interface PostHandlerProps {
  initialPosts: Post[];
}

export function PostHandler({ initialPosts }: PostHandlerProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    fetchCurrentUser();

    const channel = supabase
      .channel('posts_channel')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts((current) => [payload.new as Post, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((current) => [newPost, ...current]);
  };

  const formatEmail = (email: string) => {
    const [username, domain] = email.split('@');
    return `@${username.slice(0, 5)}...@${domain}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PostForm onPostCreated={handlePostCreated} />
      <div className="mt-8 space-y-6">
        {posts.map((post) => (
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
                  <button className="text-gray-400 hover:text-red-500 transition duration-200">
                    <MdDeleteOutline size={20} />
                  </button>
                  <button className="text-gray-400 hover:text-pink-500 transition duration-200">
                    <CiHeart size={20} />
                  </button>
                </div>
              </div>
              <p className="text-gray-100 mb-4">{post.posts}</p>
              <div className="text-blue-400 text-sm">
                {currentUser && post.user_id === currentUser.id
                  ? formatEmail(currentUser.email || '')
                  : 'Anonymous User'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}