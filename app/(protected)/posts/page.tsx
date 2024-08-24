import { PostHandler, ProfilePreview } from "@/components/module/user";
import { readPosts } from "@/utils/actions/posts";

export default async function Page() {
  const initialPosts = await readPosts();

  return (
    <div className="wrapper flex flex-col items-center">
      <div className="w-full mt-8 flex justify-center px-8">
        <div className="w-1/4 hidden lg:block p-4 border rounded-lg shadow-lg">
          <div className="sticky top-20 flex justify-center">
            <ProfilePreview />
          </div>
        </div>

        <div className="animate-in w-full lg:w-2/4">
          <PostHandler initialPosts={initialPosts} />
        </div>

        <div className="w-1/4 hidden lg:block p-4 border rounded-lg shadow-lg">
          <div className="sticky top-20">Online people</div>
        </div>
      </div>
    </div>
  );
}
