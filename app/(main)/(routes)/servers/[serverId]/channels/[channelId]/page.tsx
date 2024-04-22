import React from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import ChatHeader from "@/components/chat/chat-header";

import { paths } from "@/helpers/paths";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

async function ChannelPage({
  params: { serverId, channelId },
}: ChannelPageProps) {
  if (!serverId || !channelId) {
    return redirect(paths.home());
  }

  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    return redirect(paths.home());
  }

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: serverId,
    },
  });

  if (!member) {
    return redirect(paths.home());
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  );
}

export default ChannelPage;
