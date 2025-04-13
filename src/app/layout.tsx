import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "camel",
  description: "Hate the sin, love the sinner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <header className="border-b">
          <div className="max-w-4xl mx-auto w-full px-4">
            <nav className="py-4 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                camel
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <div className="max-w-4xl mx-auto w-full px-4 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
