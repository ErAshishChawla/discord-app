import React from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import ServerSidebar from "@/components/server/server-sidebar";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { paths } from "@/helpers/paths";

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

async function ServerIdLayout({ children, params }: ServerIdLayoutProps) {
  const profile = await currentProfile();

  // if no profile, redirect to login
  if (!profile) {
    return redirectToSignIn();
  }

  // we get the serverid from the params
  const { serverId } = params;

  if (!serverId) {
    redirect(paths.home());
  }

  // we find the server by id
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // if no server, redirect to home
  if (!server) {
    redirect(paths.home());
  }

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <div className="hidden md:flex flex-col">
        <ServerSidebar serverId={server.id} />
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export default ServerIdLayout;
