import { devtools } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import type { BinaryFile } from '@/lib/types';

export type OutputState = {
  out?: BinaryFile;
};

export type OutputActions = {
  resetOutput: () => void;
  setOutput: (name: string, blob: Blob) => void;
};

export type OutputStore = OutputState & OutputActions;

export const initOutputStore = (): OutputState => {
  return {
    out: undefined,
  };
};

export const defaultInitOutputState: OutputState = {
  ...initOutputStore(),
};

export const createOutputStore = (
  initState: OutputState = defaultInitOutputState
) => {
  return createStore<OutputStore>()(
    devtools((set) => ({
      ...initState,
      resetOutput: () => set(initOutputStore()),
      setOutput: (name: string, blob: Blob) =>
        set({
          out: {
            name,
            type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`,
            blob,
            mtime: new Date(),
            ctime: new Date(),
            atime: new Date(),
          },
        }),
    }))
  );
};
