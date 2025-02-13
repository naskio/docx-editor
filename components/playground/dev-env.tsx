'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { DocumentManager } from '@/components/playground/document-manager';
import { Editor } from '@/components/playground/editor';
import { Preview } from '@/components/playground/preview';

export function DevEnv() {
  return (
    <ResizablePanelGroup direction='horizontal' autoSaveId='layout'>
      <ResizablePanel
        defaultSize={16}
        minSize={10}
        collapsible
        id='document-manager'
        order={1}
      >
        <DocumentManager />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={42}
        minSize={10}
        collapsible
        id='editor'
        order={2}
      >
        <Editor />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={42}
        minSize={10}
        collapsible
        id='preview'
        order={3}
      >
        <Preview />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
