import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import ToastProvider from "@/components/ToastProvider";
import { Analytics } from "@vercel/analytics/next";
import Sidebar from "@/components/Sidebar";
import SearchAutocomplete from "@/components/SearchAutocomplete";

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
          <div className="flex min-h-screen bg-[#202225]">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
              {/* Top Search Bar - Desktop Only */}
              <div className="hidden lg:block sticky top-0 z-40 bg-[#292b2f] border-b border-[#202225] px-6 py-4">
                <SearchAutocomplete />
              </div>
              
              {/* Page Content */}
              <main className="pt-16 lg:pt-0">
                {children}
              </main>
            </div>
          </div>
          <ToastProvider />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
