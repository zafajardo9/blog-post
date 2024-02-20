import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Login',
};

export default function LoginLayout({ children }: React.PropsWithChildren) {
  return children;
}