import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';

export type Document = {
  uuid: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DocumentsState = {
  documents: Document[];
};

export type DocumentsActions = {
  createDocument: (name: string, content: string) => void;
  deleteDocument: (uuid: string) => void;
  saveDocument: (uuid: string, content: string) => void;
  renameDocument: (uuid: string, newName: string) => void;
};

export type DocumentsStore = DocumentsState & DocumentsActions;

export const initDocumentsStore = (): DocumentsState => {
  return {
    documents: [],
  };
};

export const defaultInitState: DocumentsState = {
  ...initDocumentsStore(),
};

export const createDocumentsStore = (
  initState: DocumentsState = defaultInitState
) => {
  return createStore<DocumentsStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,
          deleteDocument: (uuid) =>
            set((state) => ({
              documents: state.documents.filter((doc) => doc.uuid !== uuid),
            })),
          renameDocument: (uuid, newName) =>
            set((state) => {
              const doc = state.documents.find((doc) => doc.uuid === uuid);
              if (doc) {
                doc.name = newName;
                doc.updatedAt = new Date();
              }
              return { documents: state.documents };
            }),
          createDocument: (name, content) =>
            set((state) => {
              state.documents.push({
                uuid: Math.random().toString(36),
                name,
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
              return { documents: state.documents };
            }),
          saveDocument: (uuid, content) =>
            set((state) => {
              const doc = state.documents.find((doc) => doc.uuid === uuid);
              if (doc) {
                doc.content = content;
                doc.updatedAt = new Date();
              }
              return { documents: state.documents };
            }),
        }),
        {
          name: 'documents-storage', // name of the item in the storage (must be unique)
          storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
      )
    )
  );
};
