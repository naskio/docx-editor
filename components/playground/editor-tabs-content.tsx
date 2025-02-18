import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { EditorMonacoJSMemoized } from '@/components/playground/editor-monaco-js';
import { TabsContent } from '@/components/ui/tabs';
import { useOutputStore } from '@/store/output-store-provider';
import type { TextFile } from '@/lib/types';

function TabContent({
  isActive,
  name,
  text,
  declarationFiles,
}: {
  isActive: boolean;
  name: string;
  text: string;
  declarationFiles: TextFile[];
}) {
  const errorMessage = useOutputStore(
    useShallow((state) => state.errorMessage)
  );
  return (
    <TabsContent
      value={name}
      className='mt-0'
      tabIndex={-1} // to prevent focus on Tab trigger (fix for accessibility size issue)
    >
      {isActive && ( // we unmount the editor when it's not active
        <EditorMonacoJSMemoized
          name={name}
          defaultValue={text}
          declarationFiles={declarationFiles}
          errorMessage={errorMessage}
        />
      )}
    </TabsContent>
  );
}

const TabContentMemoized = React.memo(TabContent);

function EditorTabsContent({
  openTabs,
  activeTab,
  documents,
  declarationFiles,
}: {
  openTabs: string[];
  activeTab: string;
  documents: TextFile[];
  declarationFiles: TextFile[];
}) {
  return openTabs
    .map((name) => documents.find((d) => d.name === name))
    .filter(Boolean)
    .map((doc: TextFile) => (
      <TabContentMemoized
        key={doc.name}
        isActive={activeTab === doc.name}
        name={doc.name}
        text={doc.text}
        declarationFiles={declarationFiles}
      />
    ));
}

export const EditorTabsContentMemoized = React.memo(EditorTabsContent);
