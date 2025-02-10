'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { FileIcon, FilePlusIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useDocumentsStore } from '@/lib/providers/documents-store-provider';

function DocumentItem({ uuid, name }: { name: string; uuid: string }) {
  const { renameDocument, deleteDocument } = useDocumentsStore(
    (state) => state
  );

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  return (
    <ContextMenu onOpenChange={setIsContextMenuOpen}>
      <ContextMenuTrigger>
        <span
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'default' }),
            'text-sidebar-foreground w-full justify-start gap-2',
            isContextMenuOpen && 'bg-accent text-accent-foreground'
          )}
        >
          <FileIcon />
          {name}
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            console.log(`Download ${name}`);
          }}
        >
          Download...
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            renameDocument(uuid, `${new Date()}`);
          }}
        >
          Rename...
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            deleteDocument(uuid);
          }}
        >
          Delete Permanently
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function FileExplorer() {
  const { documents, createDocument } = useDocumentsStore((state) => state);

  return (
    <div className='bg-sidebar flex h-full flex-col gap-2'>
      <Button
        className='text-sidebar-foreground w-full py-3'
        variant='ghost'
        size='lg'
        onClick={() => {
          createDocument('Untitled Document', ``);
        }}
      >
        <FilePlusIcon className='mr-1' />
        New Document...
      </Button>
      {Boolean(documents.length) && (
        <p className='text-muted-foreground ps-3 text-sm font-medium'>
          Documents
        </p>
      )}
      <ScrollArea>
        <div className='pb-5'>
          {documents.map((doc, index) => (
            <DocumentItem key={index} uuid={doc.uuid} name={doc.name} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
