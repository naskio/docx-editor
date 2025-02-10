import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Header } from '@/components/playground/header';
import { FileExplorer } from '@/components/playground/file-explorer';
import { Editor } from '@/components/playground/editor';
import { Preview } from '@/components/playground/preview';

export function Panels() {
  return (
    <ResizablePanelGroup direction='vertical' className='h-full w-full'>
      <ResizablePanel defaultSize={8} minSize={5} maxSize={12}>
        <Header />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={92}>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel defaultSize={16} minSize={10} collapsible>
            <FileExplorer />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={42} minSize={10} collapsible>
            <Editor />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={42} minSize={10} collapsible>
            <Preview />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
