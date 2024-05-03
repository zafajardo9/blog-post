import { NoteHandler, PostForm } from "@/components/module/user";

export default function Page() {
  return (
    <div className="wrapper flex flex-col items-center">
      <PostForm />
      <NoteHandler />
    </div>
  );
}
