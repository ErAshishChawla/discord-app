import { createStore } from "zustand/vanilla";

import { Channel, ChannelType, Server } from "@prisma/client";

export enum ModalType {
  createServer = "createServer",
  invite = "invite",
  editServer = "editServer",
  members = "members",
  createChannel = "createChannel",
  leaveServer = "leaveServer",
  deleteServer = "deleteServer",
  deleteChannel = "deleteChannel",
  editChannel = "editChannel",
  messageFile = "messageFile",
}

interface ModalData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
  apiUrl?: string;
  query?: Record<string, any>;
}

export type ModalState = {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
};

export type ModalActions = {
  onOpen: (type: ModalType, data: ModalData) => void;
  onClose: () => void;
};

export type ModalStore = ModalState & ModalActions;

export const initModalStore = (): ModalState => {
  return {
    type: null,
    isOpen: false,
    data: {} as ModalData,
  };
};

export const defaultInitState: ModalState = {
  type: null,
  isOpen: false,
  data: {} as ModalData,
};

export const createModalStore = (initState: ModalState = defaultInitState) => {
  return createStore<ModalStore>()((set) => ({
    ...initState,
    onOpen: (type, data = {}) => set({ type, isOpen: true, data: data }),
    onClose: () => set({ type: null, isOpen: false }),
  }));
};
