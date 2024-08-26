"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

import { SpinningLoader } from "@/components/module/user";

interface Profile {
  username: string | null;
  full_name: string | null;
  is_instructor: boolean;
  bio: string | null;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const supabase = createClient();
  const router = useRouter();

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
          if (error.code === "PGRST116") {
            console.log("Profile doesn't exist, creating a new one");
            const { data: newProfile, error: insertError } = await supabase
              .from("profiles")
              .insert({ id: user.id })
              .select();

            if (insertError) {
              console.error("Error creating profile:", insertError);
            } else {
              setProfile(newProfile[0]);
            }
          } else {
            console.error("Error fetching profile:", error);
          }
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

    console.log("Updating profile for user:", user.id);
    console.log("Updated profile data:", updatedProfile);

    const { data, error } = await supabase
      .from("profiles")
      .update(updatedProfile)
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("Error updating profile:", error);
    } else if (data && data.length > 0) {
      console.log("Profile updated successfully:", data[0]);
      setProfile(data[0]);
      setEditing(false);
    } else {
      console.error("No data returned after update");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <SpinningLoader />
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={() => router.push("/posts")}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <IoArrowBack className="mr-2" />
          Back to Posts
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Your Profile</h1>
      </div>
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
                You are an Instructor
              </span>
            )}
          </div>

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
