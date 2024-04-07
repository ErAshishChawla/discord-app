"use client";

import React from "react";
import { useRouter, useParams, redirect } from "next/navigation";

import ActionTooltip from "@/components/action-tooltip";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { paths } from "@/helpers/paths";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

function NavigationItem({ id, name, imageUrl }: NavigationItemProps) {
  const router = useRouter();
  const params = useParams();

  const onClick = () => {
    router.push(paths.specificServer(id));
    router.refresh();
  };

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button className="group relative flex items-center" onClick={onClick}>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
}

export default NavigationItem;
