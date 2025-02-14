import { createStore } from 'zustand/vanilla';
import { persist, devtools } from 'zustand/middleware';
import type { TextFile } from '@/lib/types';

export type DocumentsState = {
  documents: TextFile[];
};

export type DocumentsActions = {
  createDocument: (name: string, text: string) => void;
  deleteDocument: (name: string) => void;
  saveDocument: (name: string, text: string) => void;
  renameDocument: (oldName: string, newName: string) => void;
  openDocument: (name: string) => void;
  closeDocument: (name: string) => void;
};

export type DocumentsStore = DocumentsState & DocumentsActions;

export const initDocumentsStore = (): DocumentsState => {
  return {
    documents: [],
  };
};

export const defaultInitDocumentsState: DocumentsState = {
  ...initDocumentsStore(),
};

export const createDocumentsStore = (
  initState: DocumentsState = defaultInitDocumentsState
) => {
  return createStore<DocumentsStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          createDocument: (name, text) =>
            set((state) => {
              const doc = state.documents.find((doc) => doc.name === name);
              if (!doc) {
                state.documents.push({
                  name,
                  type: 'text/javascript',
                  text,
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
          saveDocument: (name, text) =>
            set((state) => {
              const doc = state.documents.find((doc) => doc.name === name);
              if (doc) {
                doc.text = text;
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
          name: 'documents-storage', // name of the item in the storage (must be unique)
          // (optional) by default, 'localStorage' is used as storage
        }
      )
    )
  );
};
