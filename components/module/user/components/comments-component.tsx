"use client";

import React, { useState, useEffect } from "react";
import {
  createComment,
  fetchComments,
  deleteComment,
} from "@/utils/actions/posts";
import { useToast } from "@/components/ui/use-toast";
import { Comment, CommentSectionProps } from "@/types";
import { TrashIcon, PaperPlaneIcon } from "@radix-ui/react-icons";

export function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const fetchedComments = await fetchComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load comments. Please try again.",
      });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;

    try {
      const comment = await createComment(postId, newComment);
      setComments([...comments, comment]);
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment. Please try again.",
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast({
        title: "Success",
        description: "Comment deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment. Please try again.",
      });
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-base font-semibold mb-2">Comments</h3>
      <ul className="space-y-2 my-4">
        {comments.map((comment) => (
          <li key={comment.id} className="bg-zinc-800 p-2 rounded">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs text-gray-400">
                {comment.user_email}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-300">{comment.content}</p>
            {currentUserId === comment.user_id && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="size-8 rounded-full flex justify-center items-center bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                  aria-label="Delete comment"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmitComment} className="relative">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="text-xs w-full p-2 pr-12 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a comment..."
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 focus:outline-none"
          disabled={!currentUserId || !newComment.trim()}
        >
          <PaperPlaneIcon className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}
