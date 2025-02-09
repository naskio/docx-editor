import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Page() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <>
      <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20'>
        <main className='dark:bg-gray row-start-2 flex flex-col items-center gap-8 sm:items-start'>
          <Image
            src={`${basePath}/logo.svg`}
            alt='Docx Editor logo'
            width={256}
            height={64}
            priority
          />
          <h1 className='text-3xl font-bold underline dark:bg-amber-700 dark:text-white'>
            Hello, Next.js with Tailwind CSS!
          </h1>
          <Button>Get started</Button>
        </main>
        <div className='rounded-lg bg-white px-6 py-8 ring shadow-xl ring-gray-900/5 dark:bg-gray-800'>
          <div>
            <span className='inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg'>
              <svg className='h-6 w-6 stroke-white'>X</svg>
            </span>
          </div>
          <h3 className='mt-5 text-base font-medium tracking-tight text-gray-900 dark:text-white'>
            Writes upside-down
          </h3>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            The Zero Gravity Pen can be used to write in any orientation,
            including upside-down. It even works in outer space.
          </p>
        </div>
      </div>
    </>
  );
}
