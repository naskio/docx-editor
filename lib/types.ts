export type Document = {
  name: string;
  content: string;
  mtime: Date; // when content was last changed
  ctime: Date; // when metadata was last changed
  atime: Date; // when file was last accessed
};

export type Template = {
  name: string;
  content: string;
};

export type Mode = 'create' | 'update' | 'delete';

export type Preview = {
  name?: string;
  docx?: Blob;
};

export type RenderingLibrary =
  | 'docxjs'
  | 'mammoth.js'
  | 'Google Docs'
  | 'Office';

export type Settings = {
  renderingLibrary: RenderingLibrary;
};
