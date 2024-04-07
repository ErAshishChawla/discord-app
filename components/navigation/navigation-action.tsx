"use client";

import React from "react";

import { Plus } from "lucide-react";

import ActionTooltip from "@/components/action-tooltip";

import { useModalStore } from "@/providers/modal-store-provider";
import { ModalType } from "@/stores/modal-store";

function NavigationAction() {
  const { onOpen } = useModalStore((state) => state);

  const handleOpen = () => {
    onOpen(ModalType.createServer);
  };

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button className="group flex items-center" onClick={handleOpen}>
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emrald-500">
            <Plus
              className="group-hover:text-white transition text-emrald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}

export default NavigationAction;