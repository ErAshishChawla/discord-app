import React from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { paths } from "@/helpers/paths";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerPageProps {
  params: {
    serverId: string;
  };
}

async function ServerIdPage({ params }: ServerPageProps) {
  const serverId = params.serverId;

  if (!serverId) {
    return redirect(paths.home());
  }

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
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels?.[0];

  if (!server || !initialChannel) {
    return redirect(paths.home());
  }
  return redirect(paths.specificChannel(server.id, initialChannel.id));
}

export default ServerIdPage;
