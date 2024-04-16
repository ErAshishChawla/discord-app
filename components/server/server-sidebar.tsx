import React from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import ServerHeader from "@/components/server/server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "@/components/server/server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ServerSection from "@/components/server/server-section";
import ServerChannel from "@/components/server/server-channel";
import ServerMember from "@/components/server/server-member";

import { currentProfile } from "@/lib/current-profile";
import { paths } from "@/helpers/paths";
import { db } from "@/lib/db";

import { ChannelType, MemberRole } from "@prisma/client";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-rose-500" />,
};

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
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => {
                  return {
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  };
                }),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels.map((channel) => {
                  return {
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  };
                }),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => {
                  return {
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  };
                }),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => {
                  return {
                    id: member.id,
                    name: member.profile.name,
                    icon: roleIconMap[member.role],
                  };
                }),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType={"channels"}
              channelType={ChannelType.TEXT}
              role={currentRole}
              label={"Text Channels"}
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => {
                return (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    role={currentRole}
                    server={server}
                  />
                );
              })}
            </div>
          </div>
        )}

        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType={"channels"}
              channelType={ChannelType.AUDIO}
              role={currentRole}
              label={"Voice Channels"}
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => {
                return (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    role={currentRole}
                    server={server}
                  />
                );
              })}
            </div>
          </div>
        )}

        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType={"channels"}
              channelType={ChannelType.VIDEO}
              role={currentRole}
              label={"Video Channels"}
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => {
                return (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    role={currentRole}
                    server={server}
                  />
                );
              })}
            </div>
          </div>
        )}

        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              sectionType={"members"}
              role={currentRole}
              label={"Members"}
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => {
                return (
                  <ServerMember
                    key={member.id}
                    member={member}
                    server={server}
                  />
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ServerSidebar;
