
import { LoginForm } from '@/components/module/user/login-form';
import Link from 'next/link';
import images from '@/assets/images/bg.jpg';
import Image from 'next/image';
export default function Login() {
  return (
    <>

      <div className="min-h-screen flex-col flex items-center justify-between px-5 relative">


        <Link
              href="/"
              className="z-50 mt-10 hover:scale-105 transition-transform"
            >
              <h1>TheBlog</h1>
        </Link>

        <LoginForm />

        <footer className="flex-0 flex w-full items-center justify-center py-3">
          <div className="text-xs">
            <span>PUPQC RIS © 2023</span>
          </div>
        </footer>

      </div>
    </>
  );
}