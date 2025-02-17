import { Metadata } from 'next';
import { Header } from '@/components/playground/header';
import { Separator } from '@/components/ui/separator';
import { DevEnv } from '@/components/playground/dev-env';
import { loadTextFiles } from '@/lib/file-system';

export default function PlaygroundPage() {
  const templates = loadTextFiles(`*.js`, `public/templates`, true);
  const declarationFiles = loadTextFiles(
    `**/index.d.ts`,
    `node_modules/docx`,
    false
  ).map((file) => {
    file.name = `node_modules/@types/docx/index.d.ts`;
    return file;
  });

  return (
    <section className='flex h-screen w-full flex-col'>
      <Header />
      <Separator />
      <div className='grow overflow-hidden'>
        <DevEnv templates={templates} declarationFiles={declarationFiles} />
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Playground',
};
