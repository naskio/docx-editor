import React from 'react';
import { XIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentsStore } from '@/store/documents-store-provider';
import { cn } from '@/lib/utils';

function EditorTabItem({ name }: { name: string }) {
  const closeDocument = useDocumentsStore((state) => state.closeDocument);
  return (
    <TabsTrigger
      value={name}
      key={name}
      autoFocus={true}
      className='h-9 gap-x-2 border px-2 focus-visible:h-9 focus-visible:ring-1 focus-visible:ring-offset-0'
      onKeyDown={(e) => {
        // if delete or backspace is pressed => close the document
        if (e.key === 'Delete' || e.key === 'Backspace') {
          closeDocument(name);
          e.preventDefault();
        }
      }}
    >
      {name}
      <XIcon
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          `text-sidebar-accent-foreground size-6`
        )}
        onPointerDown={(e) => {
          closeDocument(name);
          e.preventDefault();
        }}
      />
    </TabsTrigger>
  );
}

const EditorTabItemMemoized = React.memo(EditorTabItem);

function EditorTabsList({ openTabs }: { openTabs: string[] }) {
  return (
    <TabsList className='bg-sidebar text-sidebar-foreground h-13 w-full justify-start gap-x-1 rounded-none'>
      {openTabs.map((docName) => (
        <EditorTabItemMemoized key={docName} name={docName} />
      ))}
    </TabsList>
  );
}

export const EditorTabsListMemoized = React.memo(EditorTabsList);
