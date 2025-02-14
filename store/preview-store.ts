import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import type { BinaryFile } from '@/lib/types';

export type PreviewState = {
  out?: BinaryFile;
};

export type PreviewActions = {
  resetPreview: () => void;
  setPreview: (out: BinaryFile) => void;
};

export type PreviewStore = PreviewState & PreviewActions;

export const initPreviewStore = (): PreviewState => {
  return {
    out: undefined,
  };
};

export const defaultInitPreviewState: PreviewState = {
  ...initPreviewStore(),
};

export const createPreviewStore = (
  initState: PreviewState = defaultInitPreviewState
) => {
  return createStore<PreviewStore>()(
    devtools((set) => ({
      ...initState,
      resetPreview: () => set(initPreviewStore()),
      setPreview: (out: BinaryFile) => set({ out }),
    }))
  );
};
