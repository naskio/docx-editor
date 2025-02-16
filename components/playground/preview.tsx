'use client';

import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { useOutputStore } from '@/store/output-store-provider';
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
import { renderDocx } from '@/lib/render-docx';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Preview() {
  const { renderingLibrary, setRenderingLibrary } = useSettingsStore(
    (state) => state
  );
  const { out } = useOutputStore((state) => state);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string | undefined>(
    undefined
  );

  // re-render on out change or renderingLibrary change
  useEffect(() => {
    let isMounted = true;
    if (out) {
      setIsRendering(true);
      renderDocx(out.name, out.blob, renderingLibrary).then(
        ({ status, payload }) => {
          console.log(`re-rendering ${out.name} with ${renderingLibrary}`);
          if (!isMounted) return;
          if (status === 'success') {
            const iframeEl = payload as HTMLIFrameElement;
            if (iframeEl.src) {
              setIframeSrc(iframeEl.src);
              setIframeSrcDoc(undefined);
            } else if (iframeEl.srcdoc) {
              setIframeSrc(undefined);
              setIframeSrcDoc(iframeEl.srcdoc);
            } else {
              setIframeSrc(undefined);
              setIframeSrcDoc(undefined);
            }
          } else {
            console.log('renderDocx', payload);
          }
          setIsRendering(false);
        }
      );
    }
    return () => {
      isMounted = false;
    };
  }, [out, renderingLibrary]);

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
