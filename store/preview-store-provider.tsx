'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import {
  type PreviewStore,
  createPreviewStore,
  initPreviewStore,
} from '@/store/preview-store';

export type PreviewStoreApi = ReturnType<typeof createPreviewStore>;

export const PreviewStoreContext = createContext<PreviewStoreApi | undefined>(
  undefined
);

export interface PreviewStoreProviderProps {
  children: ReactNode;
}

export const PreviewStoreProvider = ({
  children,
}: PreviewStoreProviderProps) => {
  const storeRef = useRef<PreviewStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createPreviewStore(initPreviewStore());
  }

  return (
    <PreviewStoreContext.Provider value={storeRef.current}>
      {children}
    </PreviewStoreContext.Provider>
  );
};

export const usePreviewStore = <T,>(
  selector: (store: PreviewStore) => T
): T => {
  const previewStoreContext = useContext(PreviewStoreContext);

  if (!previewStoreContext) {
    throw new Error(`usePreviewStore must be used within PreviewStoreProvider`);
  }

  return useStore(previewStoreContext, selector);
};
