"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FaImage } from "react-icons/fa";
import { MdKeyboardVoice } from "react-icons/md";
import { createPost } from "@/utils/actions/posts";

import { Post } from "@/types";
import ImageKit from "imagekit-javascript";
import { Toaster } from "@/components/ui/toaster";

interface PostFormProps {
  onPostCreated: (newPost: Post) => void;
}

let imagekit: ImageKit | null = null;

export function PostForm({ onPostCreated }: PostFormProps) {
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //voice record
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError(
        "Failed to start recording. Please check your microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    const authenticationEndpoint = "/api/imagekit-auth";

    if (!publicKey || !urlEndpoint) {
      setError(
        "ImageKit configuration is missing. Please check your environment variables."
      );
      return;
    }

    imagekit = new ImageKit({
      publicKey: publicKey,
      urlEndpoint: urlEndpoint,
      authenticationEndpoint: authenticationEndpoint,
    } as any);
    console.log("ImageKit initialized:", imagekit);
  }, []);

  const handlePostContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostContent(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!imagekit) {
      setError("ImageKit is not initialized. Please check your configuration.");
      setIsSubmitting(false);
      return;
    }

    try {
      const authResponse = await fetch("/api/imagekit-auth");
      const authData = await authResponse.json();

      const uploadedImages = await Promise.all(
        selectedFiles.map((file) =>
          imagekit!.upload({
            file: file,
            fileName: file.name,
            useUniqueFileName: true,
            ...authData,
          })
        )
      );

      const newPost = await createPost(
        postContent,
        uploadedImages.map((img) => ({
          url: img.url,
          fileId: img.fileId,
        }))
      );

      setPostContent("");
      setSelectedFiles([]);
      onPostCreated(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("An error occurred while creating the post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg mb-4">{error}</div>
      )}
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
          {selectedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected file ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFiles((files) =>
                        files.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center text-gray-400 hover:text-gray-200 transition duration-200 ease-in-out"
            >
              <FaImage className="mr-2" />
            </button>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`size-10 rounded-full flex justify-center items-center text-white transition duration-200 ease-in-out ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <MdKeyboardVoice />
            </button>
            {audioBlob && (
              <audio
                controls
                src={URL.createObjectURL(audioBlob)}
                className="ml-2"
              />
            )}

            <button
              type="submit"
              className={`px-4 py-2 text-sm rounded-full flex items-center ${
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
