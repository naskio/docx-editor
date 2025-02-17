import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GithubIcon, TwitterIcon } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { env } from '@/lib/env';

export function Header() {
  return (
    <div className='grid grid-cols-1 items-center px-5 py-4 sm:grid-cols-3 sm:py-6'>
      <p className='text-muted-foreground hidden text-start text-sm sm:block'>
        Create .docx on the browser
      </p>
      <div className='flex justify-center'>
        <Logo className='w-[8rem] sm:w-[12rem]' />
      </div>
      <div className='hidden flex-row justify-end gap-x-2 sm:flex'>
        {[
          [
            !!env.repositoryUrl && (
              <Link
                key={0}
                href={env.repositoryUrl}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'icon' })
                )}
                target='_blank'
                rel='noopener noreferrer'
              >
                <GithubIcon />
              </Link>
            ),
            `View on GitHub`,
          ],
          [
            !!env.twitterUrl && (
              <Link
                key={1}
                href={env.twitterUrl}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'icon' })
                )}
                target='_blank'
                rel='noopener noreferrer'
              >
                <TwitterIcon />
              </Link>
            ),
            `Follow on Twitter`,
          ],
        ].map(([icon, label], index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>{icon}</TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <ModeToggle />
      </div>
    </div>
  );
}
