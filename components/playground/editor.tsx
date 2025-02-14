'use client';

import React, { useEffect, useState } from 'react';
import { buildDocument, documentToBlob } from '@/lib/docx';
import { usePreviewStore } from '@/store/preview-store-provider';
import { useDocumentsStore } from '@/store/documents-store-provider';

export function Editor() {
  const { setPreview } = usePreviewStore((state) => state);
  const { documents } = useDocumentsStore((state) => state);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  useEffect(() => {
    if (documents.length) {
      const selected = documents[0];
      setIsCompiling(true);
      const doc = buildDocument(selected.text);
      documentToBlob(doc).then((blob) => {
        setPreview(selected.name, blob);
        setIsCompiling(false);
      });
    }
  }, [documents, setPreview]);

  return <div>{isCompiling ? 'Compiling...' : 'Compiled'}</div>;
}
