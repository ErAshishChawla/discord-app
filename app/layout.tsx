import type { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { open_sans } from "@/lib/fonts";

import Providers from "@/providers";
import { ThemeProvider } from "@/providers/theme-provider";
import UploadthingProvider from "@/providers/uploadthing-provider";

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
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            open_sans.className,
            "w-screen h-screen flex flex-col",
            `bg-white dark:bg-[#313338]`
          )}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="discord-theme"
          >
            <UploadthingProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
