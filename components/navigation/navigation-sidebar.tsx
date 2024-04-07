import React from "react";

import { redirect } from "next/navigation";

import NavigationAction from "@/components/navigation/navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "@/components/navigation/navigation-item";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

import { paths } from "@/helpers/paths";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

async function NavigationSidebar() {
  const profile = await currentProfile();

  if (!profile) {
    // If the user is not logged in, we redirect them to the login page
    redirect(paths.signIn());
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (servers.length <= 0) {
    // If the user is logged in but not in any servers, we redirect them to the home page to create a server
    redirect(paths.home());
  }
  console.log(servers);

  return (
    <div className="flex-1 flex flex-col gap-y-4 items-center text-primary dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10" />
      <ScrollArea className="flex-1 flex flex-col">
        {servers.map((server) => {
          return (
            <div className="mb-4" key={server.id}>
              <NavigationItem
                id={server.id}
                name={server.name}
                imageUrl={server.imageUrl}
              />
            </div>
          );
        })}
      </ScrollArea>
      <div className="pb-3 flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl={paths.signIn()}
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
}

export default NavigationSidebar;
