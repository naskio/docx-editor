import { devtools } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export type OutputState = {
  name?: string; // last successful output file name
  blob?: Blob; // last successful output file blob
  errorMessage?: string; // last error message (⚠️ name doesn't necessarily correspond to the errorMessage)
};

export type OutputActions = {
  resetOutput: () => void;
  setOutput: (partialState: OutputState) => void;
};

export type OutputStore = OutputState & OutputActions;

export const initOutputStore = (): OutputState => {
  return {
    name: undefined,
    blob: undefined,
    errorMessage: undefined,
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
      setOutput: (partialState) => set({ ...partialState }),
    }))
  );
};
