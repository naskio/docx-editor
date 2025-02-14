import { useDocumentsStore } from '@/store/documents-store-provider';
import React, { useRef, useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { download } from '@/lib/download';
import { FileIcon } from 'lucide-react';
import { DocumentFormDialogContent } from '@/components/playground/document-form-dialog-content';

export const isMac: boolean =
  typeof window !== 'undefined'
    ? navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
    : false;

export function DocumentItem({ name }: { name: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const { openDocument } = useDocumentsStore((state) => state);
  const document = useDocumentsStore((state) =>
    state.documents.find((doc) => doc.name === name)
  );

  return (
    <>
      <ContextMenu onOpenChange={setIsContextMenuOpen}>
        <ContextMenuTrigger>
          <Button
            variant='ghost'
            size='default'
            ref={buttonRef}
            className={cn(
              'text-sidebar-foreground focus:bg-accent focus:text-accent-foreground w-full justify-start gap-2',
              isContextMenuOpen && 'bg-accent text-accent-foreground' // because will lose focus/style
            )}
            onDoubleClick={() => {
              openDocument(name);
            }}
            // onClick => by default, focus the button (select)
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
              // keyboard shortcuts
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                // ⌘Cmd/⌃Ctrl + Enter => Open in editor
                openDocument(name);
                e.preventDefault();
              } else if (e.key === 'Enter') {
                // Enter => Rename
                setIsRenameDialogOpen(true);
                e.preventDefault();
              } else if (e.key === 'Backspace' || e.key === 'Delete') {
                // ⌫ or ␡ or ⌦ Delete => Delete
                setIsDeleteDialogOpen(true);
                e.preventDefault();
              } else if (e.key === 'Escape') {
                // Escape => Unselect
                buttonRef.current?.blur();
                e.preventDefault();
              }
            }}
          >
            <FileIcon />
            <span className='truncate'>{name}</span>
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => openDocument(name)}>
            Open
            <ContextMenuShortcut>{isMac ? '⌘⏎' : '⌃⏎'}</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            disabled={!document}
            onClick={() => {
              if (document)
                download(
                  `${document.name}.js`,
                  new Blob([document.text], { type: document.type })
                );
            }}
          >
            Download...
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setIsRenameDialogOpen(true)}>
            Rename...
            <ContextMenuShortcut>⏎</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent
          className='sm:max-w-[425px]'
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            buttonRef.current?.focus();
          }}
        >
          <DocumentFormDialogContent
            mode='update'
            shouldReset={!isRenameDialogOpen}
            postSubmit={() => setIsRenameDialogOpen(false)}
            selectedName={name}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          className='sm:max-w-[425px]'
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            buttonRef.current?.focus();
          }}
        >
          <DocumentFormDialogContent
            mode='delete'
            shouldReset={!isDeleteDialogOpen}
            postSubmit={() => setIsDeleteDialogOpen(false)}
            selectedName={name}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
