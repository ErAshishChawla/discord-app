import type { Metadata } from "next";
import "./globals.css";

import { open_sans } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Discord App",
  description: "A Discord clone built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={open_sans.className}>
        <main className="w-screen h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}
