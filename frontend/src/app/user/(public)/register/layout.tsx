import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Register',
};

export default function RegisterLayout({ children }: React.PropsWithChildren) {
  return children;
}