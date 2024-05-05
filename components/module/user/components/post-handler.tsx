"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { readPosts } from "@/utils/actions/posts";

import { MdDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";

export function PostHandler() {
  const [notes, setNotes] = useState<any[] | null>(null);
  const supabase = createClient();

  // const { data: posts } = await readPosts();

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("posts").select();
      console.log(data);
      setNotes(data);
    };
    getData();
  }, []);

  return (
    <div className="mt-20">
      {notes &&
        notes.map((note) => (
          <div
            key={note.id}
            className="p-6 w-full border rounded-md shadow-md flex flex-col items-center"
          >
            <div className="flex justify-between w-full">
              <div>{note.id}</div>
              <div>{note.created_at}</div>
              <div className="flex gap-4">
                <button>
                  <MdDeleteOutline />
                </button>
                <button>
                  <CiHeart />
                </button>
              </div>
            </div>
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
            <div className="w-full">{note.posts}</div>
          </div>
        ))}
    </div>
  );
}
