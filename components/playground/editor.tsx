'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EditorTabsContentMemoized } from '@/components/playground/editor-tabs-content';
import { EditorTabsListMemoized } from '@/components/playground/editor-tabs-list';
import { Separator } from '@/components/ui/separator';
import { Tabs } from '@/components/ui/tabs';
import { useDocumentsStore } from '@/store/documents-store-provider';
import { useOutputStore } from '@/store/output-store-provider';
import { useSettingsStore } from '@/store/settings-store-provider';
import type { TextFile } from '@/lib/types';

export function Editor({ declarationFiles }: { declarationFiles: TextFile[] }) {
  const setOutput = useOutputStore((state) => state.setOutput);
  const saveDocumentDebounceWait = useSettingsStore(
    (state) => state.saveDocumentDebounceWait
  );
  const {
    openTabs,
    activeTab,
    setActiveTab,
    documents,
    buildErrors,
    setBuildError,
  } = useDocumentsStore((state) => state);
  const [, setIsCompiling] = useState<boolean>(false);
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
        payload: {
          name: string;
          text: string;
          blob?: Blob;
          buildError?: Error | string;
        };
      }>
    ) => {
      if (event.data.payload.name !== activeTab) {
        console.debug('worker.onmessage(name!==activeTab)', event.data);
        return;
      }
      if (event.data.status === 'success') {
        setOutput({
          name: event.data.payload.name,
          text: event.data.payload.text,
          blob: event.data.payload.blob,
          globalError: undefined,
        });
        setBuildError(event.data.payload.name, undefined);
      } else {
        console.debug('worker.onmessage(status===error)', event.data);
        setOutput({ globalError: String(event.data.payload.buildError) });
        setBuildError(
          event.data.payload.name,
          String(event.data.payload.buildError)
        );
      }
      setIsCompiling(false);
    },
    [activeTab, setOutput, setBuildError]
  );

  // when worker throws an error
  const onerror = useCallback(
    (error: ErrorEvent) => {
      console.error('worker.onerror', error);
      setIsCompiling(false);
      setOutput({ globalError: String(error.message) });
    },
    [setOutput]
  );

  // when worker throws an error while sending a message
  const onmessageerror = useCallback(
    (error: MessageEvent) => {
      console.error('worker.onmessageerror', error);
      setIsCompiling(false);
      setOutput({ globalError: String(error.data) });
    },
    [setOutput]
  );

  if (workerRef.current) {
    workerRef.current.onmessage = onmessage;
    workerRef.current.onerror = onerror;
    workerRef.current.onmessageerror = onmessageerror;
  }

  // re-build on active tab change or any document change
  useEffect(() => {
    const activeFile = documents.find((doc) => doc.name === activeTab);
    if (activeFile && workerRef.current) {
      // reset error message when we start compiling
      setOutput({ globalError: undefined }); // this will re-render Preview
      setIsCompiling(true); // compile if there is an active file
      workerRef.current.postMessage({
        name: activeFile.name,
        text: activeFile.text,
      });
    }
  }, [documents, activeTab, setOutput]);

  if (!openTabs.length) {
    return (
      <div className='flex flex-col text-muted-foreground h-full items-center justify-center'>
        {!documents?.length ? 'Create a new document...' : 'Open a document...'}
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='h-full'>
      <EditorTabsListMemoized openTabs={openTabs} />
      <Separator />
      <EditorTabsContentMemoized
        openTabs={openTabs}
        documents={documents}
        buildErrors={buildErrors}
        declarationFiles={declarationFiles}
        saveDocumentDebounceWait={saveDocumentDebounceWait}
      />
    </Tabs>
  );
}
