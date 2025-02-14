import { createStore } from 'zustand/vanilla';
import { devtools } from 'zustand/middleware';
import { Preview } from '@/lib/types';

export type PreviewState = Preview;

export type PreviewActions = {
  resetPreview: () => void;
  setPreview: (preview: Preview) => void;
};

export type PreviewStore = PreviewState & PreviewActions;

export const initPreviewStore = (): PreviewState => {
  return {
    name: undefined,
    docx: undefined,
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
      setPreview: (preview: Preview) => set(preview),
    }))
  );
};
