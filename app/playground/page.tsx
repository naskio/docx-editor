import { Metadata } from 'next';
import { Header } from '@/components/playground/header';
import { Separator } from '@/components/ui/separator';
import { DevEnv } from '@/components/playground/dev-env';

export default function PlaygroundPage() {
  return (
    <>
      <div className='flex h-full w-full flex-col'>
        <div className='h-16 sm:h-24'>
          <Header />
        </div>
        <Separator />
        <div className='grow'>
          <DevEnv />
        </div>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: 'Playground',
};
