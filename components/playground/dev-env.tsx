import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import type { TextFile } from '@/lib/types';
import { DocumentSidebar } from '@/components/playground/document-sidebar';
import { Editor } from '@/components/playground/editor';
import { Preview } from '@/components/playground/preview';

export function DevEnv({
  templates,
  declarationFiles,
}: {
  templates: TextFile[];
  declarationFiles: TextFile[];
}) {
  return (
    <ResizablePanelGroup direction='horizontal' autoSaveId='layout'>
      <ResizablePanel
        defaultSize={16}
        minSize={10}
        collapsible
        id='document-manager'
        order={1}
      >
        <DocumentSidebar templates={templates} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={42}
        minSize={10}
        collapsible
        id='editor'
        order={2}
      >
        <Editor declarationFiles={declarationFiles} />
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
