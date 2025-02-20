'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { PreviewFrameMemoized } from '@/components/playground/preview-frame';
import { PreviewHeaderMemoized } from '@/components/playground/preview-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useOutputStore } from '@/store/output-store-provider';
import { useSettingsStore } from '@/store/settings-store-provider';
import { env } from '@/lib/env';
import { renderDocx } from '@/lib/render-docx';
import type { Settings } from '@/lib/types';

// needed to build a publicly accessible URL when rendering using Office or Docs
const baseUrl: string =
  typeof window !== 'undefined'
    ? `${window.location.origin}${env.basePath}`
    : ``;

const debounceWaits: Record<Settings['renderingLibrary'], number> = {
  docxjs: 300,
  'mammoth.js': 300,
  Office: 3000,
  Docs: 5000,
};

export function Preview() {
  const { renderingLibrary, setSettings } = useSettingsStore((state) => state);
  const { name, text, blob, globalError } = useOutputStore((state) => state);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string | undefined>(
    undefined
  );
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const setRenderingLibrary = useCallback(
    (library: string) => {
      setSettings({
        renderingLibrary: library,
        saveDocumentDebounceWait: debounceWaits[library],
      });
    },
    [setSettings]
  );

  // re-render on out change or renderingLibrary change
  useEffect(() => {
    let isMounted = true;
    if (name && text && blob) {
      setIsRendering(true);
      renderDocx(name, text, blob, renderingLibrary, baseUrl).then(
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
  }, [name, text, blob, renderingLibrary]);

  return (
    <div className='flex h-full flex-col'>
      <PreviewHeaderMemoized
        iframeRef={iframeRef}
        displayReloadButton={Boolean(iframeSrc)}
        name={name || `Preview`}
        blob={blob}
        renderingLibrary={renderingLibrary}
        setRenderingLibrary={setRenderingLibrary}
      />
      <Separator />
      {Boolean(globalError) && (
        <div className='px-3 py-3'>
          <Alert
            variant='destructive'
            className='dark:bg-destructive dark:text-white'
          >
            <AlertCircle className='h-5 w-5 dark:text-white' />
            <AlertTitle className='text-lg font-bold'>Error:</AlertTitle>
            <AlertDescription className='text-md font-bold'>
              {globalError?.replace(`Error:`, '')}
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
