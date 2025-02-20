import React from 'react';
import { EditorMonacoJSMemoized } from '@/components/playground/editor-monaco-js';
import { TabsContent } from '@/components/ui/tabs';
import type { TextFile } from '@/lib/types';

function TabContent({
  name,
  text,
  buildError,
  declarationFiles,
  saveDocumentDebounceWait,
}: {
  name: string;
  text: string;
  buildError?: string;
  declarationFiles: TextFile[];
  saveDocumentDebounceWait: number;
}) {
  return (
    <TabsContent
      value={name}
      className='mt-0'
      tabIndex={-1} // to prevent focus on Tab trigger (fix for accessibility size issue)
    >
      <EditorMonacoJSMemoized
        name={name}
        defaultValue={text}
        declarationFiles={declarationFiles}
        errorMessage={buildError}
        saveDocumentDebounceWait={saveDocumentDebounceWait}
      />
    </TabsContent>
  );
}

const TabContentMemoized = React.memo(TabContent);

function EditorTabsContent({
  openTabs,
  documents,
  buildErrors,
  declarationFiles,
  saveDocumentDebounceWait,
}: {
  openTabs: string[];
  documents: TextFile[];
  buildErrors: Record<string, string>;
  declarationFiles: TextFile[];
  saveDocumentDebounceWait: number;
}) {
  return openTabs
    .map((name) => documents.find((d) => d.name === name))
    .filter(Boolean)
    .map((doc: TextFile) => (
      <TabContentMemoized
        key={doc.name}
        name={doc.name}
        text={doc.text}
        buildError={buildErrors[doc.name]}
        declarationFiles={declarationFiles}
        saveDocumentDebounceWait={saveDocumentDebounceWait}
      />
    ));
}

export const EditorTabsContentMemoized = React.memo(EditorTabsContent);
