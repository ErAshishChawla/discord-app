import type { Metadata } from "next";
import "./globals.css";

import { open_sans } from "@/lib/fonts";
import Providers from "@/providers";
import { ThemeProvider } from "@/providers/theme-provider";

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
        <body className={open_sans.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="discord-theme"
          >
            <main className="w-screen h-screen flex flex-col">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
