"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { AiOutlineLoading } from "react-icons/ai";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <button {...props} type="submit" aria-disabled={pending}>
      {isPending ? (
        <div className="flex items-center justify-center">
          <AiOutlineLoading className="animate-spin mr-2" /> {pendingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
