import { FcReading } from "react-icons/fc";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <FcReading className="size-12" />
        <h1>Blog Post</h1>
      </div>
      <h1 className="sr-only">Start your Day with Blog Post</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Your way to share stories From you to another
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
