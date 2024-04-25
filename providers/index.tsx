import React from "react";

import { ThemeProvider } from "next-themes";
import UploadthingProvider from "@/providers/uploadthing-provider";
import { ModalStoreProvider } from "@/providers/modal-store-provider";
import ModalProvider from "@/providers/modal-provider";
import { SocketProvider } from "@/providers/socket-provider";
import QueryProvider from "@/providers/query-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="discord-theme"
    >
      <SocketProvider>
        <UploadthingProvider />
        <ModalStoreProvider>
          <ModalProvider />
          <QueryProvider>{children}</QueryProvider>
        </ModalStoreProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default Providers;
