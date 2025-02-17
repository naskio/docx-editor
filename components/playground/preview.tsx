'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { PreviewFrameMemoized } from '@/components/playground/preview-frame';
import { PreviewHeaderMemoized } from '@/components/playground/preview-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useOutputStore } from '@/store/output-store-provider';
import { useSettingsStore } from '@/store/settings-store-provider';
import { renderDocx } from '@/lib/render-docx';

export function Preview() {
  console.log(`rendering Preview`);
  const { renderingLibrary, setRenderingLibrary } = useSettingsStore(
    (state) => state
  );
  const { name, blob, errorMessage } = useOutputStore((state) => state);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string | undefined>(
    undefined
  );
  const title = name || `Preview`;

  // re-render on out change or renderingLibrary change
  useEffect(() => {
    let isMounted = true;
    if (name && blob) {
      setIsRendering(true);
      renderDocx(name, blob, renderingLibrary).then(
        async ({ status, payload }) => {
          console.debug(`re-rendering ${name} with ${renderingLibrary}`);
          if (!isMounted) return;
          await new Promise((resolve) => setTimeout(resolve, 2000));
          if (status === 'success') {
            const iframeEl = payload as HTMLIFrameElement;
            setIframeSrc(iframeEl.src || undefined);
            setIframeSrcDoc(iframeEl.srcdoc || undefined);
          } else {
            console.error('renderDocx', payload);
          }
          setIsRendering(false);
        }
      );
    }
    return () => {
      isMounted = false;
    };
  }, [name, blob, renderingLibrary]);

  return (
    <div className='flex h-full flex-col'>
      <PreviewHeaderMemoized
        name={title}
        blob={blob}
        renderingLibrary={renderingLibrary}
        setRenderingLibrary={setRenderingLibrary}
      />
      <Separator />
      {Boolean(errorMessage) && (
        <div className='dark:bg-sidebar px-6 py-3'>
          <Alert
            variant='destructive'
            className='dark:bg-destructive dark:text-white'
          >
            <AlertCircle className='h-5 w-5 dark:text-white' />
            <AlertTitle className='text-lg font-bold'>Error:</AlertTitle>
            <AlertDescription className='text-md font-bold'>
              {errorMessage?.replace(`Error:`, '')}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <PreviewFrameMemoized
        isLoading={isRendering && !iframeSrc && !iframeSrcDoc}
        iframeSrc={iframeSrc}
        iframeSrcDoc={iframeSrcDoc}
      />
    </div>
  );
}
