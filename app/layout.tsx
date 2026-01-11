import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import ToastProvider from "@/components/ToastProvider";
import { Analytics } from "@vercel/analytics/next";

const gilroy = localFont({
  src: [
    {
      path: '../public/fonts/Gilroy-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Gilroy-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gilroy',
});

export const metadata: Metadata = {
  title: "Drerries Wanted - Roleplay Database",
  description: "Een database van gezochte Drerries gebruikers in de roleplay community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={gilroy.className}>
        <SessionProvider>
          {children}
          <ToastProvider />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
