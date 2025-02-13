import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGlobalStore } from '@/lib/store-provider';
import { DocumentItem } from '@/components/playground/document-item';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FilePlusIcon } from 'lucide-react';
import { DocumentFormDialogContent } from '@/components/playground/document-form-dialog-content';

export function FileExplorer() {
  const documents = useGlobalStore((state) => state.documents);
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div className='bg-sidebar flex h-full flex-col'>
      <div className='p-2'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
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
              shouldReset={!open}
              postSubmit={() => setOpen(false)}
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
