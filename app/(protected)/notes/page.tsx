import { PostHandler, PostForm } from "@/components/module/user";
import { readPosts } from "@/utils/actions/posts";

export default async function Page() {
  return (
    <div className="wrapper flex flex-col items-center">
      <div className="w-1/2 ">
        <PostForm />
        <PostHandler />
      </div>
    </div>
  );
}
