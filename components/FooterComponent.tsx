export default async function Footer() {
  return (
    <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
      <p>
        Created by{" "}
        <a
          href="https://github.com/zafajardo9"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Zack
        </a>{" "}
        and{" "}
        <a
          href="https://github.com/kyloo13"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Kyle
        </a>
      </p>
    </footer>
  );
}
