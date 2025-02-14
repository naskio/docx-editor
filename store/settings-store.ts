import { createStore } from 'zustand/vanilla';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Settings } from '@/lib/types';

export type SettingsState = Settings;

export type SettingsActions = {
  setRenderingLibrary: (library: Settings['renderingLibrary']) => void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const initSettingsStore = (): SettingsState => {
  return {
    renderingLibrary: 'docxjs',
  };
};

export const defaultInitSettingsState: SettingsState = {
  ...initSettingsStore(),
};

export const createSettingsStore = (
  initState: SettingsState = defaultInitSettingsState
) => {
  return createStore<SettingsStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          setRenderingLibrary: (library) =>
            set(() => ({ renderingLibrary: library })),
        }),
        {
          name: 'settings-storage', // name of the item in the storage (must be unique)
          storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
      )
    )
  );
};
