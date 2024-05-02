import { FcReading } from "react-icons/fc";

export default function NavigationLogo() {
  return (
    <a className="py-2 px-3 flex no-underline" href="/" rel="noreferrer">
      <FcReading className="text-lg mr-4" />
      Blog Post
    </a>
  );
}
