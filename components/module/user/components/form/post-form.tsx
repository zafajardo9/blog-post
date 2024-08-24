"use client";
import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { FaImage } from "react-icons/fa";
import { createPost, Post } from "@/utils/actions/posts";

interface PostFormProps {
  onPostCreated: (newPost: Post) => void;
}

export function PostForm({ onPostCreated }: PostFormProps) {
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostContent(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newPost = await createPost(postContent);
      setPostContent("");
      onPostCreated(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-lg shadow-lg overflow-hidden border border-zinc-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100">
            Create a New Post
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <textarea
              className="w-full bg-transparent border-gray-400 rounded-lg p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-transparent transition duration-200 ease-in-out placeholder-gray-400 resize-none h-24"
              placeholder="What's on your mind?"
              value={postContent}
              onChange={handlePostContentChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center text-gray-400 hover:text-gray-200 transition duration-200 ease-in-out"
            >
              <FaImage className="mr-2" />
              Add Image
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-full flex items-center ${
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white transition duration-200 ease-in-out"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post"}
              <IoSend className="ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
