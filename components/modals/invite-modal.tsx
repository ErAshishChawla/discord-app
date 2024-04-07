"use client";

import React, { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";

import { useModalStore } from "@/providers/modal-store-provider";
import { ModalType } from "@/stores/modal-store";
import useOrigin from "@/hooks/use-origin";
import { apiPaths, paths } from "@/helpers/paths";

function InviteModal() {
  const { isOpen, onClose, type, data, onOpen } = useModalStore(
    (state) => state
  );

  const origin = useOrigin();

  const inviteUrl = data.server
    ? `${origin}/invite/${data.server.inviteCode}`
    : "Invalid Link";

  // for copy to clipboard
  const [copied, setCopied] = useState(false);

  // for generating new invite link
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard
      .writeText(inviteUrl)
      .then(() => {
        setCopied(true);
      })
      .finally(() => {
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
  };

  const onNew = async () => {
    try {
      if (!data.server) {
        return;
      }

      setIsLoading(true);
      const response = await axios.patch(
        apiPaths.newInviteCode(data.server.id)
      );

      onOpen(ModalType.invite, { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && type === ModalType.invite} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 flex-1 flex flex-col gap-2">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary-70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              autoFocus={false}
              disabled={isLoading}
            />
            <Button size={"icon"} onClick={onCopy} disabled={isLoading}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            variant={"link"}
            size={"sm"}
            className="text-xs text-zinc-500 mt-2 gap-2 justify-start w-fit"
            disabled={isLoading}
            onClick={onNew}
          >
            Generate a new link
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteModal;
