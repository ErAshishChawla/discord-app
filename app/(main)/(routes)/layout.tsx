import React from "react";

import NavigationSidebar from "@/components/navigation/navigation-sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex">
        <div className="hidden md:flex flex-col">
          <NavigationSidebar />
        </div>
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
