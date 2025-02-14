import { Metadata } from 'next';
import { Header } from '@/components/playground/header';
import { Separator } from '@/components/ui/separator';
import { DevEnv } from '@/components/playground/dev-env';
import { loadTemplates } from '@/lib/templates';

export default function PlaygroundPage() {
  const templates = loadTemplates();
  return (
    <>
      <div className='flex h-full w-full flex-col'>
        <div className='h-16 sm:h-24'>
          <Header />
        </div>
        <Separator />
        <div className='grow overflow-hidden'>
          <DevEnv templates={templates} />
        </div>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: 'Playground',
};
