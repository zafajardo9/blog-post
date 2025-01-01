import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { initAmplitude } from '../lib/amplitude';
import { MatomoAnalytics } from "@/components/MatomoAnalytics";
import { GoogleTag } from "@/components/GoogleTag";

import Script from 'next/script'



const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Welcome to BlogPost 🚀",
  description: "Your way of sharing your thoughts with the world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  initAmplitude();
  return (

    <html lang="en" className={GeistSans.className}>
      <MatomoAnalytics />
      <GoogleTag />
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
          <Script
            src="https://website-analytics-mu.vercel.app/tracker.js"
            strategy="afterInteractive"
          />
        </main>
      </body>


    </html>

  );
}
