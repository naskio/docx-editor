'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { PreviewFrameMemoized } from '@/components/playground/preview-frame';
import { PreviewHeaderMemoized } from '@/components/playground/preview-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useOutputStore } from '@/store/output-store-provider';
import { useSettingsStore } from '@/store/settings-store-provider';
import { env } from '@/lib/env';
import { renderDocx } from '@/lib/render-docx';

const baseUrl: string =
  typeof window !== 'undefined'
    ? `${window.location.origin}${env.basePath}`
    : ``;

export function Preview() {
  const { renderingLibrary, setRenderingLibrary } = useSettingsStore(
    (state) => state
  );
  const { name, blob, errorMessage } = useOutputStore((state) => state);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string | undefined>(
    undefined
  );
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const title = name || `Preview`;

  // re-render on out change or renderingLibrary change
  useEffect(() => {
    let isMounted = true;
    if (blob) {
      setIsRendering(true);
      renderDocx(title, blob, renderingLibrary, baseUrl).then(
        ({ status, payload }) => {
          if (!isMounted) return;
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
  }, [title, blob, renderingLibrary]);

  return (
    <div className='flex h-full flex-col'>
      <PreviewHeaderMemoized
        iframeRef={iframeRef}
        displayReloadButton={Boolean(iframeSrc)}
        name={title}
        blob={blob}
        renderingLibrary={renderingLibrary}
        setRenderingLibrary={setRenderingLibrary}
      />
      <Separator />
      {!iframeSrc && !iframeSrcDoc && Boolean(errorMessage) && (
        <div className='px-3 py-3'>
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
        ref={iframeRef}
        isLoading={isRendering && !iframeSrc && !iframeSrcDoc}
        iframeSrc={iframeSrc}
        iframeSrcDoc={iframeSrcDoc}
      />
    </div>
  );
}
