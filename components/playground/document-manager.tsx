'use client';

import React, { useState } from 'react';
import { useDocumentsStore } from '@/store/documents-store-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FilePlusIcon } from 'lucide-react';
import type { TextFile } from '@/lib/types';
import { DocumentItem } from '@/components/playground/document-item';
import { DocumentFormDialogContent } from '@/components/playground/document-form-dialog-content';

// TODO: improve sidebar accessibility
export function DocumentManager({ templates }: { templates: TextFile[] }) {
  const documents = useDocumentsStore((state) => state.documents);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <div className='bg-sidebar flex h-full flex-col'>
      <div className='p-2'>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              autoFocus
              className='text-sidebar-foreground w-full py-3'
              variant='ghost'
              size='lg'
            >
              <FilePlusIcon className='mr-1' />
              New Document...
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DocumentFormDialogContent
              mode='create'
              shouldReset={!dialogOpen}
              postSubmit={() => setDialogOpen(false)}
              templates={templates}
            />
          </DialogContent>
        </Dialog>
      </div>
      {Boolean(documents.length) && (
        <p className='text-muted-foreground ps-3 text-sm font-medium'>
          Documents
        </p>
      )}
      <ScrollArea className='[&>div>div]:!block'>
        <div className='flex flex-col gap-y-0.5 p-3 pb-5'>
          {documents.map((doc, index) => (
            <DocumentItem key={index} name={doc.name} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
