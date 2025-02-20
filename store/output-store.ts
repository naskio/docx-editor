import { devtools } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export type OutputState = {
  name?: string; // last success => document name
  text?: string; // last success => code used to generate the docx
  blob?: Blob; // last success => generated docx
  globalError?: string; // last failed => global error message
  // ⚠️ name doesn't necessarily correspond to the global error message
};

export type OutputActions = {
  setOutput: (partialState: OutputState) => void;
};

export type OutputStore = OutputState & OutputActions;

export const initOutputStore = (): OutputState => {
  return {
    name: undefined,
    text: undefined,
    blob: undefined,
    globalError: undefined,
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
      setOutput: (partialState) => set({ ...partialState }),
    }))
  );
};
