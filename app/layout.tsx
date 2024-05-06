import type { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { open_sans } from "@/lib/fonts";

import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/providers";

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            open_sans.className,
            `bg-white dark:bg-[#313338] w-screen h-screen flex flex-col`
          )}
          suppressHydrationWarning
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
