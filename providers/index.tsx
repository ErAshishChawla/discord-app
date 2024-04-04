import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <>
      <ClerkProvider>{children}</ClerkProvider>
    </>
  );
}

export default Providers;
