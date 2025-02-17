'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2Icon, XIcon } from 'lucide-react';
import { JSEditor } from '@/components/playground/js-editor';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentsStore } from '@/store/documents-store-provider';
import { useOutputStore } from '@/store/output-store-provider';
import type { TextFile } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Editor({ declarationFiles }: { declarationFiles: TextFile[] }) {
  const { setOutput } = useOutputStore((state) => state);
  const { openTabs, activeTab, setActiveTab, documents, closeDocument } =
    useDocumentsStore((state) => state);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(``);
  const workerRef = useRef<Worker | null>(
    (() => {
      if (typeof window !== 'undefined') {
        return new Worker(new URL('@/workers/build-docx.ts', import.meta.url));
      } else {
        return null; // for SSR
      }
    })()
  );

  // terminate worker
  useEffect(() => {
    const worker = workerRef.current;
    return () => {
      worker?.terminate();
    };
  }, []);

  // worker event listeners
  const onmessage = useCallback(
    (
      event: MessageEvent<{
        status: 'success' | 'error';
        name: string;
        payload: Blob;
      }>
    ) => {
      if (event.data.name !== activeTab) {
        console.debug('worker.onmessage(name!==activeTab)', event.data);
        return;
      }
      if (event.data.status === 'success') {
        setErrorMessage(``);
        setOutput(event.data.name, event.data.payload);
      } else {
        console.debug('worker.onmessage(type===error)', event.data);
        setErrorMessage(String(event.data.payload));
      }
      setIsCompiling(false);
    },
    [activeTab, setOutput]
  );
  const onerror = useCallback((error: ErrorEvent) => {
    console.debug('worker.onerror', error);
    setIsCompiling(false);
    setErrorMessage(String(error));
  }, []);

  const onmessageerror = useCallback((error: MessageEvent) => {
    console.debug('worker.onmessageerror', error);
    setIsCompiling(false);
    setErrorMessage(String(error));
  }, []);

  if (workerRef.current) {
    workerRef.current.onmessage = onmessage;
    workerRef.current.onerror = onerror;
    workerRef.current.onmessageerror = onmessageerror;
  }

  // re-build on active tab change or any document change
  useEffect(() => {
    setErrorMessage(``); // reset error message when active tab changes or any document change
    const activeFile = documents.find((doc) => doc.name === activeTab);
    if (activeFile && workerRef.current) {
      setIsCompiling(true); // compile if there is an active file
      workerRef.current.postMessage({
        name: activeFile.name,
        text: activeFile.text,
      });
    }
  }, [documents, activeTab]);

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
                <TabsContent
                  value={doc.name}
                  key={doc.name}
                  className='mt-0'
                  tabIndex={-1} // to prevent focus on Tab trigger (fix for accessibility size issue)
                >
                  <JSEditor
                    name={doc.name}
                    defaultValue={doc.text}
                    declarationFiles={declarationFiles}
                    errorMessage={errorMessage}
                  />
                </TabsContent>
              );
            })
            .filter(Boolean)}
        </Tabs>
      )}
    </>
  );
}
