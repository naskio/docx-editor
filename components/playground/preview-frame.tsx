import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

function PreviewFrame({
  ref,
  isLoading,
  iframeSrc,
  iframeSrcDoc,
}: {
  ref?: React.Ref<HTMLIFrameElement>;
  isLoading: boolean;
  iframeSrc?: string;
  iframeSrcDoc?: string;
}) {
  if (isLoading) {
    return (
      <div className='grow p-3'>
        <Skeleton className='h-full' />
      </div>
    );
  }
  if (iframeSrc || iframeSrcDoc) {
    return (
      <ScrollArea className='grow [&>div>div]:!h-full'>
        <iframe
          ref={ref}
          className='h-full w-full'
          src={iframeSrc}
          srcDoc={iframeSrcDoc}
        ></iframe>
      </ScrollArea>
    );
  }
  return null;
}

export const PreviewFrameMemoized = React.memo(PreviewFrame);
