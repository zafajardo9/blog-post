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
          .select("*")
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
      </div>
    </div>
  );
}
