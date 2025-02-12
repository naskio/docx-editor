'use client';

import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { FileIcon, FilePlusIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import React, { useRef, useState } from 'react';
import { useGlobalStore } from '@/lib/store-provider';

function DocumentItem({ name }: { name: string }) {
  const { renameDocument, deleteDocument } = useGlobalStore((state) => state);

  // const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [hasFocus, setFocus] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (!open) {
          buttonRef.current?.blur();
        } else {
          buttonRef.current?.focus();
        }
        // setIsContextMenuOpen(open);
      }}
    >
      <ContextMenuTrigger>
        <Button
          variant='ghost'
          size='default'
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          ref={buttonRef}
          className={cn(
            'text-sidebar-foreground focus:bg-accent focus:text-accent-foreground w-full justify-start gap-2'
            // isContextMenuOpen && 'bg-accent text-accent-foreground'
          )}
          onDoubleClick={() => {
            // double click => open in editor
            console.log(`Open ${name}`);
          }}
          onClick={() => {
            if (hasFocus) {
              buttonRef.current?.blur(); // double click
            } else {
              buttonRef.current?.focus(); // single click
            }
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
            console.log(e.key);
            if (e.key === 'Enter') {
              // Enter => Open in editor
              console.log(`Open ${name}`);
            }
            if (e.key === 'Backspace' || e.key === 'Delete') {
              // Delete document
              console.log(`Delete ${name}`);
              deleteDocument(name);
            }
            if (e.key === 'Escape') {
              buttonRef.current?.blur();
            }
          }}
        >
          <FileIcon />
          {name}
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            console.log(`Open ${name}`);
          }}
        >
          Open
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            console.log(`Download ${name}`);
          }}
        >
          Download...
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            renameDocument(name, `${new Date()}`);
          }}
        >
          Rename...
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            deleteDocument(name);
          }}
        >
          Delete Permanently
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function FileExplorer() {
  const { documents, createDocument } = useGlobalStore((state) => state);

  return (
    <div className='bg-sidebar flex h-full flex-col'>
      <div className='p-2'>
        <Button
          className='text-sidebar-foreground w-full py-3'
          variant='ghost'
          size='lg'
          onClick={() => {
            console.log(`New document...`);
            createDocument(`${new Date().getTime()}`, ``);
          }}
        >
          <FilePlusIcon className='mr-1' />
          New Document...
        </Button>
      </div>
      {Boolean(documents.length) && (
        <p className='text-muted-foreground ps-3 text-sm font-medium'>
          Documents
        </p>
      )}
      <ScrollArea>
        <div className='flex flex-col gap-y-0.5 p-3 pb-5'>
          {documents.map((doc, index) => (
            <DocumentItem key={index} name={doc.name} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
