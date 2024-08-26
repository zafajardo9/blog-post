// components/ProfilePreview.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { PersonIcon, Pencil2Icon } from "@radix-ui/react-icons";

interface Profile {
  username: string | null;
  full_name: string | null;
  is_instructor: boolean;
  bio: string | null;
  avatar_url: string | null;
}

export function ProfilePreview() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*, is_instructor")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
      }

      setLoading(false);
    };

    fetchUserAndProfile();
  }, [supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="p-4 rounded-lg shadow-md">
      <div className="flex justify-around mb-4">
        <button
          onClick={() => router.push("/profile")}
          className="w-10 h-10 flex justify-center items-center text-white rounded transition-all duration-300 ease-in-out hover:rounded-full hover:bg-blue-600"
          title="View Profile"
        >
          <PersonIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => router.push("/profile?edit=true")}
          className="w-10 h-10 flex justify-center items-center text-white rounded transition-all duration-300 ease-in-out hover:rounded-full hover:bg-green-600"
          title="Edit Profile"
        >
          <Pencil2Icon className="w-5 h-5" />
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
      <div className="mb-4">
        <p>
          <strong>Username:</strong> {profile?.username || "Not set"}
        </p>
        <p>
          <strong>Full Name:</strong> {profile?.full_name || "Not set"}
        </p>
        <p>
          <strong>Bio:</strong>{" "}
          {profile?.bio ? `${profile.bio.substring(0, 50)}...` : "Not set"}
        </p>

        <div className="my-4">
          {profile?.is_instructor && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
              <svg
                className="mr-1.5 h-4 w-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 20v-6"
                />
              </svg>
              Instructor
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
