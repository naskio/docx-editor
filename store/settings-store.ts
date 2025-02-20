import { devtools, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import type { Settings } from '@/lib/types';

export type SettingsState = Settings;

export type SettingsActions = {
  setSettings: (settings: Settings) => void;
};

export type SettingsStore = SettingsState & SettingsActions;

export const initSettingsStore = (): SettingsState => {
  return {
    renderingLibrary: 'docxjs',
    saveDocumentDebounceWait: 300,
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
          setSettings: (settings) => set({ ...settings }),
        }),
        {
          name: 'settings-storage', // name of the item in the storage (must be unique)
          // (optional) by default, 'localStorage' is used as storage
        }
      )
    )
  );
};
