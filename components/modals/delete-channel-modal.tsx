"use client";

import React, { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useModalStore } from "@/providers/modal-store-provider";
import { ModalType } from "@/stores/modal-store";
import { apiPaths, paths } from "@/helpers/paths";

function DeleteChannelModal() {
  const { isOpen, onClose, type, data, onOpen } = useModalStore(
    (state) => state
  );

  const [isLoading, setIsLoading] = useState(false);

  const server = data?.server;
  const channel = data?.channel;

  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (!server || !channel) {
        return;
      }

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel.id}`,
        query: {
          serverId: server.id,
        },
      });

      await axios.delete(url);

      onClose();
      router.push(paths.specificServer(server.id));
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen && type === ModalType.deleteChannel}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            <p>
              Are you sure you want to do this? <br />
              {channel ? (
                <span className="font-semibold text-indigo-500">
                  #{channel.name}
                </span>
              ) : (
                "This channel"
              )}{" "}
              will be permanently deleted.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between flex-1">
            <Button
              disabled={isLoading}
              onClick={() => {
                onClose();
              }}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => {
                onClick();
              }}
              variant={"primary"}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteChannelModal;
