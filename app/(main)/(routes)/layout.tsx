import React from "react";

import NavigationSidebar from "@/components/navigation/navigation-sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[72px_1fr]">
        <div className="hidden md:flex flex-col">
          <NavigationSidebar />
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
