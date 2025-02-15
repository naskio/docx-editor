'use client';

import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { usePreviewStore } from '@/store/preview-store-provider';
import { useSettingsStore } from '@/store/settings-store-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { download } from '@/lib/download';
import { Skeleton } from '@/components/ui/skeleton';
import { env } from '@/lib/env';
import {
  renderWithDocxJS,
  renderWithMammothJS,
  renderWithGoogleDocs,
  renderWithMicrosoftOffice,
} from '@/lib/docx';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Settings } from '@/lib/types';

const renderer: Record<
  Settings['renderingLibrary'],
  (blob: Blob) => Promise<HTMLIFrameElement>
> = {
  docxjs: renderWithDocxJS,
  'mammoth.js': renderWithMammothJS,
  'Google Docs': renderWithGoogleDocs,
  Office: renderWithMicrosoftOffice,
};

export function Preview() {
  const { renderingLibrary, setRenderingLibrary } = useSettingsStore(
    (state) => state
  );
  const { out, resetPreview } = usePreviewStore((state) => state);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    let isMounted = true;
    if (out) {
      setIsRendering(true);
      renderer[renderingLibrary](out.blob).then((iframe) => {
        if (!isMounted) return;
        if (iframe.src) {
          setIframeSrc(iframe.src);
          setIframeSrcDoc(undefined);
        } else if (iframe.srcdoc) {
          setIframeSrc(undefined);
          setIframeSrcDoc(iframe.srcdoc);
        } else {
          setIframeSrc(undefined);
          setIframeSrcDoc(undefined);
          resetPreview();
        }
        setIsRendering(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [out, renderingLibrary, resetPreview]);

  return (
    <div className='flex h-full flex-col'>
      <div className='bg-sidebar flex flex-row flex-wrap items-center justify-between gap-y-2 p-2'>
        <p className='text-muted-foreground text-sm font-medium'>
          {out?.name || `Preview`}
        </p>
        <div className='flex flex-row gap-x-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='bg-sidebar text-sidebar-foreground'
                  disabled={!out}
                  onClick={() => {
                    if (out) download(`${out.name}.docx`, out.blob);
                  }}
                >
                  <SaveIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download .docx</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Select value={renderingLibrary} onValueChange={setRenderingLibrary}>
            <SelectTrigger className='w-[128px]'>
              <SelectValue placeholder='Select a library' />
            </SelectTrigger>
            <SelectContent className='text-sidebar-foreground'>
              {env.renderingLibraries.map((library, index) => (
                <SelectItem value={library} key={index}>
                  {library}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      {isRendering ? (
        <div className='grow p-3'>
          <Skeleton className='h-full' />
        </div>
      ) : (
        <ScrollArea className='grow [&>div>div]:!h-full'>
          <iframe
            className='h-full w-full'
            src={iframeSrc}
            srcDoc={iframeSrcDoc}
          ></iframe>
        </ScrollArea>
      )}
    </div>
  );
}
