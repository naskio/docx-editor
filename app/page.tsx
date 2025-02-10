import Link from 'next/link';
import getConfig from 'next/config';
import { GithubIcon, StarIcon, PlayIcon } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function HeroPage() {
  const {
    serverRuntimeConfig: { basePath, repositoryUrl },
  } = getConfig();
  return (
    <section className='flex h-screen flex-col items-center justify-center'>
      <div className='container'>
        <div
          className='absolute inset-x-0 top-0 -z-10 flex h-full w-full items-center justify-center dark:invert'
          style={{
            background: `url(${basePath}/magic-pattern.svg) 50% / cover repeat`,
          }}
        />
        <div className='mx-auto flex max-w-5xl flex-col items-center'>
          <div className='z-10 flex flex-col items-center gap-6 text-center'>
            <Logo width={288} height={72} />
            <div>
              <h1 className='mb-6 text-2xl font-bold text-pretty lg:text-5xl'>
                Create word documents in the browser
              </h1>
              <p className='text-muted-foreground mx-2 sm:mx-0 lg:text-xl'>
                A browser-based editor that helps you create .docx files using{' '}
                <Link
                  href='https://docx.js.org/'
                  className='hover:underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Docx.js
                </Link>{' '}
                with live preview.
              </p>
            </div>
            <div className='mt-4 flex justify-center gap-4'>
              <Link
                href='/playground'
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  `h-14 rounded-4xl px-6 text-lg sm:px-12`
                )}
              >
                Get started <PlayIcon className='ml-2 h-5! w-5!' />
              </Link>
              <Link
                href={repositoryUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  `h-14 rounded-4xl px-6 text-lg sm:px-12`
                )}
              >
                GitHub <GithubIcon className='ml-2 h-5! w-5!' />
              </Link>
            </div>
            <p className='text-muted-foreground mx-2 mt-20 text-center text-lg sm:mx-0 lg:text-left'>
              Support the project on{' '}
              <Link
                href={repositoryUrl}
                className='hover:underline'
                target='_blank'
                rel='noopener noreferrer'
              >
                GitHub
              </Link>
              <Link
                href={repositoryUrl}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  `ml-0 text-amber-400 sm:ml-1`
                )}
                target='_blank'
                rel='noopener noreferrer'
              >
                <StarIcon />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
