import React from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import ServerHeader from "@/components/server/server-header";

import { currentProfile } from "@/lib/current-profile";
import { paths } from "@/helpers/paths";
import { db } from "@/lib/db";

import { ChannelType } from "@prisma/client";

interface ServerSidebarProps {
  serverId: string;
}

async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect(paths.home());
  }

  // Extracting the channels
  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // Extracting members and removing the current user
  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );

  const currentRole = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  if (!currentRole) {
    return redirect(paths.home());
  }

  return (
    <div className="flex-1 flex flex-col text-primary dark:bg-[#2B2D31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={currentRole} />
    </div>
  );
}

export default ServerSidebar;
