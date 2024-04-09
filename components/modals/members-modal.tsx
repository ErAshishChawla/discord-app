"use client";

import React, { useState } from "react";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import { useModalStore } from "@/providers/modal-store-provider";
import { ModalType } from "@/stores/modal-store";
import { apiPaths, paths } from "@/helpers/paths";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

function MembersModal() {
  const router = useRouter();

  const { isOpen, onClose, type, data, onOpen } = useModalStore(
    (state) => state
  );

  const [loadingId, setLoadingId] = useState("");

  const server = data?.server as ServerWithMembersWithProfiles;

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server.id },
      });

      const response = await axios.delete(url);

      router.refresh();

      onOpen(ModalType.members, { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (role: MemberRole, memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server.id },
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen(ModalType.members, { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isOpen && type === ModalType.members} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server ? server.members.length : 0} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server ? (
            server.members.map((member) => {
              return (
                <div
                  key={member.id}
                  className="flex items-center gap-x-2 mb-6 justify-between"
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar src={member.profile.imageUrl} />
                    <div className="flex flex-col gap-y-1">
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <p>{member.profile.name}</p>
                        {roleIconMap[MemberRole[member.role]]}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {member.profile.email}
                      </p>
                    </div>
                  </div>
                  {server.profileId !== member.profileId &&
                    loadingId !== member.id && (
                      <div className="">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreVertical className="h-4 w-4 text-zinc-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side={"right"}>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center gap-2">
                                <ShieldQuestion className="w-4 h-4" />
                                <p>Role</p>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem
                                    className="gap-1 justify-between"
                                    onClick={() => {
                                      onRoleChange(MemberRole.GUEST, member.id);
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Shield className="h-4 w-4" />
                                      <p>Guest</p>
                                    </div>
                                    {member.role === MemberRole.GUEST && (
                                      <Check className="h-4 w-4 " />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="gap-1 justify-between"
                                    onClick={() => {
                                      onRoleChange(
                                        MemberRole.MODERATOR,
                                        member.id
                                      );
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <ShieldCheck className="h-4 w-4" />
                                      <p>Moderator</p>
                                    </div>
                                    {member.role === MemberRole.MODERATOR && (
                                      <Check className="h-4 w-4 " />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-rose-500 gap-2"
                              onClick={() => onKick(member.id)}
                            >
                              <Gavel className="h-4 w-4" />
                              <p className="">Kick</p>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  {loadingId === member.id && (
                    <Loader2 className="animate-spin text-zinc-500 w-4 h-4" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-2xl text-center font-bold text-rose-500">
              No Members
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default MembersModal;
