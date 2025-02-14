'use client';

import React, { useEffect, useState } from 'react';
import { XIcon, Loader2Icon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePreviewStore } from '@/store/preview-store-provider';
import { useDocumentsStore } from '@/store/documents-store-provider';
import { buildDocument, documentToBlob } from '@/lib/docx';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function Editor() {
  const { setPreview } = usePreviewStore((state) => state);
  const { openTabs, activeTab, setActiveTab, documents, closeDocument } =
    useDocumentsStore((state) => state);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  useEffect(() => {
    if (documents.length) {
      const selected = documents.find((doc) => doc.name === activeTab);
      if (selected) {
        setIsCompiling(true);
        const doc = buildDocument(selected.text);
        documentToBlob(doc).then((blob) => {
          setPreview(selected.name, blob);
          setIsCompiling(false);
        });
      }
    }
  }, [documents, setPreview, activeTab]);

  return (
    <>
      {Boolean(openTabs?.length) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className='h-full'>
          <TabsList className='bg-sidebar text-sidebar-foreground h-13 w-full justify-start gap-x-1 rounded-none'>
            {openTabs.map((docName) => (
              <TabsTrigger
                value={docName}
                key={docName}
                autoFocus={docName === activeTab}
                className='h-9 gap-x-2 border px-2 focus-visible:h-9 focus-visible:ring-1 focus-visible:ring-offset-0'
                onKeyDown={(e) => {
                  // if delete or backspace is pressed => close the document
                  if (e.key === 'Delete' || e.key === 'Backspace') {
                    closeDocument(docName);
                    e.preventDefault();
                  }
                }}
              >
                {docName}
                {isCompiling && activeTab === docName ? (
                  <Loader2Icon className='size-6 animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]' />
                ) : (
                  <XIcon
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      `text-sidebar-accent-foreground size-6`
                    )}
                    onPointerDown={(e) => {
                      closeDocument(docName);
                      e.preventDefault();
                    }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <Separator />
          {openTabs
            .map((docName) => {
              const doc = documents.find((d) => d.name === docName);
              if (!doc) return;
              return (
                <TabsContent value={doc.name} key={doc.name} className='mt-0'>
                  <div>{doc.text}</div>
                </TabsContent>
              );
            })
            .filter(Boolean)}
        </Tabs>
      )}
    </>
  );
}
