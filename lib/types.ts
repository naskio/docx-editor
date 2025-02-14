import { renderingLibraryOptions } from '@/lib/env';

type BaseFile = {
  name: string;
  type: string;
  mtime: Date; // when content was last changed
  ctime: Date; // when metadata was last changed
  atime: Date; // when file was last accessed
};

export type TextFile = BaseFile & {
  text: string;
};

export type BinaryFile = BaseFile & {
  blob: Blob;
};

export type Mode = 'create' | 'update' | 'delete';

type RenderingLibrary = (typeof renderingLibraryOptions)[number];

export type Settings = {
  renderingLibrary: RenderingLibrary;
};
