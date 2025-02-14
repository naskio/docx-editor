import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { Document } from '@/lib/types';

export type DocumentsState = {
  documents: Document[];
};

export type DocumentsActions = {
  createDocument: (name: string, content: string) => void;
  deleteDocument: (name: string) => void;
  saveDocument: (name: string, content: string) => void;
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
          name: 'documents-storage', // name of the item in the storage (must be unique)
          storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
      )
    )
  );
};
