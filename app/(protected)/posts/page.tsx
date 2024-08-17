import { PostHandler, PostForm } from "@/components/module/user";
import { readPosts } from "@/utils/actions/posts";

export default async function Page() {
  const initialPosts = await readPosts();

  return (
    <div className="wrapper flex flex-col items-center">
      <div className="w-full">
        <PostHandler initialPosts={initialPosts} />
      </div>
    </div>
  );
}
