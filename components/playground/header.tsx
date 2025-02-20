import Link from 'next/link';
import { GithubIcon, TwitterIcon } from 'lucide-react';
import { Logo } from '@/components/logo';
import { ButtonModeToggle } from '@/components/mode-toggle';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { env } from '@/lib/env';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <div className='grid grid-cols-1 items-center px-5 py-4 sm:grid-cols-3 sm:py-6'>
      <p className='text-muted-foreground hidden text-start text-sm sm:block'>
        Create .docx on the browser
      </p>
      <div className='flex justify-center'>
        <Link href='/'>
          <Logo className='w-[8rem] sm:w-[12rem]' />
        </Link>
      </div>
      <div className='hidden flex-row justify-end gap-x-2 sm:flex'>
        {[
          [
            !!env.repositoryUrl && (
              <Link
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
          <Tooltip key={index}>
            <TooltipTrigger asChild>{icon}</TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        <ButtonModeToggle />
      </div>
    </div>
  );
}
