import React from 'react';
import { SaveIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { download } from '@/lib/download';
import { env } from '@/lib/env';
import type { Settings } from '@/lib/types';

const tooltips: Record<Settings['renderingLibrary'], [string, string]> = {
  docxjs: [`⚡`, `(Recommended) works in the browser`],
  'mammoth.js': [`🦣`, `(Recommended) works in the browser`],
  Office: [
    `⚠️`,
    `(Not recommended) requires file upload/publicly accessible URL`,
  ],
  Docs: [
    `⚠️`,
    `(Not recommended) requires file upload/publicly accessible URL`,
  ],
};

function PreviewHeader({
  name,
  blob,
  renderingLibrary,
  setRenderingLibrary,
  displayReloadButton,
  iframeRef,
}: {
  name: string;
  blob?: Blob;
  renderingLibrary: string;
  setRenderingLibrary: (library: string) => void;
  displayReloadButton: boolean;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
}) {
  return (
    <>
      <div className='bg-sidebar flex flex-row flex-wrap items-center justify-between gap-y-2 p-2'>
        <p className='text-muted-foreground text-sm font-medium'>{name}</p>
        <div className='flex flex-row gap-x-2'>
          {displayReloadButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='bg-sidebar text-sidebar-foreground'
                  onClick={() => {
                    const iframeEl = iframeRef?.current;
                    if (iframeEl?.src) {
                      iframeEl.src = `${iframeEl.src}`; // force reload iframe
                    }
                  }}
                >
                  <RefreshCwIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reload</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='bg-sidebar text-sidebar-foreground'
                disabled={!blob}
                onClick={() => {
                  if (blob) download(`${name}.docx`, blob);
                }}
              >
                <SaveIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download .docx</p>
            </TooltipContent>
          </Tooltip>
          <Select value={renderingLibrary} onValueChange={setRenderingLibrary}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className='w-[144px]'>
                  <SelectValue placeholder='Select a library' />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select the rendering library</p>
              </TooltipContent>
            </Tooltip>
            <SelectContent className='text-sidebar-foreground'>
              {env.renderingLibraries.map((library, index) => (
                <SelectItem value={library} key={index}>
                  <Tooltip>
                    <TooltipTrigger>{tooltips[library][0]}</TooltipTrigger>
                    <TooltipContent>{tooltips[library][1]}</TooltipContent>
                  </Tooltip>
                  {` `}
                  {library}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

export const PreviewHeaderMemoized = React.memo(PreviewHeader);
