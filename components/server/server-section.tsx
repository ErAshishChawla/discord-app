"use client";

import React from "react";

import ActionTooltip from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react";

import { ChannelType, MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/types";

import { useModalStore } from "@/providers/modal-store-provider";
import { ModalType } from "@/stores/modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const onOpen = useModalStore((s) => s.onOpen);

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className=" text-zinc-500 dark:text-zinc-400 hover:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen(ModalType.createChannel, { channelType })}
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            className=" text-zinc-500 dark:text-zinc-400 hover:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen(ModalType.members, { server })}
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}

export default ServerSection;
