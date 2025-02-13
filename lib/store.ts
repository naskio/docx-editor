import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';

export type Document = {
  name: string;
  content: string;
  mtime: Date; // when content was last changed
  ctime: Date; // when metadata was last changed
  atime: Date; // when file was last accessed
};

export type GlobalState = {
  documents: Document[];
};

export type GlobalActions = {
  createDocument: (name: string, content: string) => void;
  deleteDocument: (name: string) => void;
  saveDocument: (name: string, content: string) => void;
  renameDocument: (oldName: string, newName: string) => void;
  openDocument: (name: string) => void;
  closeDocument: (name: string) => void;
};

export type GlobalStore = GlobalState & GlobalActions;

export const initGlobalStore = (): GlobalState => {
  return {
    documents: [],
  };
};

export const defaultInitGlobalState: GlobalState = {
  ...initGlobalStore(),
};

export const createGlobalStore = (
  initState: GlobalState = defaultInitGlobalState
) => {
  return createStore<GlobalStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          createDocument: (name, content) =>
            set((state) => {
              const doc = state.documents.find((doc) => doc.name === name);
              if (!doc) {
                state.documents.push({
                  name,
                  content,
                  mtime: new Date(),
                  ctime: new Date(),
                  atime: new Date(),
                });
              }
              return { documents: [...state.documents] };
            }),
          deleteDocument: (name) =>
            set((state) => ({
              documents: state.documents.filter((doc) => doc.name !== name),
            })),
          saveDocument: (name, content) =>
            set((state) => {
              const doc = state.documents.find((doc) => doc.name === name);
              if (doc) {
                doc.content = content;
                doc.mtime = new Date();
              }
              return { documents: [...state.documents] };
            }),
          renameDocument: (oldName, newName) =>
            set((state) => {
              const doc = state.documents.find((doc) => doc.name === oldName);
              if (doc) {
                doc.name = newName;
                doc.ctime = new Date();
              }
              return { documents: [...state.documents] };
            }),
          openDocument: (name) =>
            set((state) => {
              const doc = state.documents.find((doc) => doc.name === name);
              if (doc) {
                doc.atime = new Date();
              }
              return { documents: [...state.documents] };
            }),
          closeDocument: (name) => {
            console.log(`closeDocument: ${name}`);
          },
        }),
        {
          name: 'global-storage', // name of the item in the storage (must be unique)
          storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
      )
    )
  );
};
