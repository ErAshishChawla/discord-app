import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
