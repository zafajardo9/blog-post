"use client";

import React, { useState } from "react";

import { IoSend, IoSendOutline } from "react-icons/io5";

export function PostForm() {
  const [postContent, setPostContent] = useState("");

  const handlePostContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostContent(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send the post content to the server
    console.log("Post content:", postContent);
    // Reset the form after submission
    setPostContent("");
  };

  return (
    <div className="mt-20">
      <div className="rounded-lg shadow-md p-4 border">
        <div className="">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-neutral-900"
                placeholder="Write your post here..."
                value={postContent}
                onChange={handlePostContentChange}
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover items-center"
              >
                <IoSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
