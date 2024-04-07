import { createStore } from "zustand/vanilla";

export enum ModalType {
  createServer = "createServer",
}

export type ModalState = {
  type: ModalType | null;
  isOpen: boolean;
};

export type ModalActions = {
  onOpen: (type: ModalType) => void;
  onClose: () => void;
};

export type ModalStore = ModalState & ModalActions;

export const initModalStore = (): ModalState => {
  return {
    type: null,
    isOpen: false,
  };
};

export const defaultInitState: ModalState = {
  type: null,
  isOpen: false,
};

export const createModalStore = (initState: ModalState = defaultInitState) => {
  return createStore<ModalStore>()((set) => ({
    ...initState,
    onOpen: (type) => set({ type, isOpen: true }),
    onClose: () => set({ type: null, isOpen: false }),
  }));
};
