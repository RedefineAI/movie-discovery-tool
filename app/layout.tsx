import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // The most important import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineScope - The Movie Discovery Tool",
  description: "Search for movies, discover ratings, and find your next favorite film.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}