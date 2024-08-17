"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface Profile {
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const updatedProfile: Partial<Profile> = {
      username: formData.get("username") as string,
      full_name: formData.get("full_name") as string,
      bio: formData.get("bio") as string,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updatedProfile)
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
      setEditing(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Your Profile</h1>
      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue={profile?.username || ""}
              className="w-full p-2 border rounded bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="full_name" className="block mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              defaultValue={profile?.full_name || ""}
              className="w-full p-2 border rounded bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={profile?.bio || ""}
              className="w-full p-2 border rounded bg-transparent"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-red-500 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p>
            <strong>Username:</strong> {profile?.username || "Not set"}
          </p>
          <p>
            <strong>Full Name:</strong> {profile?.full_name || "Not set"}
          </p>
          <p>
            <strong>Bio:</strong> {profile?.bio || "Not set"}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
