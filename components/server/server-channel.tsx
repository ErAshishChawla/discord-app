"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import ActionTooltip from "@/components/action-tooltip";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";

import { useModalStore } from "@/providers/modal-store-provider";
import { Channel, Server, MemberRole, ChannelType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ModalType } from "@/stores/modal-store";
import { paths } from "@/helpers/paths";

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const params = useParams();
  const router = useRouter();

  const onOpen = useModalStore((state) => state.onOpen);

  const Icon = iconMap[channel.type];

  const onClick = () => {
    const serverId = params?.serverId as string;
    const channelId = channel.id;

    if (!serverId || !channelId) return;

    router.push(paths.specificChannel(serverId, channelId));
    router.refresh();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 mb-1 transition",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              className="w-4 h-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(ModalType.editChannel, { channel, server });
              }}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="w-4 h-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(ModalType.deleteChannel, { channel, server });
              }}
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400 " />
      )}
    </button>
  );
}

export default ServerChannel;
