// src/providers/counter-store-provider.tsx
"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import {
  type ModalStore,
  createModalStore,
  initModalStore,
} from "@/stores/modal-store";

export const ModalStoreContext = createContext<StoreApi<ModalStore> | null>(
  null
);

export interface ModalStoreProviderProps {
  children: ReactNode;
}

export const ModalStoreProvider = ({ children }: ModalStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ModalStore>>();
  if (!storeRef.current) {
    storeRef.current = createModalStore(initModalStore());
  }

  return (
    <ModalStoreContext.Provider value={storeRef.current}>
      {children}
    </ModalStoreContext.Provider>
  );
};

export const useModalStore = <T,>(selector: (store: ModalStore) => T): T => {
  const modalStoreContext = useContext(ModalStoreContext);

  if (!modalStoreContext) {
    throw new Error(`useModalStore must be use within CounterStoreProvider`);
  }

  return useStore(modalStoreContext, selector);
};
