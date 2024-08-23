"use client";

import { useState } from "react";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { SubmitButton } from "@/components/module/user/components/submit-button";

interface LoginFormProps {
  signIn: (formData: FormData) => Promise<void>;
  signUp: (formData: FormData) => Promise<void>;
  message?: string;
}

export function LoginForm({ signIn, signUp, message }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
      <label className="text-md" htmlFor="email">
        Email
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        name="email"
        placeholder="you@example.com"
        required
      />
      <label className="text-md" htmlFor="password">
        Password
      </label>
      <div className="relative mb-6">
        <input
          className="rounded-md px-4 py-2 bg-inherit border w-full pr-10"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-300 hover:text-neutral-400"
        >
          {showPassword ? (
            <EyeClosedIcon className="h-5 w-5" />
          ) : (
            <EyeOpenIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      <SubmitButton
        formAction={signIn}
        className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
        pendingText="Signing In..."
      >
        Sign In
      </SubmitButton>
      <SubmitButton
        formAction={signUp}
        className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        pendingText="Signing Up..."
      >
        Sign Up
      </SubmitButton>
      {message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {message}
        </p>
      )}
    </form>
  );
}
