import React from "react";

import { ThemeProvider } from "next-themes";
import UploadthingProvider from "@/providers/uploadthing-provider";
import { ModalStoreProvider } from "@/providers/modal-store-provider";
import ModalProvider from "@/providers/modal-provider";

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
      <UploadthingProvider />
      <ModalStoreProvider>
        <ModalProvider />
        {children}
      </ModalStoreProvider>
    </ThemeProvider>
  );
}

export default Providers;
