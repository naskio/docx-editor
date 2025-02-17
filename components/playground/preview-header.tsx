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
    </>
  );
}

export const PreviewHeaderMemoized = React.memo(PreviewHeader);
